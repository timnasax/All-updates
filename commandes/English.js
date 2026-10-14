const { zokou } = require("../framework/zokou");
const { default: axios } = require('axios');

zokou({ 
    nomCom: 'english1',
    desc: 'Download audio/video from YouTube',
    Categorie: 'Download',
    reaction: '🎵', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre } = commandeOptions;
    
    if (!arg || arg.length === 0) {
      return repondre(`> *🎵 TIMNASA TMD MEDIA PLAYER*\n\nPlease provide a song name or YouTube link after the command.\n*Example:* .play Diamond Platnumz`);
    }

    const youtubeUrl = arg.join(" ");
    await repondre(`> *⏳ FETCHING AUDIO/VIDEO...*\n\nPlease wait a moment...`);

    try {
      const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(youtubeUrl)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data) {
        await repondre(`> *✅ SUCCESS*\n\n*Info:* Media retrieved successfully via the Timnasa Tmd API!`);
        // If your API returns a direct file/download link (e.g., data.url), you can use zk.sendMessage or send media functions here.
      } else {
        await repondre(`> *❌ ERROR*\n\nFailed to fetch media from the provided URL or name.`);
      }
    } catch (error) {
      console.error(error);
      await repondre(`> *⚠️ SYSTEM ERROR*\n\nSorry, an unexpected error occurred while processing your request.`);
    }
  }
);
