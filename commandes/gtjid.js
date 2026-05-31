zokou({
    nomCom: "getjid",
    categorie: "Group",
    reaction: "🆔"
},
async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu } = commandeOptions;

    if (!msgRepondu) {
        return zk.sendMessage(dest, { text: "Tafadhali reply au forward meseji kutoka kwenye channel kisha uandike .getjid" });
    }

    try {
        // Hapa bot inasoma JID ya channel ilikotoka meseji
        const jid = msgRepondu.message.newsletterAdminInviteMessage?.newsletterJid || 
                    msgRepondu.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid;

        if (jid) {
            zk.sendMessage(dest, { text: `JID ya Channel hii ni:\n\n${jid}` }, { quoted: ms });
        } else {
            zk.sendMessage(dest, { text: "Sikuweza kupata JID. Hakikisha umeforward meseji kutoka kwenye channel husika." });
        }
    } catch (e) {
        zk.sendMessage(dest, { text: "Hitilafu: " + e.message });
    }
});
