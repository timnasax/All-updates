"use strict";

const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "ping",
    aliases: ["speed", "p"],
    categorie: "General",
    reaction: "⚡"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    const channelJid = "120363406146813524@newsletter";

    try {
        // Piga hesabu ya speed (latency)
        const start = Date.now();
        const end = Date.now();
        const pingTime = end - start;

        // Message caption
        const pingMsg = `
╭─────────────➣
│ ⚡ *TIMNASA-TMD PING* ⚡
├───────────────
│ 🚀 *Speed:* ${pingTime}ms
│ 🤖 *Status:* Online & Active
│ 👑 *System:* TIMNASA TMD
╰─────────────➣
`;

        // Direct Image URL ya ImgBB
        const pingImg = "https://i.ibb.co/0j1VnQW4/image.jpg";

        // Tuma ujumbe wenye picha na speed info
        await zk.sendMessage(dest, {
            image: { url: pingImg },
            caption: pingMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "🔮 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚂𝙿𝙴𝙴𝙳 🔮",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "⚡ 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙿𝙸𝙽𝙶 ⚡",
                    body: `Response Time: ${pingTime}ms`,
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
 mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Ping Error:", error);
        repondre("❌ Error: " + error.message);
    }
});
