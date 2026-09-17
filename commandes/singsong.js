const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "singsong",
    categorie: "Download",
    reaction: "🎵"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide a YouTube URL!*\n\n*Example:* \`${prefixe}singsong https://youtube.com/watch?v=60ItHLz5WEA\``);
    }

    const videoUrl = arg.join(" ");

    try {
        await repondre("⏳ *Processing and downloading audio, please wait...*");

        const apiUrl = `https://apis-keith.vercel.app/download/audio?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        if (!resData.status || !resData.result) {
            return repondre("❌ Failed to retrieve the audio link. Please check the URL and try again.");
        }

        const audioDownloadUrl = typeof resData.result === "string" ? resData.result : resData.result?.url;

        const caption = `🎵 *TIMNASA-MD MUSIC DOWNLOADER* 🎵\n\n` +
                        `> *Powered by TIMNASA-MD*`;

        await zk.sendMessage(dest, {
            audio: { url: audioDownloadUrl },
            mimetype: "audio/mp4",
            ptt: false,
            caption: caption
        }, { quoted: ms });

    } catch (error) {
        console.error("Singsong Command Error:", error.message);
        return repondre("❌ Request failed. The API server might be down or unreachable.");
    }
});
