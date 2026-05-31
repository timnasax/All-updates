const { zokou } = require("../framework/zokou");
const { commands } = require("../framework/zokou"); // Inavuta amri zote zilizosajiliwa
const os = require("os");
const conf = require("../set");

// --- CONFIGURATION ---
const channelLink = "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u";

/**
 * Modern Uptime Formatter
 */
function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

// ---------------- COMMAND: AUTO-GENERATE MENU ----------------
zokou({
    nomCom: "menu",
    aliases: ["help", "panel", "h"],
    categorie: "General",
    reaction: "⚔️"
}, async (dest, zk, info) => {
    const { ms, mybotpic, nomAuteurMessage } = info;

    try {
        const serverUptime = runtime(process.uptime());
        const totalCommands = commands.length;

        // 1. Panga Amri kwa Makundi (Grouping Categories)
        const organizedCommands = {};
        commands.forEach((cmd) => {
            if (!organizedCommands[cmd.categorie]) {
                organizedCommands[cmd.categorie] = [];
            }
            organizedCommands[cmd.categorie].push(cmd.nomCom);
        });

        // 2. Kichwa cha Menu (Heroic Header)
        let menuDisplay = `*⚡ TIMNASA MD • CORE COMMANDER ⚡*\n\n`;
        menuDisplay += `*👤 COMMANDER:* ${nomAuteurMessage}\n`;
        menuDisplay += `*🛰️ UPTIME:* ${serverUptime}\n`;
        menuDisplay += `*🗂️ TOTAL SCRIPTS:* ${totalCommands} Operational\n`;
        menuDisplay += `*🧠 RAM:* ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB Free\n`;
        menuDisplay += `──────────────────────────\n\n`;

        // 3. Auto-Scan & Display Categories (Hapa ndipo inasoma GitHub files)
        const categories = Object.keys(organizedCommands).sort();
        
        for (const cat of categories) {
            menuDisplay += `*┏━━━⚡ ${cat.toUpperCase()} ⚡━━━┓*\n`;
            for (const cmdName of organizedCommands[cat]) {
                menuDisplay += `│ 🛡️ ${conf.PREFIXE}${cmdName}\n`;
            }
            menuDisplay += `*┗━━━━━━━━━━━━━━━━━━━━┛*\n\n`;
        }

        menuDisplay += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛɪᴍɴᴀsᴀ ᴍᴅ - 2026\n`;
        menuDisplay += `*📢 CHANNEL:* ${channelLink}`;

        // 4. Kutuma Menu kwa Mtindo wa Kibabe
        await zk.sendMessage(dest, {
            image: { url: mybotpic() },
            caption: menuDisplay,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA MD • AUTO-SCANNER ACTIVE",
                    body: "System Matrix Synchronized with GitHub",
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                    sourceUrl: channelLink,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                },
                newsletterJid: "120363316279146194@newsletter",
                newsletterName: "TIMNASA MD SYSTEM LOGS"
            }
        }, { quoted: ms });

    } catch (e) {
        console.error("Menu Auto-Scan Error: ", e);
        await zk.sendMessage(dest, { text: "❌ Failed to synchronize with GitHub command registry." });
    }
});
