import {NextFunction, Request, Response} from "express";
import {AppDataSource} from "../config/db";
import {Provider} from "../entity/Provider";
import {RestException} from "../middilwares/RestException";
import axios from "axios";
import {all_cards} from "./PaymeController"

const providerRepository = AppDataSource.getRepository(Provider);

export const getAllProviders = async (req: Request, res: Response): Promise<void> => {
    res.json(await providerRepository.find({
        where: {status: 'active'},
        order: {id: 'ASC'},
        select: ['id', 'name', 'status', 'currency', 'image_url', 'max_amount', 'min_amount']
    }));
}

export const getBiyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {provider_id} = req.params;
        if (!provider_id) throw RestException.badRequest("Provider is Required");

        const provider = await providerRepository.findOne({
            where: {id: Number.parseInt(provider_id)},
            select: ['id', 'name', 'status', 'currency', 'image_url', 'max_amount', 'min_amount']
        })
        if (!provider) throw RestException.badRequest("Provider Not found");

        res.json(provider)
    } catch (error) {
        next(error)
    }
}

export const provider_details = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {account_id, provider_id} = req.body;
        if (!account_id && !provider_id) throw RestException.badRequest("Type and Account ID is required");

        const provider = await providerRepository.findOne({where: {id: provider_id}});

        if (!provider) throw RestException.notFound('Provider');

        const data = await axios.get(provider.get_data_url, {
            params: {
                'account_id': account_id
            }
        })

        res.json(data.data)
    } catch
        (err) {
        next(err)
    }

}
