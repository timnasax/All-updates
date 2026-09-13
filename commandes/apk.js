const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "apkdl",
    alias: ["apk", "apk4all"],
    categorie: "Download",
    reaction: "📦"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    // Validate user input
    if (!arg || arg.length === 0) {
      return repondre(
        "❌ *Please provide an APK4All detail URL!*\n\n" +
        "*Usage:* `.apkdl <url>`\n" +
        "*Example:* `.apkdl https://apk4all.com/apps/whatsapp-messenger/`"
      );
    }

    const targetUrl = arg[0];

    try {
      await repondre("⏳ *Fetching and processing APK, please wait...*");

      // Request data from the API
      const response = await axios.get(
        `https://apiskeith.top/download/apk?url=${encodeURIComponent(targetUrl)}`
      );

      if (response.data && response.data.status) {
        const result = response.data.result;
        
        // Extract download link and application details safely
        const downloadUrl = result.downloadUrl || result.url || result.link || result.dl_url;
        const appName = result.name || result.title || "Application";

        if (!downloadUrl) {
          return repondre("❌ Unable to extract the download link from this URL.");
        }

        let captionText = `✅ *APK DOWNLOAD LINK FOUND*\n\n`;
        captionText += `📱 *Name:* ${appName}\n`;
        captionText += `🔗 *Download Link:* ${downloadUrl}\n\n`;
        captionText += `👑 *Bot by Timnasa Tmd*`;

        // Send text message with link first
        await repondre(captionText);

        // Attempt to send the APK file directly as a document
        try {
          await zk.sendMessage(
            dest,
            {
              document: { url: downloadUrl },
              mimetype: "application/vnd.android.package-archive",
              fileName: `${appName.replace(/[^a-zA-Z0-9]/g, "_")}.apk`
            },
            { quoted: ms }
          );
        } catch (docError) {
          console.log("Direct document delivery skipped/failed. Link provided in text.");
        }

      } else {
        const errorMsg = typeof response.data.result === "string" 
          ? response.data.result 
          : "Invalid URL or the API could not retrieve the APK.";
        return repondre(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error("APK Download Error:", error.message);
      return repondre("❌ Failed to fetch the APK. Please check your URL and try again.");
    }
  }
);
