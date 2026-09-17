const { zokou } = require("../framework/zokou");
const axios = require("axios");

// ==========================================
// 1. XNXX DOWNLOADER COMMAND (.xnxx)
// ==========================================
zokou({
    nomCom: "xnxx",
    categorie: "18+",
    reaction: "🔞"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide an XNXX video link!*\n\n*Example:* \`${prefixe}xnxx https://www.xnxx.com/video-1fodo377/sexy_vecina_se_pone_a_cuatro_patas\``);
    }

    const videoUrl = arg.join(" ");

    try {
        await repondre("⏳ *Downloading video from XNXX, please wait...*");

        const apiUrl = `https://apis-keith.vercel.app/download/xnxx?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        if (!resData.status || !resData.result) {
            return repondre("❌ Failed to fetch video details. Please check the link and try again.");
        }

        const videoInfo = resData.result;
        const title = videoInfo.title || "XNXX Video";
        const duration = videoInfo.duration ? `${videoInfo.duration} seconds` : "N/A";
        const info = videoInfo.info || "";
        
        const videoDownloadUrl = videoInfo.files?.high || videoInfo.files?.low;

        if (!videoDownloadUrl) {
            return repondre("❌ Could not find a valid video stream URL.");
        }

        const caption = `🔞 *TIMNASA-MD XNXX DOWNLOADER* 🔞\n\n` +
                        `📌 *Title:* ${title}\n` +
                        `⏱️ *Duration:* ${duration}\n` +
                        `ℹ️ *Info:* ${info}\n\n` +
                        `> *Powered by TIMNASA-MD*`;

        await zk.sendMessage(dest, {
            video: { url: videoDownloadUrl },
            caption: caption,
            mimetype: "video/mp4"
        }, { quoted: ms });

    } catch (error) {
        console.error("XNXX Command Error:", error.message);
        return repondre("❌ Request failed. The API server might be down or the video URL is invalid.");
    }
});


// ==========================================
// 2. XVIDEOS DOWNLOADER COMMAND (.xvdl / .xvideos)
// ==========================================
zokou({
    nomCom: "xvdl",
    categorie: "18+",
    reaction: "🔞"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide an XVideos link!*\n\n*Example:* \`${prefixe}xvdl https://www.xvideos.com/video.hppakie6a79/mia_khalifa_fucks_a_fanboy\``);
    }

    const videoUrl = arg.join(" ");

    try {
        await repondre("⏳ *Downloading video from XVideos, please wait...*");

        const apiUrl = `https://apis-keith.vercel.app/download/xvideos?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        if (!resData.status || !resData.result) {
            return repondre("❌ Failed to fetch video details. Please check the URL and try again.");
        }

        const videoInfo = resData.result;
        const title = videoInfo.title || "XVideos Video";
        const views = videoInfo.views || "N/A";
        const likes = videoInfo.likes || "N/A";
        const size = videoInfo.size || "N/A";
        const downloadUrl = videoInfo.download_url;

        if (!downloadUrl) {
            return repondre("❌ Could not find a valid download link.");
        }

        const caption = `🔞 *TIMNASA-MD XVIDEOS DOWNLOADER* 🔞\n\n` +
                        `📌 *Title:* ${title}\n` +
                        `👁️ *Views:* ${views}\n` +
                        `👍 *Likes:* ${likes}\n` +
                        `📦 *Size:* ${size}\n\n` +
                        `> *Powered by TIMNASA-MD*`;

        await zk.sendMessage(dest, {
            video: { url: downloadUrl },
            caption: caption,
            mimetype: "video/mp4"
        }, { quoted: ms });

    } catch (error) {
        console.error("XVideos Command Error:", error.message);
        return repondre("❌ Request failed. The API server might be down or the link is invalid.");
    }
});


// ==========================================
// 3. XVIDEOS SEARCH COMMAND (.xvsearch)
// ==========================================
zokou({
    nomCom: "xvsearch",
    categorie: "18+",
    reaction: "🔍"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide a search query!*\n\n*Example:* \`${prefixe}xvsearch mia khalifa\``);
    }

    const searchQuery = arg.join(" ");

    try {
        await repondre("⏳ *Searching XVideos, please wait...*");

        const apiUrl = `https://apis-keith.vercel.app/api/xvideos-search?q=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        if (!resData.status || !Array.isArray(resData.result) || resData.result.length === 0) {
            return repondre("❌ No results found for your search query.");
        }

        const results = resData.result.slice(0, 10);
        let responseMessage = `🔞 *XVIDEOS SEARCH RESULTS* 🔞\n\n🔍 *Query:* ${searchQuery}\n\n`;

        results.forEach((item, index) => {
            responseMessage += `*${index + 1}.* ${item.title || "No Title"}\n`;
            responseMessage += `⏱️ *Duration:* ${item.duration || "N/A"}\n`;
            responseMessage += `🔗 *Link:* ${item.url}\n\n`;
        });

        responseMessage += `> *Use \`${prefixe}xvdl <link>\` to download any video.*`;

        const firstThumb = results[0]?.thumb;

        if (firstThumb) {
            await zk.sendMessage(dest, {
                image: { url: firstThumb },
                caption: responseMessage
            }, { quoted: ms });
        } else {
            await zk.sendMessage(dest, { text: responseMessage }, { quoted: ms });
        }

    } catch (error) {
        console.error("XVideos Search Error:", error.message);
        return repondre("❌ Search failed. The API server might be down or unreachable.");
    }
});
