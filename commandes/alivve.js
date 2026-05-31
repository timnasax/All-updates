const { zokou } = require("../framework/zokou");
const os = require("os");

zokou({
    nomCom: "speed",
    categorie: "General",
    reaction: "🌐"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;

    // Maelezo ya Bot
    const uptime = process.uptime();
    const saa = Math.floor(uptime / 3600);
    const dakika = Math.floor((uptime % 3600) / 60);
    const sekunde = Math.floor(uptime % 60);

    const aliveMsg = `
*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ɪs ᴏɴʟɪɴᴇ* ⚡

*Hi @${auteurMessage.split("@")[0]}*
Ninapumua na niko tayari kukuhudumia!

━━━━━━━━━━━━━━━━━━━━━
🌟 *Owner:* TIMNASA TMD
🚀 *Uptime:* ${saa}h ${dakika}m ${sekunde}s
🖥️ *Platform:* ${os.platform()}
🛰️ *Speed:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB RAM
━━━━━━━━━━━━━━━━━━━━━

*Mtaalam wa:*
- Video/Audio Downloads
- Reaction GIFs
- Group Management
- Na mengine mengi...

_Tumia .menu kuona amri zote._`;

    // 1. Tuma ujumbe wa Alive (Unaweza kuweka picha au video fupi hapa)
    await zk.sendMessage(dest, { 
        image: { url: "https://files.catbox.moe/lqx6sp.jpg" }, // Weka picha yako ya logo hapa
        caption: aliveMsg,
        mentions: [auteurMessage]
    }, { quoted: ms });

    // 2. Tuma Newsletter (View Channel)
    await zk.sendMessage(dest, {
        newsletterJid: "120363413554978773@newsletter",
        newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
        serverMessageId: 1
    });

});
