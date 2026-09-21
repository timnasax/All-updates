const { zokou, ytsearch } = require("../framework/zokou");
const axios = require("axios");

// ================================================================
//                     🔑 CONFIG & APIS
// ================================================================
const DAVID_CYRIL_BASE = "https://apis.davidcyril.name.ng";
const API_ENDPOINTS = {
  SEARCH: `${DAVID_CYRIL_BASE}/search/youtube?q=`,
  YTMP3: `${DAVID_CYRIL_BASE}/download/ytmp3?url=`,
  YTMP4: `${DAVID_CYRIL_BASE}/download/ytmp4?url=`,
  FALLBACK_MP3: "https://api.vreden.my.id/api/ytmp3?url=",
  FALLBACK_MP4: "https://api.vreden.my.id/api/ytmp4?url="
};

// ================================================================
//                     🛠️ HELPER FUNCTIONS
// ================================================================
const react = async (dest, zk, ms, emoji) => {
  try {
    await zk.sendMessage(dest, { react: { text: emoji, key: ms.key } });
  } catch (e) {
    /* Silent catch */
  }
};

// Function ya Kupata Direct Download Link (Ina-fallback API moja ikifeli)
async function fetchMediaLink(videoUrl, type = "audio") {
  const isAudio = type === "audio";
  const primaryUrl = isAudio ? API_ENDPOINTS.YTMP3 : API_ENDPOINTS.YTMP4;
  const fallbackUrl = isAudio ? API_ENDPOINTS.FALLBACK_MP3 : API_ENDPOINTS.FALLBACK_MP4;

  try {
    const res = await axios.get(`${primaryUrl}${encodeURIComponent(videoUrl)}`, { timeout: 45000 });
    const data = res.data;
    
    const downloadUrl = data?.result?.download_url || data?.download_url || data?.result?.url || data?.result?.download;
    const title = data?.result?.title || data?.title;
    const thumbnail = data?.result?.thumbnail || data?.thumbnail;

    if (downloadUrl) return { downloadUrl, title, thumbnail };
    throw new Error("No link found in primary API");
  } catch (err) {
    console.warn(`[API] Primary API failed for ${type}, trying fallback...`);
    
    const fallbackRes = await axios.get(`${fallbackUrl}${encodeURIComponent(videoUrl)}`, { timeout: 45000 });
    const fbData = fallbackRes.data;

    const downloadUrl = fbData?.result?.download?.url || fbData?.result?.download_url || fbData?.result?.url;
    const title = fbData?.result?.title;
    const thumbnail = fbData?.result?.metadata?.thumbnail || fbData?.result?.thumbnail;

    if (downloadUrl) return { downloadUrl, title, thumbnail };
    throw new Error("Both Primary and Fallback APIs failed.");
  }
}

