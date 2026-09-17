const { zokou } = require("../framework/zokou");
const axios = require("axios");

// ==========================================
// 1. APK SEARCH COMMAND (.apksearch / .appsearch)
// ==========================================
zokou({
    nomCom: "apksearch",
    categorie: "Download",
    reaction: "🔍"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide an app name to search!*\n\n*Example:* \`${prefixe}apksearch xender\``);
    }

    const searchQuery = arg.join(" ");

    try {
        await repondre("⏳ *Searching for application, please wait...*");

        const apiUrl = `https://apis-keith.vercel.app/api/aptoide-search?q=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const resData = response.data;

        const list = resData.result?.datalist?.list || [];

        if (!resData.status || list.length === 0) {
            return repondre("❌ No applications found for your query.");
        }

        const results = list.slice(0, 5);
        let caption = `📲 *APK SEARCH RESULTS* 📲\n\n🔍 *Query:* ${searchQuery}\n\n`;

        results.forEach((app, index) => {
            const sizeMB = app.file?.filesize ? (app.file.filesize / (1024 * 1024)).toFixed(1) + " MB" : "N/A";
            caption += `*${index + 1}.* ${app.name}\n`;
            caption += `📦 *Package:* \`${app.package}\`\n`;
            caption += `📊 *Size:* ${sizeMB}\n`;
            caption += `🔗 *Download:* ${app.file?.path || "N/A"}\n\n`;
        });

        caption += `> *Use \`${prefixe}apkdl <package_name_or_link>\` to download.*`;

        const firstIcon = results[0]?.icon;
        if (firstIcon) {
            await zk.sendMessage(dest, { image: { url: firstIcon }, caption: caption }, { quoted: ms });
        } else {
            await zk.sendMessage(dest, { text: caption }, { quoted: ms });
        }

    } catch (error) {
        console.error("APK Search Error:", error.message);
        return repondre("❌ Request failed. The API server might be unreachable.");
    }
});


// ==========================================
// 2. APK DOWNLOAD COMMAND (.apkdl / .appdl)
// ==========================================
zokou({
    nomCom: "apkdl",
    categorie: "Download",
    reaction: "📲"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre(`⚠️ *Please provide an app name or package name!*\n\n*Example:* \`${prefixe}apkdl cn.xender\``);
    }

    const appQuery = arg.join(" ");

    try {
        await repondre("⏳ *Fetching APK details and downloading...*");

        const apiUrl = `https://apis-keith.vercel.app/download/apk?q=${encodeURIComponent(appQuery)}`;
        const response = await axios.get(apiUrl, { timeout: 45000 });
        const resData = response.data;

        if (!resData.status || !resData.result) {
            return repondre("❌ Failed to fetch application details. Please check the name and try again.");
        }

        const app = resData.result;
        const caption = `📲 *TIMNASA-MD APK DOWNLOADER* 📲\n\n` +
                        `📌 *Name:* ${app.packageName || appQuery}\n` +
                        `👤 *Developer:* ${app.developer || "N/A"}\n` +
                        `🔢 *Version:* ${app.version || "N/A"}\n` +
                        `📦 *Size:* ${app.fileSize || "N/A"}\n` +
                        `📅 *Updated:* ${app.update || "N/A"}\n\n` +
                        `> *Sending APK file, please wait...*`;

        await repondre(caption);

        const downloadUrl = app.downloadLink || app.redirectLink;
        if (!downloadUrl) {
            return repondre("❌ Could not obtain a direct download link.");
        }

        await zk.sendMessage(dest, {
            document: { url: downloadUrl },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${app.packageName \vert{}\vert{} "App"}_${app.version || "v1"}.apk`,
            caption: `✅ *Downloaded successfully via TIMNASA-MD*`
        }, { quoted: ms });

    } catch (error) {
        console.error("APK Download Error:", error.message);
        return repondre("❌ Failed to download APK. The file might be too large or the server timed out.");
    }
});
