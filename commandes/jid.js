const { zokou } = require("../framework/zokou");

// ---------------- COMMAND: JID FETCH ENGINE ----------------
zokou({
    nomCom: "jid",
    aliases: ["myjid", "groupjid", "chatjid"],
    categorie: "General",
    reaction: "🆔"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, msgRepondu, mentions } = commandeOptions;

    try {
        let targetJid = "";
        let identifierType = "";

        // 1. ANCHOR: Angalia kama kuna mtu ametagwako (Mentioned User)
        if (mentions && mentions.length > 0) {
            targetJid = mentions[0];
            identifierType = "MENTIONED USER JID";
        } 
        // 2. ANCHOR: Angalia kama amereply ujumbe wa mtu (Replied User)
        else if (msgRepondu) {
            targetJid = msgRepondu.sender;
            identifierType = "REPLIED USER JID";
        } 
        // 3. ANCHOR: Kama haja-reply wala kutag, chukua JID ya sehemu mliyopo (Group au Personal Chat)
        else {
            targetJid = dest;
            identifierType = dest.endsWith("@g.us") ? "CURRENT GROUP JID" : "YOUR PERSONAL JID";
        }

        // Muonekano wa Kisasa wa Cyber Matrix Dashboard
        const jidDashboard = `*🆔 TIMNASA MD • JID EXTRACTOR *

╭─────────────────────━┈⊷•
│📊│ *Target:* ${identifierType}
│🔗│ *JID Address:* \`${targetJid}\`
╰─────────────────────━┈⊷•

> 💡 Tip: You can copy this JID easily by tapping on the text box.`;

        // Tuma ujumbe ukiwa na mfumo safi wa kunakili (Monospace font ` ` ili mtumiaji aguse tu icopy)
        await zk.sendMessage(dest, {
            text: jidDashboard,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA MD ID IDENTIFIER",
                    body: "Secure Identity Extraction Protocol",
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg", // Picha ya bot yako
                    sourceUrl: "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u",
                    mediaType: 1,
                    showAdAttribution: false
                },
                newsletterJid: "120363316279146194@newsletter",
                newsletterName: "TIMNASA MD SECURITY LOGS"
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Critical error in JID extractor:", error);
        repondre("❌ Failed to resolve network identity registry.");
    }
});