// ================================================================
//   🎵 .play — Audio Downloader
// ================================================================
zokou({
  nameCmd: "playx",
  alias: ["mp3", "song", "audio", "music"],
  category: "Download",
  reaction: "🎵",
}, async (dest, tk, commandContext) => {
  const { respond, args, msg, zk } = commandContext;
  const query = (args || []).join(" ").trim();

  if (!query) {
    return respond("🎵 *MP3 AUDIO DOWNLOADER*\n\n*Matumizi:*\n.play <jina la wimbo au YT link>\n\n*Mfano:*\n.play Diamond Platnumz Komasava");
  }

  await react(dest, zk, msg, "🔎");

  try {
    let videoUrl = query;
    let videoTitle = query;
    let videoThumb = null;

    // Search YouTube if query is not a direct URL
    if (!query.startsWith("http://") && !query.startsWith("https://")) {
      const searchRes = await axios.get(`${API_ENDPOINTS.SEARCH}${encodeURIComponent(query)}`, { timeout: 25000 });
      const firstVideo = searchRes.data?.result?.[0] || searchRes.data?.[0];
      
      if (!firstVideo) return respond("Wimbo haujapatikana kwenye YouTube!");
      videoUrl = firstVideo.url || firstVideo.link;
      videoTitle = firstVideo.title || query;
      videoThumb = firstVideo.thumbnail;
    }

    await respond(`🎵 *Inapakua Audio...*\n📌 *Wimbo:* ${videoTitle}`);
    await react(dest, zk, msg, "⚡");

    const media = await fetchMediaLink(videoUrl, "audio");
    const finalTitle = media.title || videoTitle;
    const finalThumb = media.thumbnail || videoThumb;

    const audioPayload = {
      audio: { url: media.downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${finalTitle.replace(/[^\w\s.-]/g, "").slice(0, 50)}.mp3`,
      ptt: false
    };

    if (finalThumb) {
      audioPayload.contextInfo = {
        externalAdReply: {
          title: `🎵 ${finalTitle}`,
          body: "Zokou Audio Downloader",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: finalThumb,
          sourceUrl: videoUrl,
        },
      };
    }

    await zk.sendMessage(dest, audioPayload, { quoted: msg });
    await react(dest, zk, msg, "✅");

  } catch (e) {
    const errMsg = e?.response?.data?.message || e.message || "Network Error";
    console.error("[Play Error]:", errMsg);
    await react(dest, zk, msg, "❌");
    await respond(`❌ *HITILAFU IMETOKEA*\n\nSababu: ${errMsg}`);
  }
});

// ================================================================
//   🎬 .video — Video Downloader
// ================================================================
zokou({
  nameCmd: "videox",
  alias: ["mp4", "ytmp4", "ytvideo", "vid"],
  category: "Download",
  reaction: "🎬",
}, async (dest, tk, commandContext) => {
  const { respond, args, msg, zk } = commandContext;
  const query = (args || []).join(" ").trim();

  if (!query) {
    return respond("🎬 *MP4 VIDEO DOWNLOADER*\n\n*Matumizi:*\n.video <jina la video au YT link>\n\n*Mfano:*\n.video Rayvanny Video");
  }

  await react(dest, zk, msg, "🔎");

  try {
    let videoUrl = query;
    let videoTitle = query;
    let videoThumb = null;

    if (!query.startsWith("http://") && !query.startsWith("https://")) {
      const searchRes = await axios.get(`${API_ENDPOINTS.SEARCH}${encodeURIComponent(query)}`, { timeout: 25000 });
      const firstVideo = searchRes.data?.result?.[0] || searchRes.data?.[0];
      
      if (!firstVideo) return respond("Video haijapatikana kwenye YouTube!");
      videoUrl = firstVideo.url || firstVideo.link;
      videoTitle = firstVideo.title || query;
      videoThumb = firstVideo.thumbnail;
    }

    await respond(`🎬 *Inapakua Video...*\n📌 *Jina:* ${videoTitle}`);
    await react(dest, zk, msg, "⚡");

    const media = await fetchMediaLink(videoUrl, "video");
    const finalTitle = media.title || videoTitle;

    const videoPayload = {
      video: { url: media.downloadUrl },
      mimetype: "video/mp4",
      fileName: `${finalTitle.replace(/[^\w\s.-]/g, "").slice(0, 50)}.mp4`,
      caption: `🎬 *${finalTitle}*\n\n✨ *Downloaded via Zokou Bot*`,
    };

    await zk.sendMessage(dest, videoPayload, { quoted: msg });
    await react(dest, zk, msg, "✅");

  } catch (e) {
    const errMsg = e?.response?.data?.message || e.message || "Network Error";
    console.error("[Video Error]:", errMsg);
    await react(dest, zk, msg, "❌");
    await respond(`❌ *HITILAFU IMETOKEA*\n\nSababu: ${errMsg}`);
  }
});

// ================================================================
//   📋 .playhelp — Help Menu
// ================================================================
zokou({
  nameCmd: "playhelp",
  alias: ["dlhelp", "songhelp", "videohelp"],
  category: "Download",
  reaction: "📋",
}, async (dest, tk, commandContext) => {
  const { respond } = commandContext;
  
  const menuText = [
    "✨ *YOUTUBE MEDIA DOWNLOADER*",
    "",
    "🎧 *AUDIO COMMANDS:*",
    "• `.play <song name>`",
    "• `.mp3 <song name>`",
    "• `.song <song name>`",
    "",
    "🎬 *VIDEO COMMANDS:*",
    "• `.video <video name>`",
    "• `.mp4 <video name>`",
    "• `.vid <video name>`",
    "",
    "💡 *Mifano ya Kutumia:*",
    "• `.play Mbosso Amepotea`",
    "• `.video Harmonize Single Again`"
  ].join("\n");

  await respond(menuText);
});
