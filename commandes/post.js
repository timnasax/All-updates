const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "poststatus",
    categorie: "Owner",
    reaction: "📲"
},
async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser, ms, mtype } = commandeOptions;

    // Ensure only the Owner or SuperUser can run this command
    if (!superUser) return repondre(" This command is for the bot Owner only!");

    const isImage = mtype === "imageMessage";
    const isVideo = mtype === "videoMessage";
    const quotedMsg = ms.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    try {
        // 1. If an image or video is sent or quoted
        if (isImage || isVideo || quotedMsg?.imageMessage || quotedMsg?.videoMessage) {
            const targetMessage = (isImage || isVideo) ? ms.message : quotedMsg;
            const mediaPath = await zk.downloadAndSaveMediaMessage(targetMessage);
            const captionText = arg.join(" ") || "";

            if (isImage || quotedMsg?.imageMessage) {
                await zk.sendMessage("status@broadcast", {
                    image: { url: mediaPath },
                    caption: captionText
                });
            } else {
                await zk.sendMessage("status@broadcast", {
                    video: { url: mediaPath },
                    caption: captionText
                });
            }

            return repondre(" Media posted to your WhatsApp Status successfully!");
        } 
        
        // 2. If it is text-only status
        else if (arg && arg.length > 0) {
            const statusText = arg.join(" ");

            await zk.sendMessage("status@broadcast", {
                text: statusText
            }, {
                backgroundColor: "#128C7E", // Background color for status
                font: 1
            });

            return repondre(" Message posted to your WhatsApp Status successfully!");
        } 
        else {
            return repondre(" Please provide text or attach/reply to an image or video.\n\nExample: *.poststatus Hello everyone!*");
        }

    } catch (error) {
        console.error("Status Post Error:", error);
        return repondre(" Failed to post status. Please check your system logs.");
    }
});
