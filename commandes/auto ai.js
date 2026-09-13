const { zokou } = require("../framework/zokou");
const { getAutoAiStatus, setAutoAiStatus } = require("../framework/autoaiDb");

zokou(
  {
    nomCom: "autoai",
    alias: ["chatbot", "aichat"],
    categorie: "Owner",
    reaction: "🤖"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    // Zuia wasio ma-owner kutumia command hii
    if (!superUser) {
      return repondre("❌ Command hii ni kwa ajili ya Owner wa bot tu!");
    }

    const action = arg[0] ? arg[0].toLowerCase() : "";

    if (action === "on" || action === "enable") {
      setAutoAiStatus(true);
      return repondre("✅ *Auto AI Chatbot imeoshwa kikamilifu!* Bot itajibu papo hapo mtu akikutag au akiandika inbox.");
    } else if (action === "off" || action === "disable") {
      setAutoAiStatus(false);
      return repondre("🔴 *Auto AI Chatbot imezimwa.*");
    } else {
      const currentStatus = getAutoAiStatus() ? "ON 🟢" : "OFF 🔴";
      return repondre(
        `🤖 *AUTO AI CHATBOT SETTINGS*\n\n` +
        `*Status ya Sasa:* ${currentStatus}\n\n` +
        `*Matumizi:*\n` +
        `• \`.autoai on\` - Kuwasha Chatbot\n` +
        `• \`.autoai off\` - Kuzima Chatbot`
      );
    }
  }
);
