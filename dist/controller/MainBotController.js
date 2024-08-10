"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchBot = exports.setWebhook = void 0;
const telegraf_1 = require("telegraf");
const bot = new telegraf_1.Telegraf('7497360325:AAGKdUMQfqB6Npi_rzxkwEBxPXwHGICCxbw');
bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
const setWebhook = (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
};
exports.setWebhook = setWebhook;
const launchBot = () => {
    bot.launch();
    console.log('Telegram bot started');
};
exports.launchBot = launchBot;
console.log('Bot is running...');
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
