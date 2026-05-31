const { zokou } = require("../framework/zokou");
const yts = require("yt-search");

zokou({
    nomCom: "youtube",
    categorie: "Search",
    reaction: "🔍"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) {
        return repondre("Tafadhali weka neno la kutafuta. Mfano: .yts Diamond Platnumz");
    }

    try {
        // Kutafuta matokeo YouTube
        const search = await yts(arg.join(" "));
        const mambo = search.all.slice(0, 10); // Inachukua matokeo 10 ya kwanza

        if (mambo.length < 1) return repondre("Sikuweza kupata chochote.");

        let orodha = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ʏᴛ-sᴇᴀʀᴄʜ*\n\n`;
        let num = 1;

        for (let i of mambo) {
            orodha += `*${num++}.* 📺 *${i.title}*\n`;
            orodha += `⏱️ *Muda:* ${i.timestamp}\n`;
            orodha += `🔗 *Link:* ${i.url}\n`;
            orodha += `━━━━━━━━━━━━━━\n`;
        }

        orodha += `\n_Tumia command ya .play au .video ukiwa umecopy link hapo juu kupata mziki au video._`;

        // Tuma orodha ikiwa na picha ya kwanza ya matokeo
        await zk.sendMessage(dest, { 
            image: { url: mambo[0].thumbnail }, 
            caption: orodha 
        }, { quoted: ms });

        // Tuma Newsletter Mwishoni
        await zk.sendMessage(dest, {
            newsletterJid: "120363413554978773@newsletter",
            newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
            serverMessageId: 1
        });

    } catch (error) {
        console.log(error);
        repondre("Hitilafu: " + error.message);
    }
});
