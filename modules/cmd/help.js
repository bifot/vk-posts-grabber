const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const bot = new TelegramBot(config.telegram_token, { polling: false });

var help = (msg) => {
  var settings = {
    parse_mode: 'markdown'
  };

  bot.sendMessage(msg.from.id, '— Бот не отправляет аудиозаписи, ибо этого не позволяет ВК Api;\n' +
                               '— Бот отправляет документы только с расширениями *gif*, *pdf* и *zip*, вес которых не больше 50 МБ;\n' +
                               '— Бот находится на этапе Бета-тестирования, поэтому возможны баги;\n' +
                               '— Все сообщения (не считая команд) бот воспринимает как ссылки и пытается их спарсить;\n' +
                               '— Доступные команды: /start, /help;\n' +
                               '— При возникновении каких-либо вопросов пишите разработчику (@bifot).', settings);
};

module.exports = help;
