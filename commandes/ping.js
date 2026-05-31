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
  const start = Date.now();
  
  // --- CONFIGURATION ---
  const channelLink = "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u"; 
  const audioUrl = "https://files.catbox.moe/e4c48n.mp3"; 
  const imageUrl = "https://files.catbox.moe/zm113g.jpg"; 
  // ---------------------

  try {
    const end = Date.now();
    const ping = end - start;
    const uptime = runtime(process.uptime());
    
    // Memory Calculation (GB) safely
    const totalRamGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeRamGB = (os.freemem() / (1024 ** 3)).toFixed(2);
    const usedRamGB = (totalRamGB - freeRamGB).toFixed(2);

    const statusMsg = `*🚀 ᴛɪᴍɴᴀsᴀ ᴘɪɴɢ 🚀*
    
╭─────────────━┈⊷• 
│⚡│ *Latency:* ${ping} ms
│⏱️│ *Uptime:* ${uptime}
│💻│ *Platform:* ${os.platform()} (${os.arch()})
│📊│ *RAM Usage:* ${usedRamGB}GB / ${totalRamGB}GB
╰─────────────━┈⊷• 
│🔗│ *CHANNEL:* ${channelLink}
╰─────────────━┈⊷•
> ᴛɪᴍɴᴀsᴀ-ᴍᴅ`;

    // Try sending the main configuration image first
    try {
      await zk.sendMessage(dest, {
        image: { url: imageUrl },
        caption: statusMsg
      }, { quoted: ms });
    } catch (imgError) {
      console.error("Main image failed, trying user profile picture...");
      
      try {
        // Detect sender JID for both Groups and DMs
        const senderJid = ms.key.participant || ms.key.remoteJid;
        
        // Fetch the user's profile picture from WhatsApp servers
        let profilePicUrl = await zk.profilePictureUrl(senderJid, 'image').catch(async () => {
          // Fallback to bot's profile picture if the user doesn't have one
          return await zk.profilePictureUrl(zk.user.id, 'image').catch(() => null);
        });

        if (profilePicUrl) {
          await zk.sendMessage(dest, {
            image: { url: profilePicUrl },
            caption: statusMsg + "\n\n_(Note: Profile picture used due to media server error)_"
          }, { quoted: ms });
        } else {
          // Force text fallback if no profile images are available
          throw new Error("No profile picture available");
        }
      } catch (profileError) {
        console.error("Profile picture fallback failed, sending text layout.");
        await zk.sendMessage(dest, { text: statusMsg }, { quoted: ms });
      }
    }

    // Try sending the audio track (failures here will not stop the command execution)
    try {
      await zk.sendMessage(dest, {
        audio: { url: audioUrl },
        mimetype: 'audio/mp4',
        ptt: false 
      }, { quoted: ms });
    } catch (audioError) {
      console.error("Audio playback file failed to send.");
    }

  } catch (error) {
    console.error("Critical Ping Command Error:", error);
    await reponse.reply("❌ An error occurred: " + error.message);
  }
});
