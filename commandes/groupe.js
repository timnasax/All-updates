const { zokou } = require("../framework/zokou")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../bdd/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../bdd/antibot")
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');

// --- MFUMO WA KUTUMA NEWSLETTER NA MZIKI ---
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
  } catch (e) {
    console.log("Extras Error: " + e);
  }
};

// --- TAGALL ---
zokou({ nomCom: "tagall", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions
  if (!verifGroupe) { repondre("✋🏿 this command is reserved for groups ❌"); return; }
  
  let mess = (!arg || arg === ' ') ? 'Aucun Message' : arg.join(' ');
  let membresGroupe = await infosGroupe.participants;
  var tag = `\n╭─────────────────━┈⊷ \n│🌟 ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ 𝗧𝗔𝗚𝗔𝗟𝗟\n╰─────────────────━┈⊷ \n│⚙️ *Group* : ${nomGroupe} \n│🎼 *Hey😀* : *${nomAuteurMessage}* \n│🎊 *Message* : *${mess}* \n╰─────────────━┈⊷\n\n`;
  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅'];
  
  for (const membre of membresGroupe) {
    let random = Math.floor(Math.random() * emoji.length);
    tag += `${emoji[random]}      @${membre.id.split("@")[0]}\n`;
  }

  if (verifAdmin || superUser) {
    await zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map((i) => i.id) }, { quoted: ms });
    await sendTimnasaExtras(zk, dest, ms);
  } else { repondre('command reserved for admins')}
});

// --- LINK ---
zokou({ nomCom: "link", categorie: 'Group', reaction: "🙋" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
  if (!verifGroupe) { repondre("For groups only!"); return; };
  var link = await zk.groupInviteCode(dest);
  var lien = `https://chat.whatsapp.com/${link}`;
  let mess = `hello ${nomAuteurMessage} , here is the group link for ${nomGroupe} \n\nGroup link :${lien} \n\n©ᴘᴏᴡᴇʀ ʙʏ ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ʟɪɴᴋ`;
  await repondre(mess);
  await sendTimnasaExtras(zk, dest, ms);
});

