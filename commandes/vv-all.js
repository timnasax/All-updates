const { zokou } = require("../framework/zokou");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

// --- CONFIGURATION ---
const channelJid = "120363316279146194@newsletter";

// Helper function to download View-Once media
const downloadVV = async (message) => {
    const type = Object.keys(message);
    const mediaMsg = message[type];
    const stream = await downloadContentFromMessage(
        mediaMsg,
        type.replace('Message', '')
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return { buffer, type, caption: mediaMsg.caption || "" };
};

// ---------------- COMMAND: vv (Reply to chat) ----------------
zokou({
    nomCom: "vv",
    aliases: ["retrive", "keep"],
    categorie: "General",
    reaction: "🔓"
}, async (dest, zk, info) => {
    const { msgRepondu, repondre, ms } = info;

    if (!msgRepondu) return repondre("Please reply to a View-Once message.");

    // Detect if it's a View-Once message
    const viewOnceMsg = msgRepondu.viewOnceMessageV2?.message || msgRepondu.viewOnceMessage?.message;
    if (!viewOnceMsg) return repondre("That is not a View-Once message.");

    try {
        const { buffer, type, caption } = await downloadVV(viewOnceMsg);
        const messObj = {};
        
        if (type === 'imageMessage') messObj.image = buffer;
        else if (type === 'videoMessage') messObj.video = buffer;
        else if (type === 'audioMessage') {
            messObj.audio = buffer;
            messObj.mimetype = 'audio/mp4';
        }
        
        messObj.caption = `*🔓 TIMNASA MD VV PROTECT*\n\n${caption}`;
        messObj.contextInfo = { newsletterJid: channelJid, newsletterName: "TIMNASA MD VV" };

        await zk.sendMessage(dest, messObj, { quoted: ms });
    } catch (e) {
        console.error(e);
        repondre("Failed to download View-Once media.");
    }
});

// ---------------- COMMAND: vv2 (Send to Inbox) ----------------
zokou({
    nomCom: "vv2",
    aliases: ["pvv", "saveinbox"],
    categorie: "General",
    reaction: "📥"
}, async (dest, zk, info) => {
    const { msgRepondu, repondre, sender, ms } = info;

    if (!msgRepondu) return repondre("Please reply to a View-Once message.");

    const viewOnceMsg = msgRepondu.viewOnceMessageV2?.message || msgRepondu.viewOnceMessage?.message;
    if (!viewOnceMsg) return repondre("That is not a View-Once message.");

    try {
        const { buffer, type, caption } = await downloadVV(viewOnceMsg);
        const messObj = {};
        
        if (type === 'imageMessage') messObj.image = buffer;
        else if (type === 'videoMessage') messObj.video = buffer;
        else if (type === 'audioMessage') {
            messObj.audio = buffer;
            messObj.mimetype = 'audio/mp4';
        }
        
        messObj.caption = `*📥 TIMNASA MD INBOX SAVE*\n\n*From:* @${sender.split('@')}\n*Caption:* ${caption}`;
        messObj.mentions = [sender];

        // Send to SENDER'S INBOX (private)
        await zk.sendMessage(sender, messObj);
        
        // Confirm to the group
        repondre("✅ Media has been sent to your Inbox.");
    } catch (e) {
        console.error(e);
        repondre("Failed to save media to Inbox.");
    }
});
