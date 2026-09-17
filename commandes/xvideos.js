const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "xvideos",
    categorie: "18+",
    reaction: "🔞"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("⚠️ *Please provide a valid XVideos link!*\n\n*Example:* `.xvideos https://www.xvideos.com/video.hppakie6a79/mia_khalifa_fucks_a_fanboy`");
    }

    const videoUrl = arg.join(" ");

    try {
        await repondre("⏳ *Downloading video from XVideos, please wait...*");

        // API Endpoint using the working API server base
        const apiUrl = `https://api-faa.my.id/download/xvideos?url=${encodeURIComponent(videoUrl)}`;
        
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        // Parse response data
        const videoData = resData.result || resData.data || resData;
        const downloadLink = videoData.url || videoData.download_url || videoData.dl_url || videoData.video || videoData.high || videoData.low;
        const title = videoData.title || videoData.heading || "XVideos Video";

        if (!downloadLink) {
            return repondre("❌ Failed to retrieve the download link. Please verify the link and try again.");
        }

        const caption = `🔞 *TIMNASA-MD XVIDEOS DOWNLOADER* 🔞\n\n` +
                        `📌 *Title:* ${title}\n\n` +
                        `> *Powered by TIMNASA-MD*`;

        // Send the downloaded video message
        await zk.sendMessage(dest, {
            video: { url: downloadLink },
            caption: caption,
            mimetype: "video/mp4"
        }, { quoted: ms });

    } catch (error) {
        console.error("XVideos Command Error:", error.message);
        return repondre("❌ Request failed. The API server might be unreachable or the video link is invalid.");
    }
});
