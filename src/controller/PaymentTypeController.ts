import {AppDataSource} from "../config/db";
import {NextFunction, Request, Response} from "express";
import {PaymentType} from "../entity/PaymentType";
import {RestException} from "../middilwares/RestException";
import axios from "axios";
import {payme_cards, getPaymeUserId, paymeLogin} from "./PaymeController";


const paymentTypeRepository = AppDataSource.getRepository(PaymentType);
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
                res.json({success: true, data:paymentType})
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
            res.json({success:true, data:cards});
            return ;
        }
        res.json({success: false, message: 'No cards'});

    } catch (err) {
        next(err)
    }
}

