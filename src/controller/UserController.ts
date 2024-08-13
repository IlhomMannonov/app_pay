import {NextFunction, Request, Response} from "express";
import {AppDataSource} from "../config/db";
import {User} from "../entity/User";
import {RestException} from "../middilwares/RestException";
import axios from "axios";

const userRepository = AppDataSource.getRepository(User);

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const telegram_url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUserProfilePhotos`;
        const user_id = req.params.id;

        if (!user_id) throw RestException.notFound('user_id');

        // Foydalanuvchi ma'lumotlarini olish
        const user = await userRepository.findOne({
            where: {id: Number.parseInt(user_id)},
            select: ["id", 'first_name', 'last_name', 'phone_number', 'status', 'chat_id', 'is_bot_user', 'created_at']
        });

        if (!user) {
            throw RestException.notFound('User not found');
        }

        // Telegram API dan foydalanuvchi profil fotosuratlarini olish
        const tg_response = await axios.get(telegram_url, {params: {user_id: user.chat_id}}); // user.chat_id dan foydalansangiz, bu yerda chat_id ishlatiladi
        const photos = tg_response.data.result.photos;

        // Profil rasmining eng kichik versiyasini olish
        let profile_url = '';
        if (photos && photos.length > 0) {
            const smallestPhoto = photos[0][0]; // Har bir rasmning eng kichik formatini olish (photos[0][0])
            const file_id = smallestPhoto.file_id;

            // Fayl URL ni olish uchun Telegram API'dan foydalanish
            const fileResponse = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile`, {params: {file_id}});
            const filePath = fileResponse.data.result.file_path;
            profile_url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
        }

        // Foydalanuvchi ma'lumotlariga profile_url qo'shish
        user.profile_url = profile_url;

        res.json(user);
    } catch (err) {
        next(err);
    }
}