const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const { items } = require("./utils");
const { getCategories, getItems } = require("./scrapping");

let usersSessions = [];

let greeting =
  "Bem vindo ao Tracker Bot.\nDigite uma das opções para saber mais.\n";
items.forEach((item, i) => {
  greeting += `${i + 1})${item.site}\n`;
});

const token = process.env.TELEGRAM_API_KEY;
// const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const userSession = usersSessions.find((user) => user.id === msg.chat.id);

  // reset state - step0
  if (msg.text === "/reset") {
    const userIndex = usersSessions.findIndex(
      (user) => user.id === msg.chat.id
    );
    usersSessions.splice(userIndex, 1);
    return bot.sendMessage(msg.chat.id, "Sessão reinciada.");
  }

  // first user access - step1
  if (!userSession) {
    usersSessions.push({
      id: msg.chat.id,
      hasAlreadyaccessed: false,
      hasShownGreeting: false,
    });
    return bot.sendMessage(msg.chat.id, "Qual seu nome?");
  }

  // second or later user acess - step2(mandatory)
  if (
    !userSession.hasShownGreeting &&
    (userSession.hasAlreadyaccessed || !userSession.name)
  ) {
    usersSessions.forEach((user) => {
      if (user.id === msg.chat.id) {
        if (!userSession.hasAlreadyaccessed) {
          user.name = msg.text;
        }
        user.hasShownGreeting = true;
      }
    });

    return bot.sendMessage(msg.chat.id, `Olá ${userSession.name}. ${greeting}`);
  }

  // user selects store to grap info - step3(mandatory)
  if (!userSession.store && !isNaN(msg.text)) {
    const item = items.find((item) => item.id === Number(msg.text));
    usersSessions.forEach((user) => {
      if (user.id === msg.chat.id) {
        user.store = item;
      }
    });
    const value = await getCategories(item);
    return bot.sendMessage(msg.chat.id, value);
  }

  // user selects the category to grap info about the trending products - step4(mandatory)
  if (userSession.store && !isNaN(msg.text)) {
    const value = await getItems(userSession.store, msg.text);
    usersSessions.forEach((user) => {
      if (user.id === msg.chat.id) {
        user.store = null;
        user.hasAlreadyaccessed = true;
        user.hasShownGreeting = false;
      }
    });
    return bot.sendMessage(msg.chat.id, value);
  }

  // user typed something wrong
  return bot.sendMessage(msg.chat.id, "Desculpe. Tente outra coisa.");
});
