const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "chatbot-pro",
    alias: ["cbpro", "autoai"],
    categorie: "AI",
    reaction: "🤖"
},
async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    // Restrict command usage to the bot owner
    if (!superUser) return repondre("❌ This command is restricted to the Bot Owner only!");

    const status = arg[0]?.toLowerCase();

    if (status === "on") {
        global.chatbotProStatus = true;
        return repondre("✅ *CHATBOT-PRO ENABLED!*\n\nThe bot will now automatically respond to all Private Messages and Group chats using AI.");
    } else if (status === "off") {
        global.chatbotProStatus = false;
        return repondre("❌ *CHATBOT-PRO DISABLED!*");
    } else {
        return repondre("🤖 *CHATBOT-PRO CONTROL PANEL*\n\nUse the following commands:\n🔹 *.chatbot-pro on* (Enable AI responses)\n🔹 *.chatbot-pro off* (Disable AI responses)");
    }
});
