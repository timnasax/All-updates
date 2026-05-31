const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const axios = require("axios");

// --- CONFIGURATION ---
const BaseUrl = process.env.GITHUB_GIT;
const giftedapikey = process.env.BOT_OWNE;
const channelJid = "120363316279146194@newsletter"; // Your Channel JID
const channelLink = "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u";

zokou({
  nomCom: "audio",
  aliases: ["mp3", "song", "play"],
  categorie: "Download",
  reaction: "🎶"
}, async (dest, zk, info) => {
  const { ms, repondre, arg } = info;
  const query = arg.join(" ");

  // 1. Check if user provided a search term
  if (!query) return repondre("Please provide a song name or YouTube link (e.g., .audio Perfect - Ed Sheeran)");

  try {
    // 2. Search YouTube for the video
    const search = await yts(query);
    const video = search.videos;

    if (!video) return repondre("Sorry, I couldn't find that song.");

    // 3. Status update for the user
    await zk.sendMessage(dest, { 
        text: `⏳ *TIMNASA MD is fetching your audio...*\n\n*Title:* ${video.title}\n*Duration:* ${video.timestamp}` 
    }, { quoted: ms });

    // 4. API Call to download the MP3
    const apiUrl = `${BaseUrl}/api/download/ytmp3?url=${encodeURIComponent(video.url)}&apikey=${giftedapikey}`;
    const response = await axios.get(apiUrl);
    const res = response.data;

    if (res.status === 200 && res.success) {
      const downloadUrl = res.result.download_url;

      // 5. Send Audio File with rich Context Info (Channel Promotion)
      await zk.sendMessage(dest, {
        audio: { url: downloadUrl },
        mimetype: "audio/mp4",
        ptt: false, // Set to true if you want it as a voice note
        contextInfo: {
          externalAdReply: {
            title: "TIMNASA MD PLAYER",
            body: video.title,
            thumbnailUrl: video.thumbnail,
            sourceUrl: channelLink,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true
          },
          newsletterJid: channelJid,
          newsletterName: "TIMNASA MD UPDATES"
        }
      }, { quoted: ms });

      repondre("✅ Download complete.");
    } else {
      repondre("❌ Failed to download audio from the server. The API might be down.");
    }

  } catch (error) {
    console.error("Audio Download Error:", error);
    repondre("❌ An error occurred while processing your request.");
  }
});