// --- PROMOTE ---
zokou({ nomCom: "promote", categorie: 'Group', reaction: "💕" }, async (dest, zk, commandeOptions) => {
  let { ms, repondre, msgRepondu, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  if (!verifGroupe) return repondre("For groups only");
  const meta = await zk.groupMetadata(dest);
  const admins = meta.participants.filter(p => p.admin !== null).map(p => p.id);
  if (admins.includes(auteurMessage) || superUser) {
    if (msgRepondu) {
      if (admins.includes(idBot)) {
        await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
        repondre(`🎊 @${auteurMsgRepondu.split("@")[0]} rose in rank.`, { mentions: [auteurMsgRepondu] });
        await sendTimnasaExtras(zk, dest, ms);
      } else repondre("I am not admin.");
    } else repondre("Tag someone.");
  } else repondre("Admin only.");
});

// --- DEMOTE ---
zokou({ nomCom: "demote", categorie: 'Group', reaction: "👨‍👩‍👧‍👧" }, async (dest, zk, commandeOptions) => {
  let { ms, repondre, msgRepondu, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  if (!verifGroupe) return repondre("For groups only");
  const meta = await zk.groupMetadata(dest);
  const admins = meta.participants.filter(p => p.admin !== null).map(p => p.id);
  if (admins.includes(auteurMessage) || superUser) {
    if (msgRepondu && admins.includes(idBot)) {
      await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
      repondre(`@${auteurMsgRepondu.split("@")[0]} demoted.`, { mentions: [auteurMsgRepondu] });
      await sendTimnasaExtras(zk, dest, ms);
    }
  }
});

// --- REMOVE ---
zokou({ nomCom: "remove", categorie: 'Group', reaction: "👨‍👩‍👧‍👧" }, async (dest, zk, commandeOptions) => {
  let { ms, repondre, msgRepondu, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
  if (!verifGroupe) return repondre("Groups only");
  const meta = await zk.groupMetadata(dest);
  const admins = meta.participants.filter(p => p.admin !== null).map(p => p.id);
  if (admins.includes(auteurMessage) || superUser) {
    if (msgRepondu && admins.includes(idBot)) {
      await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
      repondre(`@${auteurMsgRepondu.split("@")[0]} removed.`);
      await sendTimnasaExtras(zk, dest, ms);
    }
  }
});

// --- DELETE (DEL) ---
zokou({ nomCom: "del", categorie: 'Group', reaction:"🧹" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgRepondu, verifAdmin, superUser } = commandeOptions;
  if (!msgRepondu) return repondre("Mention a message.");
  if (verifAdmin || superUser) {
    const key = { remoteJid: dest, fromMe: false, id: ms.message.extendedTextMessage.contextInfo.stanzaId, participant: ms.message.extendedTextMessage.contextInfo.participant };
    await zk.sendMessage(dest, { delete: key });
    await sendTimnasaExtras(zk, dest, ms);
  }
});

// --- HIDETAG ---
zokou({nomCom:"hidetag",categorie:'Group',reaction:"🤫"},async(dest,zk,commandeOptions)=>{
  const {ms, repondre,msgRepondu,verifGroupe,arg ,verifAdmin , superUser}=commandeOptions;
  if(!verifGroupe) return repondre('Groups only.');
  if (verifAdmin || superUser) { 
    let metadata = await zk.groupMetadata(dest);
    let tag = metadata.participants.map(p => p.id);
    if(msgRepondu) {
      if (msgRepondu.stickerMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        let sticker = new Sticker(media, { pack: 'ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ', type: StickerTypes.CROPPED });
        await zk.sendMessage(dest, { sticker: await sticker.toBuffer(), mentions: tag });
      } else {
        await zk.sendMessage(dest, { text: msgRepondu.conversation || "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ HideTag", mentions: tag });
      }
    } else {
      await zk.sendMessage(dest, { text : arg.join(' ') || "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ Tag", mentions : tag });
    }
    await sendTimnasaExtras(zk, dest, ms);
  }
});

// --- ANTILINK ---
zokou({ nomCom: "antilink", categorie: 'Group', reaction: "⚡" }, async (dest, zk, commandeOptions) => {
  var { ms, repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  if (!verifGroupe) return repondre("Groups only");
  if( superUser || verifAdmin) {
    const enetatoui = await verifierEtatJid(dest);
    if(arg[0] === 'on') {
      await ajouterOuMettreAJourJid(dest,"oui");
      repondre("Antilink activated ✅");
    } else if (arg[0] === "off") {
      await ajouterOuMettreAJourJid(dest , "non");
      repondre("Antilink deactivated ❌");
    }
    await sendTimnasaExtras(zk, dest, ms);
  }
});

// --- ANTIBOT ---
zokou({ nomCom: "antibot", categorie: 'Group', reaction: "😬" }, async (dest, zk, commandeOptions) => {
  var { ms, repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;
  if (!verifGroupe) return repondre("Groups only");
  if( superUser || verifAdmin) {
    const enetatoui = await atbverifierEtatJid(dest);
    if(arg[0] === 'on') {
      await atbajouterOuMettreAJourJid(dest,"oui");
      repondre("Antibot activated ✅");
    } else if (arg[0] === "off") {
      await atbajouterOuMettreAJourJid(dest , "non");
      repondre("Antibot deactivated ❌");
    }
    await sendTimnasaExtras(zk, dest, ms);
  }
});

// --- APK DOWNLOADER ---
zokou({ nomCom: "apk", reaction: "✨", categorie: "Recherche" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  try {
    const appName = arg.join(' ');
    if (!appName) return repondre("App name?");
    const searchResults = await search(appName);
    const appData = await download(searchResults[0].id);
    const captionText = `『 *ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ APK* 』\n\n*Name :* ${appData.name}\n*Size :* ${appData.size}`;
    await zk.sendMessage(dest, { image: { url: appData.icon }, caption: captionText }, { quoted: ms });
    await sendTimnasaExtras(zk, dest, ms);
  } catch (error) { repondre("Error APK"); }
});
