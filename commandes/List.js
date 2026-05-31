const { zokou } = require("../framework/zokou");
const os = require("os");
const { format } = require("util");

zokou({
    nomCom: "list",
    categorie: "General",
    reaction: "📜"
},
async (dest, zk, commandeOptions) => {
    const { ms, auteurMessage } = commandeOptions;

    // Taarifa za Mfumo
    const uptime = process.uptime();
    const saa = Math.floor(uptime / 3600);
    const dakika = Math.floor((uptime % 3600) / 60);
    const sekunde = Math.floor(uptime % 60);

    const menuMsg = `
┏━━━━━━━ *ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ* ━━━━━━┓
┃  *USER:* @${auteurMessage.split("@")[0]}
┃  *UPTIME:* ${saa}h ${dakika}m ${sekunde}s
┃  *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem / 1024 / 1024 / 1024)}GB
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔════════════════════╗
      *📥 DOWNLOADER*
╠════════════════════╝
│ 🎵 .play [jina la wimbo]
│ 🎥 .video [jina la video]
│ 🔍 .yts [tafuta YouTube]
╚════════════════════╝

╔════════════════════╗
      *🎭 REACTIONS*
╠════════════════════╝
│ 👊 .bully   |  😊 .hug
│ 😘 .kiss    |  👅 .lick
│ 👋 .pat     |  😏 .smug
│ 🔨 .bonk    |  🚀 .yeet
│ 😄 .smile   |  💃 .dance
│ 😢 .cry     |  😉 .wink
╚════════════════════╝

╔════════════════════╗
      *🛠️ TOOLS*
╠════════════════════╝
│ 🆔 .getjid (Pata ID ya Channel)
│ 📜 .menu (Onyesha Menu)
╚════════════════════╝

*OWNER:* TIMNASA TMD
*CHANNEL:* https://whatsapp.com/channel/0029VajVf6v30VLVm7pU9M28
`;

    // 1. Tuma Menu na Picha (Background)
    await zk.sendMessage(dest, { 
        image: { url: "https://files.catbox.moe/lqx6sp.jpg" }, // Weka link ya picha yako hapa
        caption: menuMsg,
        mentions: [auteurMessage]
    }, { quoted: ms });

    // 2. Tuma Newsletter (View Channel) moja kwa moja
    await zk.sendMessage(dest, {
        newsletterJid: "120363413554978773@newsletter",
        newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
        serverMessageId: 1
    });

});
