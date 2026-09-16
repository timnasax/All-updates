const { zokou } = require("../framework/zokou");
const fs = require("fs");
const path = require("path");

zokou(
  {
    nomCom: "chatbot",
    categorie: "AI",
    reaction: "🤖"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, arg, auteurMessage } = commandeOptions;

    const dataDir = path.join(__dirname, "../data");
    const chatbotFile = path.join(dataDir, "chatbot.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(chatbotFile)) {
      fs.writeFileSync(chatbotFile, JSON.stringify({}), "utf8");
    }

    const action = arg[0] ? arg[0].toLowerCase() : "";
    let chatbotData = JSON.parse(fs.readFileSync(chatbotFile, "utf8"));

    if (action === "on") {
      chatbotData[auteurMessage] = true;
      fs.writeFileSync(chatbotFile, JSON.stringify(chatbotData, null, 2));
      return repondre("✅ Auto-Chatbot has been enabled for your chats!");
    } else if (action === "off") {
      chatbotData[auteurMessage] = false;
      fs.writeFileSync(chatbotFile, JSON.stringify(chatbotData, null, 2));
      return repondre("❌ Auto-Chatbot has been disabled!");
    } else {
      return repondre("Usage:\n*.chatbot on* - Enable chatbot\n*.chatbot off* - Disable chatbot");
    }
  }
);
