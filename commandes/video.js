const { zokou } = require("../framework/zokou");
const yts = require("yt-search");

zokou({
    nomCom: "video",
    categorie: "Download",
    reaction: "🎥"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
        return repondre("Tafadhali weka jina la video unayotafuta. Mfano: .video Diamond Platnumz Komasava");
    }

    try {
        const mtafutaji = await yts(arg.join(" "));
        const video = mtafutaji.videos[0];

        if (!video) return repondre("Video haijapatikana.");

        let caption = `
*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*
━━━━━━━━━━━━━━━━━━━━
🎥 *Jina:* ${video.title}
⏱️ *Muda:* ${video.timestamp}
👤 *Channel:* ${video.author.name}
🔗 *Link:* ${video.url}
━━━━━━━━━━━━━━━━━━━━
_Video inatumwa, tafadhali subiri..._`;

        // 1. Kutuma Maelezo na Picha ya Video kwanza
        await zk.sendMessage(dest, { image: { url: video.thumbnail }, caption: caption }, { quoted: ms });

        // 2. Kutuma Video yenyewe (Tumia API ya kugeuza kwenda MP4)
        const videoDownloadUrl = `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(video.url)}`;
        
        await zk.sendMessage(dest, { 
            video: { url: videoDownloadUrl }, 
            caption: `Hii hapa video yako: ${video.title}`,
            mimetype: 'video/mp4'
        }, { quoted: ms });

        // 3. --- TUMA NEWSLETTER (VIEW CHANNEL) ---
        // Hapa ndipo bot inatangaza channel yako baada ya kazi kuisha
        await zk.sendMessage(dest, {
            newsletterJid: "120363413554978773@newsletter",
            newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
            serverMessageId: 1
        });

    } catch (error) {
        console.log(error);
        repondre("Hitilafu imetokea: " + error.message);
    }
});
