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
    var dDisplay = d > 0 ? d + "d " : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s" : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Helper function to detect country from WhatsApp ID prefix
 */
function getCountryFromJid(jid) {
    if (!jid) return "Global User 🌐";
    if (jid.startsWith("255")) return "Tanzania 🇹🇿";
    if (jid.startsWith("254")) return "Kenya 🇰🇪";
    if (jid.startsWith("256")) return "Uganda 🇺🇬";
    if (jid.startsWith("1")) return "United States 🇺🇸";
    if (jid.startsWith("44")) return "United Kingdom 🇬🇧";
    if (jid.startsWith("234")) return "Nigeria 🇳🇬";
    if (jid.startsWith("27")) return "South Africa 🇿🇦";
    if (jid.startsWith("91")) return "India 🇮🇳";
    return "Global User 🌐";
}

zokou({
  nomCom: "ping",
  desc: "Check advanced futuristic bot speed and user analytics.",
  categorie: "General",
  reaction: "🚀"
}, async (dest, zk, reponse) => {
  const { ms } = reponse;
  const start = new Date().getTime();
  
  // --- CONFIGURATION ---
  const channelJid = "120363406146813524@newsletter"; 
  const audioUrl = "https://files.catbox.moe/e4c48n.mp3"; 
  const defaultImageUrl = "https://files.catbox.moe/zm113g.jpg"; 
  // ---------------------

  // Kupata JID (Namba) ya mtumiaji kwa usalama zaidi
  const senderNumber = ms.key.participant || ms.key.remoteJid || dest;

  try {
    const end = new Date().getTime();
    const ping = end - start;
    const uptime = runtime(process.uptime());
    
    // Memory Calculation (GB)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedRam = (totalRam - freeRam).toFixed(2);

    // User Data Analytics
    const username = reponse.nomAuteur || "Timnasa Operator";
    const userCountry = getCountryFromJid(senderNumber);
    
    // Kuchukua picha kwa usalama (Kama ikigoma, inaruka kwenda kwenye default bila kuharibu mfumo)
    let finalImage = defaultImageUrl;
    try {
        const pfp = await zk.profilePictureUrl(senderNumber, 'image');
        if (pfp) finalImage = pfp;
    } catch (pfpError) {
        // Picha ya mtumiaji imeshindwa kupatikana (labda privacy yake), tunatumia default image
        finalImage = defaultImageUrl;
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
 👤 *Session Operator:* @${senderNumber.split('@')[0]}
 📊 *Quantum RAM:* ${usedRam}GB / ${totalRam}GB

📡 *Network Status:* Stable 📶
🛸 *Engine:* TIMNASA-MD FutureX

🎵 _Streaming audio payload below..._
📢 _Click 'View Channel' to bridge connection._`;

    // 1. Send Image na Maelezo yote ya 2030 Style
    await zk.sendMessage(dest, {
      image: { url: finalImage },
      caption: statusMsg,
      mentions: [senderNumber], 
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
    // Hata kitu kikifeli kabisa, bot haitakaa kimya, itatuma ujumbe huu wa dharura:
    await zk.sendMessage(dest, { 
      text: `*🚀 TIMNASA PING (2030)*\n\n⚡ *Speed:* ${new Date().getTime() - start} ms\n⏱️ *Uptime:* ${runtime(process.uptime())}\n\n_Note: Matrix graphics encounted an issue._`
    }, { quoted: ms });
  }
});
