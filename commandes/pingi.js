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
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

zokou({
  nomCom: "ping",
  desc: "Check bot speed, RAM usage, and system status.",
  categorie: "General",
  reaction: "⚡"
}, async (dest, zk, reponse) => {
  const { ms } = reponse;
  const start = new Date().getTime();
  
  // --- CONFIGURATION ---
  const channelLink = "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u"; 
  const audioUrl = "https://files.catbox.moe/e4c48n.mp3"; 
  const imageUrl = "https://files.catbox.moe/zm113g.jpg"; 
  // ---------------------

  try {
    const end = new Date().getTime();
    const ping = end - start;
    const uptime = runtime(process.uptime());
    
    // Memory Calculation (GB)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedRam = (totalRam - freeRam).toFixed(2);

    const statusMsg = `*🚀ᴛɪᴍɴᴀsᴀ ᴘɪɴɢ🚀*
╭─────────────━┈⊷• 
│⚡│ Latency:* ${ping} ms
│⏱️│ Uptime:* ${uptime}
│💻│ Platform:* ${os.platform()} (${os.arch()})
│📊│ RAM Usage:* ${usedRam}GB / ${totalRam}GB
╭─────────────━┈⊷• 
│🔗│ CHANNEL:* ${channelLink}
╰─────────────━┈⊷•⁠⁠⁠⁠
> ᴛɪᴍɴᴀsᴀ-ᴍᴅ`;

    // 1. Send Image with Status Caption
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: statusMsg
    }, { quoted: ms });

    // 2. Send Audio File
    await zk.sendMessage(dest, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: ms });

  } catch (error) {
    console.error("Speed Command Error:", error);
    reponse.reply("An error occurred while fetching system status.");
  }
});
