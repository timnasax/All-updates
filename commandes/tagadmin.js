const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../bdd/antilien");
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../bdd/antibot");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');

// --- MFUMO WA KUTUMA NEWSLETTER NA MZIKI (TIMNASA TMD) ---
const sendTimnasaExtras = async (zk, dest, ms) => {
  try {
    // 1. Kutuma View Channel (Newsletter)
    await zk.sendMessage(dest, {
      newsletterJid: "120363413554978773@newsletter",
      newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
      serverMessageId: 1
    }, { quoted: ms });

    // 2. Kutuma Mziki (Audio)
    await zk.sendMessage(dest, {
      audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: ms });
  } catch (e) { console.log("Extras Error: " + e); }
};

zokou({ nomCom: "tagadmin", categorie: 'Group', reaction: "🪰" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { 
    repondre("✋🏿 this command is reserved for groups"); 
    return; 
  }

  // Amri hii inaruhusiwa kwa Admins au SuperUser pekee
  if (!verifAdmin && !superUser) { 
    repondre("Sorry, this command is reserved for administrators."); 
    return; 
  }

  let mess = arg && arg.length > 0 ? arg.join(' ') : 'No Message';

  // Kuchuja washiriki ambao ni ma-admin pekee
  let adminsGroupe = infosGroupe.participants.filter(membre => membre.admin);

  let tag = `  
╭─────────────────━┈⊷ 
│🌟 ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ 𝗔𝗗𝗠𝗜𝗡 𝗧𝗔𝗚
╰─────────────────━┈⊷ \n
│⚙️ *Group* : ${nomGroupe} 
│🎼 *From* : *${nomAuteurMessage}* │🎊 *Message* : *${mess}* ╰─────────────━┈⊷\n
`;

  let emoji = ['⭐', '🛡️', '👑', '👤'];
  let random = Math.floor(Math.random() * emoji.length);

  for (const membre of adminsGroupe) {
    tag += `${emoji[random]} @${membre.id.split("@")[0]}\n`;
  }

  // Tuma ujumbe wa tag kwa ma-admin
  await zk.sendMessage(dest, { text: tag, mentions: adminsGroupe.map(i => i.id) }, { quoted: ms });

  // Tuma Newsletter na Mziki otomatiki
  await sendTimnasaExtras(zk, dest, ms);

});
