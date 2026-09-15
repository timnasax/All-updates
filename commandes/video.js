const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "videoplay",
    alias: ["playvideo", "vplay", "ytvideo"],
    categorie: "Download",
    reaction: "🎥"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;

    if (!arg[0]) {
      return repondre(`❌ *Matumizi:* ${prefixe}videoplay <link au jina la video>`);
    }

    const query = arg.join(" ");

    try {
      await repondre("⏳ *Inafanya kazi... Inapakua video yako!*");

      const apiUrl = `http://njabulo-ai.vercel.app/dl?url=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      const result = response.data?.result || response.data;
      const videoUrl = result?.downloadUrl || result?.url || result?.link;
      const title = result?.title || query;

      if (!videoUrl) {
        return repondre("❌ Imeshindikana kupata video. Hakikisha link au jina ni sahihi.");
      }

      const captionText = `🎥 *YOUTUBE VIDEO DOWNLOAD*\n\n` +
                          `📌 *Anwani:* ${title}\n\n` +
                          `👑 *Powered by Timnasa*`;

      await zk.sendMessage(
        dest,
        { video: { url: videoUrl }, caption: captionText },
        { quoted: ms }
      );

    } catch (error) {
      console.error("VideoPlay Error:", error.message);
      return repondre("❌ Kosa limetokea wakati wa kupakua video.");
    }
  }
);
