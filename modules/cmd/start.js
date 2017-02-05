const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const mongoose = require('mongoose');
const config = require('../../config');
const Users = require('../db/users_model');
const NewUsers = require('../db/newUsers_model');
const sendMessage = require('../vk/sendMessage');

const bot = new TelegramBot(config.telegram_token, { polling: false });

var start = (msg) => {
  const writeUnique = (url_db, collection, search, data) => {
    mongoose.connect(url_db);

    collection.find(search, (err, results) => {
      if (results[0] && results[0].id == msg.from.id) {
        collection.update(search, data, err => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        var new_user = new collection(data);

        new_user.save(err => {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    sendMessage(data.vk_id, 'Авторизация прошла успешно.');

    mongoose.connection.close();
  };

  if (msg.text != '/start') {
    var hash = msg.text.split(' ')[1].split('_user_id=')[0];
    var user_id = msg.text.split(' ')[1].split('_user_id=')[1];
    var hashRegexp = /[a-z-0-9]{32}/g;
  }

  var settings = {
    parse_mode: 'HTML'
  };

  var message = `<b>Привет!</b>\n\n` +
    'Это бот для репоста постов из ВКонакте в Telegram.\n\n' +
    'Например, вы даете боту ссылку такого типа: https://vk.com/feed?w=wall-29534144_5332642, а он в ответ вам высылает содержимое этого поста.\n\n' +
    'Все последующие сообщения (без использования команд) будут рассматриваться как ссылки, если в тексте сообщения есть <b>vk.com</b> и идентификатор <b>wall</b>.\n\n' +
    'Наберите /help для справки.';

  if (hash && hashRegexp.test(hash) && user_id) {
    var data = {
      id: msg.from.id,
      vk_id: user_id,
      hash: hash
    };

    writeUnique(config.url_database, Users, { id: data.id }, data);
  } else {
    writeUnique(config.url_database, NewUsers, { id: msg.from.id }, { id: msg.from.id });

    message += '\n\n<b>Внимание! Для работы в связке ВК-Телеграм необходимо авторизоваться в боте, используя хэш. Получить его можно у бота по</b> <a href="https://vk.com/id383224823">ссылке</a><b>, написав ему /start.</b>';
  }

  bot.sendMessage(msg.from.id, message, settings);
};

module.exports = start;
