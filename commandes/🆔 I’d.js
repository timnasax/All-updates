const { zokou } = require("../framework/zokou");

// 1. Command to get Group ID (JID)
zokou({
    nomCom: "gid",
    categorie: "Group",
    reaction: "🆔"
},
async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe } = commandeOptions;

    if (!verifGroupe) return repondre("❌ This command can only be used inside a group!");

    try {
        return repondre(`📌 *GROUP ID (JID):*\n\n\`\`\`${dest}\`\`\``);
    } catch (error) {
        console.error("Group ID Error:", error);
        return repondre("❌ Failed to retrieve Group ID.");
    }
});

// 2. Command to get Channel ID (JID) by replying to a forwarded channel message
zokou({
    nomCom: "cid",
    categorie: "General",
    reaction: "📢"
},
async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;

    const quotedMsg = ms.message?.extendedTextMessage?.contextInfo;

    // Check if the user replied to a message forwarded from a channel
    if (!quotedMsg || !quotedMsg.forwardedNewsletterMessageInfo) {
        return repondre("❌ Please *reply* to any message forwarded from the WhatsApp Channel you want the ID for.");
    }

    try {
        const channelJid = quotedMsg.forwardedNewsletterMessageInfo.newsletterJid;
        const channelName = quotedMsg.forwardedNewsletterMessageInfo.newsletterName || "Unknown Channel";

        return repondre(`📢 *CHANNEL DETAILS*\n\n📛 *Name:* ${channelName}\n🆔 *Channel JID:* \`\`\`${channelJid}\`\`\``);
    } catch (error) {
        console.error("Channel ID Error:", error);
        return repondre("❌ Failed to retrieve Channel ID.");
    }
});

// 3. Command to generate/fetch Group Invite Link
zokou({
    nomCom: "invite",
    categorie: "Group",
    reaction: "🔗"
},
async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, verifZokouAdmin } = commandeOptions;

    if (!verifGroupe) return repondre("❌ This command can only be used inside a group!");
    if (!verifZokouAdmin) return repondre("❌ The bot must be an *Admin* in this group to generate an invite link!");

    try {
        const code = await zk.groupInviteCode(dest);
        const inviteLink = `https://chat.whatsapp.com/${code}`;

        return repondre(`🔗 *GROUP INVITE LINK*\n\n${inviteLink}`);
    } catch (error) {
        console.error("Invite Link Error:", error);
        return repondre("❌ Failed to fetch group invite link. Ensure the bot has admin rights.");
    }
});
