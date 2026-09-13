const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "autoai",
    alias: ["chatbot", "aichat"],
    categorie: "Owner",
    reaction: "🤖"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    if (!superUser) {
      return repondre("❌ Command hii ni kwa ajili ya Owner tu!");
    }

    try {
      const { getAutoAiStatus, setAutoAiStatus } = require("../framework/autoaiDb");
      const action = arg[0] ? arg[0].toLowerCase() : "";

      if (action === "on" || action === "enable") {
        setAutoAiStatus(true);
        return repondre("✅ *Auto AI Chatbot imeoshwa kikamilifu!*");
      } else if (action === "off" || action === "disable") {
        setAutoAiStatus(false);
        return repondre("🔴 *Auto AI Chatbot imezimwa.*");
      } else {
        const currentStatus = getAutoAiStatus() ? "ON 🟢" : "OFF 🔴";
        return repondre(
          `🤖 *AUTO AI CHATBOT SETTINGS*\n\n` +
          `*Status ya Sasa:* ${currentStatus}\n\n` +
          `*Matumizi:*\n` +
          `• \`.autoai on\` - Kuwasha\n` +
          `• \`.autoai off\` - Kuzima`
        );
      }
    } catch (e) {
      console.error(e);
      return repondre("❌ Error: Hakikisha faili la `framework/autoaiDb.js` lipo!");
    }
  }
);
