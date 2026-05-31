const axios = require("axios");
const { zokou } = require("../framework/zokou");

// --- MFUMO WA KUTUMA NEWSLETTER NA MZIKI (TIMNASA TMD) ---
const sendTimnasaExtras = async (zk, dest, ms) => {
  try {
    // 1. Kutuma View Channel (Newsletter)
    await zk.sendMessage(dest, {
      newsletterJid: "120363413554978773@newsletter",
      newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
      serverMessageId: 1
    }, { quoted: ms });

    // 2. Kutuma Mziki (Audio)
    await zk.sendMessage(dest, {
      audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: ms });
  } catch (e) { console.log("Extras Error: " + e); }
};

zokou({
  nomCom: "secrenshot",
  alias: ["screenweb", "ss"],
  reaction: "💫",
  categorie: "Search",
}, 
async (dest, zk, commandeOptions) => {
  const { ms, arg, repondre, auteurMessage } = commandeOptions;
  const q = arg.join(' ');

  if (!q) {
    return repondre("Please provide a link to take a screenshot.");
  }

  try {
    // Kutumia API kuchukua screenshot
    const response = await axios.get(`https://api.diioffc.web.id/api/tools/sstab?url=${encodeURIComponent(q)}`);
    const screenshotUrl = response.data.result;

    if (!screenshotUrl) {
        return repondre("Screenshot URL not found. Please try another link.");
    }

    const imageMessage = {
      image: { url: screenshotUrl },
      caption: "*📸 WEB SCREENSHOT DOWNLOADER*\n\n> *© Powered By ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ*",
      contextInfo: {
        mentionedJid: [auteurMessage],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363413554978773@newsletter',
          newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
          serverMessageId: 1,
        },
      },
    };

    // Tuma Screenshot
    await zk.sendMessage(dest, imageMessage, { quoted: ms });

    // Tuma View Channel na Mziki otomatiki
    await sendTimnasaExtras(zk, dest, ms);

  } catch (error) {
    console.error("Error:", error);
    repondre("Failed to take screenshot. Please try again later.");
  }
});
