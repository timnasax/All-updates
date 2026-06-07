const { zokou } = require("../framework/zokou");
const os = require("os");

/**
 * Formats uptime seconds into a human-readable string
 */
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Helper function to detect country from WhatsApp ID prefix
 */
function getCountryFromJid(jid) {
    if (!jid) return "Unknown 🌍";
    if (jid.startsWith("255")) return "Tanzania 🇹🇿";
    if (jid.startsWith("254")) return "Kenya 🇰🇪";
    if (jid.startsWith("256")) return "Uganda 🇺🇬";
    if (jid.startsWith("1")) return "United States 🇺🇸";
    if (jid.startsWith("44")) return "United Kingdom 🇬🇧";
    if (jid.startsWith("234")) return "Nigeria 🇳🇬";
    if (jid.startsWith("27")) return "South Africa 🇿🇦";
    if (jid.startsWith("91")) return "India 🇮🇳";
    // Unaweza kuongeza nchi nyingine hapa
    return "Global User 🌐";
}

zokou({
  nomCom: "ping",
  desc: "Check advanced futuristic bot speed and user analytics.",
  categorie: "General",
  reaction: "🌐"
}, async (dest, zk, reponse) => {
  const { ms, sender } = reponse;
  const start = new Date().getTime();
  
  // --- CONFIGURATION ---
  const channelJid = "120363406146813524@newsletter"; 
  const audioUrl = "https://files.catbox.moe/e4c48n.mp3"; 
  const defaultImageUrl = "https://files.catbox.moe/zm113g.jpg"; 
  // ---------------------

  try {
    const end = new Date().getTime();
    const ping = end - start;
    const uptime = runtime(process.uptime());
    
    // Memory Calculation (GB)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedRam = (totalRam - freeRam).toFixed(2);

    // User Data Analytics
    const username = reponse.nomAuteur || "User";
    const userCountry = getCountryFromJid(sender);
    
    // Fetch User Profile Picture (Kama hana au imefichwa, itatumia default)
    let userPfp;
    try {
        userPfp = await zk.profilePictureUrl(sender, 'image');
    } catch {
        userPfp = defaultImageUrl;
    }

    // Futuristic 2030 Status Template
    const statusMsg = `*🔹 TIMNASA SYSTEM V5.0 🔹*
_Next-Gen Matrix Diagnostics_
🔹 Verified User: *${username}* ☑️

╔═════════════════════════╗
  *⚡ PING ANALYTICS (2030)*
╚═════════════════════════╝
 🚀 *System Speed:* ${ping} ms
 ⏱️ *Uptime Matrix:* ${uptime} Active
 🌍 *User Location:* ${userCountry}
 👤 *Session Operator:* @${sender.split('@')[0]}
 📊 *Quantum RAM:* ${usedRam}GB / ${totalRam}GB

📡 *Network Status:* Stable 📶
🛸 *Engine:* TIMNASA-MD FutureX

🎵 _Streaming audio payload below..._
📢 _Click 'View Channel' to bridge connection._`;

    // 1. Send Image (Profile Picture or Default) with Status & View Channel Button
    await zk.sendMessage(dest, {
      image: { url: userPfp },
      caption: statusMsg,
      mentions: [sender], // Inamtag mtumiaji
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          newsletterName: "🚀 Timnasa Music Verified ☑️", 
          serverMessageId: 143
        }
      }
    }, { quoted: ms });

    // 2. Send Audio File
    await zk.sendMessage(dest, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: ms });

  } catch (error) {
    console.error("Speed Command Error:", error);
    await zk.sendMessage(dest, { text: "🛸 Core Error: Failed to fetch matrix data." }, { quoted: ms });
  }
});
