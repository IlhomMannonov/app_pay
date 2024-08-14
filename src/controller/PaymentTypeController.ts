import {AppDataSource} from "../config/db";
import {NextFunction, Request, Response} from "express";
import {PaymentType} from "../entity/PaymentType";
import {RestException} from "../middilwares/RestException";
import axios from "axios";
import {payme_cards, getPaymeUserId, paymeLogin, payme_login, p2p_create} from "./PaymeController";
import {User} from "../entity/User";
import {Provider} from "../entity/Provider";
import {Payme} from "../entity/Payme";


const paymentTypeRepository = AppDataSource.getRepository(PaymentType);
const userRepository = AppDataSource.getRepository(User);
const providerRepository = AppDataSource.getRepository(Provider);
const paymeRepository = AppDataSource.getRepository(Payme);
export const getAllPaymentTypes = async (req: Request, res: Response): Promise<void> => {
    const payment_types = await paymentTypeRepository.find({
        order: {id: 'ASC'},
        select: ['id', 'name', 'image_url', 'redirect_url']
    });
    res.json(payment_types)
}

export const chek_login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const {user_id, payment_id} = req.body;
        if (!user_id || !payment_id) throw RestException.badRequest("user_id is Reuired")

        const paymentType = await paymentTypeRepository.findOne({
            where: {id: payment_id}
        })
        if (!paymentType) throw RestException.notFound("Payment type ")

        if (paymentType.type == 'payme') {


            const payme = await getPaymeUserId(Number.parseInt(user_id));
            if (!payme) {
                res.json({success: false})
                return;
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

            if (myCards && myCards.data.error)
                res.json({success: false})
            else
                res.json({success: true, data: paymentType})
        } else {
            throw RestException.badRequest('Payment type not found')
        }

    } catch (err) {
        next(err)
    }
}


export const payment_type_cards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {payment_type_id, user_id} = req.body;
        const payment_type = await paymentTypeRepository.findOne({where: {id: payment_type_id}});

        if (!payment_type || !user_id) throw RestException.badRequest('Provider userid is not null');

        if (payment_type.type == 'payme') {
            const cards = await payme_cards(user_id);
            res.json({success: true, data: cards});
            return;
        }
        res.json({success: false, message: 'No cards'});

    } catch (err) {
        next(err)
    }
}

export const paying_provider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {


        const {card_id, provider_id, payment_type_id, amount, user_id} = req.body;
        if (!card_id || !provider_id || !payment_type_id || !amount) throw RestException.badRequest("card_id, user_id, provider_id, payment_type_id, amount is Reuired")

        const paymentType = await paymentTypeRepository.findOne({
            where: {id: payment_type_id}
        })
        if (!paymentType) throw RestException.notFound("Payment type ")

        const user = await userRepository.findOne({
            where: {id: user_id}
        })
        if (!user) throw RestException.notFound("User")

        const provider = await providerRepository.findOne({
            where: {id: provider_id}
        })
        if (!provider) throw RestException.notFound("User")

//     MAX VA MIN TEKSHIRAMIZ
        if (amount > provider.min_amount && amount <= provider.max_amount) {
            res.json({
                success: false,
                message: `Cheklov miqdorida emas! Minimal miqdor: ${provider.min_amount}, Maksimal miqdor: ${provider.max_amount}`
            })
            return;
        }

        switch (paymentType.type) {
            case "payme": {
                const pay_payme = await pay_with_payme(user, paymentType, card_id, provider, amount);
                res.json(pay_payme)
                return
            }
        }
        res.json("none")

    } catch (err) {
        next(err)
    }
}

export const confirm_pay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
}


const pay_with_payme = async (user: User, paymentType: PaymentType, card_id: string, provider: Provider, amount: number) => {
    const payme = await getPaymeUserId(user.id);

    if (!payme) return {success: false, message: "Payme account not found"}

    const login = await paymeLogin({
        params: {
            login: payme.phone_number,
            password: payme.password
        },
        method: "users.log_in",
    }, {
        'Device': payme.device
    }, payme);

    const p2p_res = await p2p_create(payme, amount)
    if (!p2p_res.success)
        return p2p_res


    const cheque_verify = await axios.post(`${process.env.PAYME_URL}cheque.verify`, {
        method: "cheque.verify",
        params: {
            id: p2p_res.data.cheque._id,
            card: card_id,
            browser: {
                is_java_enabled: false,
                is_javascript_enabled: true,
                timezone_offset: -300
            },
            screen: {
                color_depth: 24,
                height: 997,
                width: 460
            }
        }
    }, {
        headers: {
            'API-SESSION': payme.session,
            'Device': payme.device
        }
    });

    if (!cheque_verify.data.result)
        return {success: true, message: "Something error"}

    if (cheque_verify.data.result.method == 'otp') {
        return {success: true, data: cheque_verify.data.result, has_sms: true, cheque_id: p2p_res.data.cheque._id}
    } else {
        return {success: true, data: cheque_verify.data.result}

    }


}

