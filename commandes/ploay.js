const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const axios = require('axios');

zokou({
    nomCom: "song",
    categorie: "Music",
    reaction: "🎵"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
        return repondre("Tafadhali weka jina la wimbo. Mfano: .play Diamond Platnumz Shu");
    }

    try {
        const mtafutaji = await yts(arg.join(" "));
        const video = mtafutaji.videos[0]; // Inachukua matokeo ya kwanza

        if (!video) return repondre("Wimbo haujapatikana.");

        let caption = `
*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ᴍᴜsɪᴄ ᴘʟᴀʏᴇʀ*
━━━━━━━━━━━━━━━━━━━━
🌟 *Jina:* ${video.title}
⏱️ *Muda:* ${video.timestamp}
👁️ *Views:* ${video.views}
🔗 *Link:* ${video.url}
━━━━━━━━━━━━━━━━━━━━
_Subiri kidogo, mziki unakuja..._`;

        // Tuma picha ya video na maelezo
        await zk.sendMessage(dest, { image: { url: video.thumbnail }, caption: caption }, { quoted: ms });

        // Kutumia API kupata Audio (Nimetumia API ya mfano, unaweza kubadili kama unayo nyingine)
        const downloadUrl = `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(video.url)}`;
        
        // Kutuma Audio
        await zk.sendMessage(dest, { 
            audio: { url: downloadUrl }, 
            mimetype: 'audio/mp4', 
            ptt: false 
        }, { quoted: ms });

        // --- TUMA NEWSLETTER (VIEW CHANNEL) ---
        await zk.sendMessage(dest, {
            newsletterJid: "120363413554978773@newsletter",
            newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
            serverMessageId: 1
        });

    } catch (error) {
        console.log(error);
        repondre("Hitilafu imetokea wakati wa kupata mziki: " + error.message);
    }
});
