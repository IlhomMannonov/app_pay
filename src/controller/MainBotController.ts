import { Telegraf } from 'telegraf';
import {Request, Response} from 'express';

const bot = new Telegraf('7497360325:AAGKdUMQfqB6Npi_rzxkwEBxPXwHGICCxbw');

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there!'));


export const setWebhook = (req: Request, res: Response) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
};

export const launchBot = () => {
    bot.launch();
    console.log('Telegram bot started');
};
console.log('Bot is running...');


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
