const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "singsong",
    categorie: "Download",
    reaction: "🎵"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("⚠️ *Please provide a YouTube video URL or song title!*\n\n*Example:* `.singsong https://youtube.com/watch?v=60ItHLz5WEA`");
    }

    const query = arg.join(" ");

    try {
        await repondre("⏳ *Processing and downloading your song, please wait...*");

        let videoUrl = query;

        // If the user typed a search query instead of a URL, fetch the YouTube link first
        if (!query.startsWith("http://") && !query.startsWith("https://")) {
            const searchApi = `https://api-faa.my.id/youtube/search?query=${encodeURIComponent(query)}`;
            const searchResponse = await axios.get(searchApi, { timeout: 15000 });
            
            const searchData = searchResponse.data?.result || searchResponse.data?.[0] || searchResponse.data;
            if (searchData && (searchData.url || searchData.link)) {
                videoUrl = searchData.url || searchData.link;
            } else {
                return repondre("❌ Could not find any song matching your query.");
            }
        }

        // Endpoint for downloading audio using your API structure
        const downloadApiUrl = `https://api-faa.my.id/download/audio?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(downloadApiUrl, { timeout: 45000 });
        const resData = response.data;

        // Extract audio URL and song details
        const audioData = resData.result || resData.data || resData;
        const downloadLink = audioData.url || audioData.download_url || audioData.dl_url || audioData.audio;
        const title = audioData.title || audioData.heading || "YouTube Audio";

        if (!downloadLink) {
            return repondre("❌ Failed to retrieve the audio download link. Please try again later.");
        }

        const caption = `🎵 *TIMNASA-MD MUSIC DOWNLOADER* 🎵\n\n` +
                        `📌 *Title:* ${title}\n\n` +
                        `> *Powered by TIMNASA-MD*`;

        // Send audio file
        await zk.sendMessage(dest, {
            audio: { url: downloadLink },
            mimetype: "audio/mp4",
            ptt: false,
            caption: caption
        }, { quoted: ms });

    } catch (error) {
        console.error("Singsong Command Error:", error.message);
        return repondre("❌ Request failed. The API server might be down or the song couldn't be processed.");
    }
});
