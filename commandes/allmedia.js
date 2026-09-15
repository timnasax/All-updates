const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');

// ==================== INSTAGRAM DOWNLOADER ====================
zokou({ nomCom: "igdl", alias: ["ig", "instagram"], categorie: "Download", reaction: "📸" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  if (!arg[0]) return repondre("Veillez insérer un lien video instagramme");

  try {
    const link = arg.join(' ');
    const res = await axios.get(`http://njabulo-ai.vercel.app/dl?url=${encodeURIComponent(link)}`);
    const mediaUrl = res.data?.result?.downloadUrl || res.data?.downloadUrl || res.data?.url;

    if (!mediaUrl) return repondre("❌ Imeshindikana kupata video ya Instagram. Hakikisha link ni sahihi.");

    await zk.sendMessage(dest, { 
      video: { url: mediaUrl }, 
      caption: "Instagram Downloader powered by *Timnasa*" 
    }, { quoted: ms });

  } catch (e) {
    repondre("Erreur lors du téléchargement: " + e.message);
  }
});

// ==================== FACEBOOK DOWNLOADER ====================
zokou({ nomCom: "fbdl", alias: ["fb", "fbdl2"], categorie: "Download", reaction: "📽️" }, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  if (!arg[0]) return repondre("Insert a public facebook video link!");

  try {
    const queryURL = arg.join(" ");
    const res = await axios.get(`http://njabulo-ai.vercel.app/dl?url=${encodeURIComponent(queryURL)}`);
    const videoUrl = res.data?.result?.downloadUrl || res.data?.downloadUrl || res.data?.url;
    const title = res.data?.result?.title || "Facebook Video";

    if (!videoUrl) return repondre("❌ Imeshindikana kupata video ya Facebook.");

    await zk.sendMessage(dest, { 
      video: { url: videoUrl }, 
      caption: `📌 *Title:* ${title}\n\nFacebook video downloader powered by *Timnasa*` 
    }, { quoted: ms });

  } catch (error) {
    console.error("FB Error:", error);
    repondre("Erreur lors du téléchargement de la vidéo.");
  }
});

// ==================== TIKTOK DOWNLOADER ====================
zokou({ nomCom: "tiktok", alias: ["tktok"], categorie: "Download", reaction: "🎵" }, async (dest, zk, commandeOptions) => {
  const { arg, ms, prefixe, repondre } = commandeOptions;
  if (!arg[0]) return repondre(`How to use this command:\n ${prefixe}tiktok <tiktok_video_link>`);

  try {
    const videoUrl = arg.join(" ");
    const res = await axios.get(`http://njabulo-ai.vercel.app/dl?url=${encodeURIComponent(videoUrl)}`);
    const directMedia = res.data?.result?.downloadUrl || res.data?.downloadUrl || res.data?.url;
    const title = res.data?.result?.title || "TikTok Video";

    if (!directMedia) return repondre("❌ Imeshindikana kupata video ya TikTok.");

    await zk.sendMessage(dest, { 
      video: { url: directMedia }, 
      caption: `📌 *Description:* ${title}\n\nTikTok downloader powered by *Timnasa*` 
    }, { quoted: ms });

  } catch (error) {
    console.error("TikTok Error:", error);
    repondre("Erreur lors du téléchargement TikTok.");
  }
});
