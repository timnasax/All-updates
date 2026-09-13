const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "apkdl",
    alias: ["apk", "downloadapk"],
    categorie: "Download",
    reaction: "📦"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    // Check if user provided a URL
    if (!arg || arg.length === 0) {
      return repondre(
        "❌ *Please provide an APK detail URL!*\n\n" +
        "*Usage:* `.apkdl <url>`\n" +
        "*Example:* `.apkdl https://apk4all.com/...`"
      );
    }

    const targetUrl = arg[0];

    try {
      await repondre("⏳ *Fetching APK download link, please wait...*");

      const response = await axios.get(
        `https://apiskeith.top/download/apk?url=${encodeURIComponent(targetUrl)}`
      );

      if (response.data && response.data.status) {
        const result = response.data.result;
        const downloadUrl = result.downloadUrl || result.url || result.link;
        const appName = result.name || result.title || "APK File";

        let caption = `✅ *APK FOUND*\n\n`;
        caption += `📱 *Name:* ${appName}\n`;
        caption += `🔗 *Download Link:* ${downloadUrl}`;

        return repondre(caption);
      } else {
        const errorMsg = response.data?.result || "Invalid or unsupported APK URL.";
        return repondre(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error("APK Download Error:", error.message);
      return repondre("❌ Failed to fetch the APK. Please check your URL and try again.");
    }
  }
);
