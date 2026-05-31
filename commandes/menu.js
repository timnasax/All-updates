const { zokou, commands } = require("../framework/zokou");
const os = require("os");
const conf = require("../set");

// --- CONFIGURATION ENGINE ---
const channelLink = "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u";
const channelJid = "120363316279146194@newsletter";

// GitHub Raw URL for Timothyx audio file from timnasax/All-updates
const githubAudioUrl = "https://raw.githubusercontent.com/timnasax/All-updates/main/Timothyx.mp3";

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

// ---------------- COMMAND: ULTIMATE HEROIC AUTO-MENU ----------------
zokou({
    nomCom: "menu",
    aliases: ["help", "panel", "h"],
    categorie: "General",
    reaction: "⚔️"
}, async (dest, zk, info) => {
    const { ms, mybotpic, nomAuteurMessage, auteurMessage } = info;

    try {
        const serverUptime = runtime(process.uptime());
        const totalCommands = commands.length;

        // 1. Tafuta Picha ya Mtumiaji (User Profile Pic) aliyetuma amri au weka ya Bot kama mbadala
        let userPic;
        try {
            userPic = await zk.profilePictureUrl(auteurMessage, 'image');
        } catch {
            userPic = mybotpic(); // Picha ya bot ikifeli ya user
        }

        // 2. Panga Amri kwa Makundi (GitHub Auto-Scan)
        const organizedCommands = {};
        commands.forEach((cmd) => {
            if (!organizedCommands[cmd.categorie]) {
                organizedCommands[cmd.categorie] = [];
            }
            organizedCommands[cmd.categorie].push(cmd.nomCom);
        });

        // 3. Muonekano wa Kishujaa wa Dashboard (Heroic Layout)
        let menuDisplay = `*⚡ TIMNASA MD • CORE COMMANDER ⚡*\n\n`;
        menuDisplay += `*👤 COMMANDER:* ${nomAuteurMessage}\n`;
        menuDisplay += `*🛰️ UPTIME:* ${serverUptime}\n`;
        menuDisplay += `*🗂️ TOTAL SCRIPTS:* ${totalCommands} Operational\n`;
        menuDisplay += `*🧠 RAM:* ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB Free\n`;
        menuDisplay += `──────────────────────────\n\n`;

        // Auto-Scan Makundi yote ya amri kutoka kwenye faili zako zote
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

        // 4. Tuma Menu ikiwa na Picha ya Mtumiaji anayeomba
        await zk.sendMessage(dest, {
            image: { url: userPic },
            caption: menuDisplay,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA MD • MAIN CORE PROTOCOL",
                    body: `Commander: ${nomAuteurMessage} | System Online`,
                    thumbnailUrl: userPic,
                    sourceUrl: channelLink,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                },
                newsletterJid: channelJid,
                newsletterName: "TIMNASA MD SYSTEM MATRIX"
            }
        }, { quoted: ms });

        // 5. Tuma Wimbo wa Timothyx kutoka kwenye GitHub yako kiotomatiki
        await zk.sendMessage(dest, {
            audio: { url: githubAudioUrl },
            mimetype: "audio/mp4",
            ptt: true // true inatuma kama Voice Note ya kishujaa, weka false kama unataka uende kama faili la Audio la kawaida
        }, { quoted: ms });

    } catch (e) {
        console.error("Critical error in Advanced Menu Engine: ", e);
        await zk.sendMessage(dest, { text: "❌ Mainframe core deployment failed to synchronize." });
    }
});
