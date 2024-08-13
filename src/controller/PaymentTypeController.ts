import {AppDataSource} from "../config/db";
import {Request, Response} from "express";
import {PaymentType} from "../entity/PaymentType";

const paymentTypeRepository = AppDataSource.getRepository(PaymentType);


export const getAllPaymentTypes = async (req: Request, res: Response): Promise<void> => {
    const payment_types = await paymentTypeRepository.find({
        order: {id: 'ASC'},
        select: ['id','name', 'image_url', 'redirect_url']
    });
    res.json(payment_types)
}