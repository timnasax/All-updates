"use strict";

const { zokou, cm } = require("../framework/zokou");
const conf = require("../set");
const moment = require("moment-timezone");

// Helper function to format uptime
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
    const channelJid = "120363406146813524@newsletter";

    try {
        // Date and Time Setup
        const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");
        const uptime = formatUptime(process.uptime());
        
        // Organize commands by category
        const list_menu = {};
        cm.forEach((command) => {
            if (!command.nomCom || command.nomCom.trim() === "") return;
            const category = command.categorie || "Other";
            if (!list_menu[category]) {
                list_menu[category] = [];
            }
            if (!list_menu[category].includes(command.nomCom)) {
                list_menu[category].push(command.nomCom);
            }
        });

        // ═══════════════ MWONEKANO MUPYA WA MENU ═══════════════
        let menuMsg = `
╭─────────────➣
│ ⚡ *TIMNASA-TMD SYSTEM* ⚡
├───────────────
│ 👤 *User:* ${nomAuteurMessage || "User"}
│ ⚙️ *Prefix:* [ ${prefixe} ]
│ 📅 *Date:* ${date}
│ ⏰ *Time:* ${time}
│ ⏳ *Uptime:* ${uptime}
│ 📊 *Total Commands:* ${cm.length}
╰─────────────➣

◈──── ❮ *COMMAND PANELS* ❯ ────◈
`;

        // Categories & Commands Styling
        const categories = Object.keys(list_menu).sort();
        for (const cat of categories) {
            menuMsg += `\n┌───〔 *${cat.toUpperCase()}* 〕`;
            for (const cmd of list_menu[cat]) {
                menuMsg += `\n│ ➣ ${prefixe}${cmd}`;
            }
            menuMsg += `\n└─────────────────\n`;
        }

        menuMsg += `\n*─────────── TIMNASA TMD ───────────*
> 💡 *Tip:* Type *${prefixe}<command>* to execute.`;

        // Direct Image Link ya ImgBB
        const menuImg = "https://i.ibb.co/s9n8pn7m/image.jpg";

        // Send Menu Payload
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
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Menu Error:", error);
        repondre("❌ Error: " + error.message);
    }
});
