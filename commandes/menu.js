"use strict";

const { zokou } = require("../framework/zokou");
const conf = require("../set");
const os = require("os");
const moment = require("moment-timezone");

// Helper function to format uptime into Hours, Minutes, and Seconds
function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

zokou({
    nomCom: "menu",
    aliases: ["help", "list"],
    categorie: "General",
    reaction: "👑"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou"); // Accesses the command registry
    const channelJid = "120363406146813524@newsletter";

    try {
        // Date and Time Setup
        const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");
        const uptime = formatUptime(process.uptime());
        
        // Organize commands by category (with duplicate prevention)
        const list_menu = {};
        cm.forEach((command) => {
            if (!command.nomCom || command.nomCom.trim() === "") return;
            if (!list_menu[command.categorie]) {
                list_menu[command.categorie] = [];
            }
            if (!list_menu[command.categorie].includes(command.nomCom)) {
                list_menu[command.categorie].push(command.nomCom);
            }
        });

        // Fancy Menu Header Block
        let menuMsg = `✨ *T I M N A S A - T M D* ✨
╔════════════════════╗
  🤖 *𝙱𝙾𝚃:* 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳
  👤 *𝚄𝚂𝙴𝚁:* ${nomAuteurMessage}
  📅 *𝙳𝙰𝚃𝙴:* ${date}
  ⌚ *𝚃𝙸𝙼𝙴:* ${time}
  ⏳ *𝚄𝙿𝚃𝙸𝙼𝙴:* ${uptime}
╚════════════════════╝

*╭──────────────⊷*
│ 🎯 *𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂:*
*╰──────────────⊷*
`;

        // Sort categories and list commands with elegant styling
        const categories = Object.keys(list_menu).sort();
        for (const cat of categories) {
            menuMsg += `\n*╔═════ ❖ [ ${cat.toUpperCase()} ] ❖ ═════╗*\n`;
            for (const cmd of list_menu[cat]) {
                menuMsg += `  │ 🌟 ${prefixe}${cmd}\n`;
            }
            menuMsg += `*╚══════════════════════╝*\n`;
        }

        menuMsg += `\n\n⚡ _Powered with love by TIMNASA TMD SYSTEM_ ⚡`;

        // Profile Picture or Menu Image
        let menuImg;
        try {
            menuImg = await zk.profilePictureUrl(zk.user.id, 'image');
        } catch {
            menuImg = conf.IMAGE_MENU || "https://files.catbox.moe/zm113g.jpg";
        }

        // Send Menu with Professional and Decorated Context
        await zk.sendMessage(dest, {
            image: { url: menuImg },
            caption: menuMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "🔮 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙰𝚄𝚃𝙾 𝙼𝙴𝙽𝚄 🔮",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "👑 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙾𝙵𝙵𝙸𝙲𝙸𝙰𝙻 𝙼𝙴𝙽𝚄 👑",
                    body: "Advanced WhatsApp Bot System",
                    thumbnailUrl: menuImg,
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                    mediaType: 1,
                    renderLargerThumbnail: true // Makes the link preview image nice and large
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Menu Error:", error);
        repondre("❌ An error occurred while loading the menu: " + error.message);
    }
});
