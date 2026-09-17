const { zokou } = require('../framework/zokou');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Command: .vv (Sends unlocked media directly to the current chat)
zokou({
  nomCom: "open",
  categorie: "General",
  reaction: "🔓"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgRepondu } = commandeOptions;

  try {
    if (!msgRepondu) {
      return repondre("⚠️ *Please reply to a View Once message (Image or Video).*");
    }

    let viewOnceMsg = null;
    let mediaType = null;

    // Detect ViewOnce payload structures in Baileys / Zokou
    if (msgRepondu.viewOnceMessage || msgRepondu.viewOnceMessageV2 || msgRepondu.viewOnceMessageV2Extension) {
      const innerMsg = msgRepondu.viewOnceMessage?.message || 
                       msgRepondu.viewOnceMessageV2?.message || 
                       msgRepondu.viewOnceMessageV2Extension?.message;

      if (innerMsg?.imageMessage) {
        viewOnceMsg = innerMsg.imageMessage;
        mediaType = "image";
      } else if (innerMsg?.videoMessage) {
        viewOnceMsg = innerMsg.videoMessage;
        mediaType = "video";
      }
    } else if (msgRepondu.imageMessage?.viewOnce) {
      viewOnceMsg = msgRepondu.imageMessage;
      mediaType = "image";
    } else if (msgRepondu.videoMessage?.viewOnce) {
      viewOnceMsg = msgRepondu.videoMessage;
      mediaType = "video";
    }

    if (!viewOnceMsg) {
      return repondre("❌ *The replied message is not a View Once media.*");
    }

    // Download the media stream
    const stream = await downloadContentFromMessage(viewOnceMsg, mediaType);
    let buffer = Buffer.alloc(0);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const captionText = viewOnceMsg.caption || "ViewOnce Unlocked";

    // Send media to current chat
    if (mediaType === "image") {
      await zk.sendMessage(dest, { image: buffer, caption: `🔓 *View Once Unlocked*\n\n📝 *Caption:* ${captionText}` }, { quoted: ms });
    } else if (mediaType === "video") {
      await zk.sendMessage(dest, { video: buffer, caption: `🔓 *View Once Unlocked*\n\n📝 *Caption:* ${captionText}` }, { quoted: ms });
    }

  } catch (error) {
    console.error("Error in VV command:", error);
    repondre("❌ *Failed to retrieve View Once media.*");
  }
});

// Command: .vv2 (Sends unlocked media privately to your DM/Inbox)
zokou({
  nomCom: "open2",
  categorie: "General",
  reaction: "📥"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgRepondu, auteurMessage } = commandeOptions;

  try {
    if (!msgRepondu) {
      return repondre("⚠️ *Please reply to a View Once message (Image or Video).*");
    }

    let viewOnceMsg = null;
    let mediaType = null;

    if (msgRepondu.viewOnceMessage || msgRepondu.viewOnceMessageV2 || msgRepondu.viewOnceMessageV2Extension) {
      const innerMsg = msgRepondu.viewOnceMessage?.message || 
                       msgRepondu.viewOnceMessageV2?.message || 
                       msgRepondu.viewOnceMessageV2Extension?.message;

      if (innerMsg?.imageMessage) {
        viewOnceMsg = innerMsg.imageMessage;
        mediaType = "image";
      } else if (innerMsg?.videoMessage) {
        viewOnceMsg = innerMsg.videoMessage;
        mediaType = "video";
      }
    } else if (msgRepondu.imageMessage?.viewOnce) {
      viewOnceMsg = msgRepondu.imageMessage;
      mediaType = "image";
    } else if (msgRepondu.videoMessage?.viewOnce) {
      viewOnceMsg = msgRepondu.videoMessage;
      mediaType = "video";
    }

    if (!viewOnceMsg) {
      return repondre("❌ *The replied message is not a View Once media.*");
    }

    const stream = await downloadContentFromMessage(viewOnceMsg, mediaType);
    let buffer = Buffer.alloc(0);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const captionText = viewOnceMsg.caption || "ViewOnce Private";

    // Send directly to sender's private DM
    if (mediaType === "image") {
      await zk.sendMessage(auteurMessage, { image: buffer, caption: `🔒 *View Once (Private)*\n\n📝 *Caption:* ${captionText}` });
    } else if (mediaType === "video") {
      await zk.sendMessage(auteurMessage, { video: buffer, caption: `🔒 *View Once (Private)*\n\n📝 *Caption:* ${captionText}` });
    }

    repondre("📥 *Media has been sent directly to your inbox!*");

  } catch (error) {
    console.error("Error in VV2 command:", error);
    repondre("❌ *Failed to send media to your inbox.*");
  }
});
