const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "spotify",
    categorie: "Download",
    reaction: "🎧"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide a Spotify URL!*\n\n*Example:* \`${prefixe}spotify https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT\``);
    }

    const trackUrl = arg.join(" ");

    try {
        await repondre("⏳ *Downloading track from Spotify, please wait...*");

        const apiUrl = `https://apis-keith.vercel.app/download/spotify?url=${encodeURIComponent(trackUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        if (!resData.status || resData.error) {
            console.error("Spotify API Error Output:", resData.error);
            return repondre(`❌ *Download Failed:* ${resData.error || "Request failed or HTTP status 403 returned."}`);
        }

        const audioData = resData.result;
        const downloadUrl = typeof audioData === "string" ? audioData : audioData?.url || audioData?.download_url;
        const title = audioData?.title || "Spotify Track";

        if (!downloadUrl) {
            return repondre("❌ Failed to retrieve Spotify audio download link.");
        }

        const caption = `🎧 *TIMNASA-MD SPOTIFY DOWNLOADER* 🎧\n\n` +
                        `📌 *Title:* ${title}\n\n` +
                        `> *Powered by TIMNASA-MD*`;

        await zk.sendMessage(dest, {
            audio: { url: downloadUrl },
            mimetype: "audio/mp4",
            ptt: false,
            caption: caption
        }, { quoted: ms });

    } catch (error) {
        console.error("Spotify Command Error:", error.message);
        return repondre("❌ Request failed. The API server encountered an issue or blocked the request.");
    }
});
