import {AppDataSource} from "../config/db";
import {NextFunction, Request, Response} from "express";
import {PaymentType} from "../entity/PaymentType";
import {RestException} from "../middilwares/RestException";
import {Payme} from "../entity/Payme";
import axios from "axios";
import {Provider} from "../entity/Provider";

const paymentTypeRepository = AppDataSource.getRepository(PaymentType);
const paymeRepository = AppDataSource.getRepository(Payme);
const providerRepository = AppDataSource.getRepository(Provider);


export const payme_login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {username, password, user_id} = req.body;

        // Majburiy parametrlarni tekshirish
        if (username == null || password == null || user_id == null) {
            throw RestException.badRequest("username, user_id and password are required");
        }

        if (!validPhone(username)) throw RestException.badRequest('Telefon raqam formati noto\'g\'ri')
        // paymeRepository orqali foydalanuvchini qidirish
        const payme = await getPaymeUserId(user_id);
        if (!payme) {
            throw RestException.badRequest("Payme not found");
        }

        payme.password = password;
        payme.phone_number = username;
        // paymeLogin funktsiyasi yordamida login qilish
        const loginResponse = await paymeLogin({
            params: {
                'login': username,
                'password': password,
            },
            'method': 'users.log_in',
        }, null, payme);

        const resSms: any = await axios.post(process.env.PAYME_URL + 'sessions.get_activation_code', {
            method: 'sessions.get_activation_code'
        }, {
            headers: {
                'API-SESSION': loginResponse.headers['api-session']
            }
        })
        paymeRepository.save(payme);
        res.json(resSms.data.result);

    } catch (error) {
        next(error); // Xatoni keyingi middleware-ga uzatish
    }
}

export const confirm_sms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {user_id, code} = req.body;
        if (user_id == null || code == null) {
            throw RestException.badRequest("user_id and code are required");
        }
        const payme = await getPaymeUserId(user_id);

        if (payme) {

            const response = await axios.post(process.env.PAYME_URL + "sessions.activate", {
                params: {
                    code: code,
                    to_reserve: false,
                },
                method: 'sessions.activate',
            }, {
                headers: {
                    'API-SESSION': payme.session
                }
            });
            payme.session = response.headers['api-session'];
            await paymeRepository.save(payme);
            const registerDevice: any = await axios.post(process.env.PAYME_URL + 'devices.register', {
                params: {
                    display: "AllPayBot",
                    type: 2,
                },

                method: "devices.register",
            }, {
                headers: {
                    'API-SESSION': response.headers['api-session']
                }
            });
            if (registerDevice.data.result && registerDevice.data.result.key) {
                payme.device = registerDevice.data.result._id + "; " + registerDevice.data.result.key + ";";
                payme.device_id = registerDevice.data.result._id;
                payme.device_key = registerDevice.data.result.key;
                await paymeRepository.save(payme);
            } else {
                res.json({success: false, message: "Sms kod noto'g'ri!"})
                return;
            }
        }
        res.json({success: true})

    } catch (error) {
        next(error);
    }
}

export const all_cards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {user_id} = req.query;
        if (typeof user_id !== 'string') throw RestException.badRequest("user_id is required and must be a string");

        const cards = await payme_cards(user_id);
        res.json(cards);

    } catch (error) {
        next(error)
    }
}

export const pay_to_provider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {provider_id, payment_type_id, card_id, amount} = req.body;
        if (!provider_id || !payment_type_id || !card_id || !amount) throw RestException.badRequest("Provider, Payment type, card, amount is Required");

        const paymentType = await paymentTypeRepository.findOne({where: {id: Number.parseInt(payment_type_id)}});
        const provider = await providerRepository.findOne({where: {id: Number.parseInt(provider_id)}});


    } catch (error) {
        next(error)
    }
}

export const chek_payme_login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

}


export const paymeLogin = async (body: any, headers: any, payme: any) => {
    const config = {
        headers: {
            'Content-Type': 'text/plain',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            ...headers
        }
    };

    // Payme API-ga POST so'rovi yuborish
    const login = await axios.post(`${process.env.PAYME_URL}users.log_in`, body, config);

    // Payme ma'lumotlarini yangilash va saqlash
    payme.is_active_session = payme.device != null;
    payme.session = login.headers['api-session'];
    await paymeRepository.save(payme);

    return login;
};


export const getPaymeUserId = async (user_id: number) => {
    const payme = await paymeRepository.findOne({where: {user_id: user_id}});
    if (!payme) {
        await paymeRepository.save(paymeRepository.create({
            user_id: user_id,
            is_active_session: false
        }));
    } else
        return payme;
}

function validPhone(phoneNumber: string) {
    const uzbPhoneRegex = /^\+998\s?\(?[0-9]{2}\)?\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/;
    return uzbPhoneRegex.test(phoneNumber);
}

export const payme_cards = async (user_id: string) => {


    // paymeRepository orqali foydalanuvchini qidirish
    const payme = await getPaymeUserId(Number.parseInt(user_id));

    if (!payme) {
        throw RestException.badRequest("Payme not found");
    }
    const login = await paymeLogin({
        params: {
            login: payme.phone_number,
            password: payme.password
        },
        method: "users.log_in",
    }, {
        'Device': payme.device
    }, payme);

    const myCards: any = await axios.post(process.env.PAYME_URL + 'cards.get_all', {
        method: 'cards.get_all'
    }, {
        headers: {
            'API-SESSION': login.headers['api-session'],
            'Device': payme.device
        }
    });
    return myCards.data.result.cards.map((card: any) => ({
        id: card._id,
        name: card.name,
        number: card.number,
        expire: card.expire,
        active: card.active,
        balance: card.balance,
    }));
}