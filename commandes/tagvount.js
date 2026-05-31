const { zokou } = require("../framework/zokou");

// --- MFUMO WA KUTUMA NEWSLETTER NA MZIKI (TIMNASA TMD) ---
const sendTimnasaExtras = async (zk, dest, ms) => {
  try {
    await zk.sendMessage(dest, {
      newsletterJid: "120363413554978773@newsletter",
      newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
      serverMessageId: 1
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
      mimetype: 'audio/mp3',
      ptt: false 
    }, { quoted: ms });
  } catch (e) { console.log("Extras Error: " + e); }
};

// --- TAG TANZANIA (+255) ---
zokou({ nomCom: "tagtz", categorie: 'Group', reaction: "🇹🇿" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) return repondre("Groups only!");
  if (!verifAdmin && !superUser) return repondre("Admins only!");

  let members = infosGroupe.participants;
  let tzMembers = members.filter(m => m.id.startsWith("255"));

  if (tzMembers.length === 0) return repondre("Hakuna namba za Tanzania kwenye kundi hili.");

  let mess = arg && arg.length > 0 ? arg.join(' ') : 'Mambo vipi Watanzania! 🇹🇿';
  let tag = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ 🇹🇿 TANZANIA TAG*\n\n*From:* ${nomAuteurMessage}\n*Message:* ${mess}\n\n`;

  for (const m of tzMembers) {
    tag += `🐘 @${m.id.split("@")[0]}\n`;
  }

  await zk.sendMessage(dest, { text: tag, mentions: tzMembers.map(i => i.id) }, { quoted: ms });
  await sendTimnasaExtras(zk, dest, ms);
});

// --- TAG KENYA (+254) ---
zokou({ nomCom: "tagke", categorie: 'Group', reaction: "🇰🇪" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) return repondre("Groups only!");
  if (!verifAdmin && !superUser) return repondre("Admins only!");

  let members = infosGroupe.participants;
  let keMembers = members.filter(m => m.id.startsWith("254"));

  if (keMembers.length === 0) return repondre("Hakuna namba za Kenya kwenye kundi hili.");

  let mess = arg && arg.length > 0 ? arg.join(' ') : 'Habari zenu Wakenya! 🇰🇪';
  let tag = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ 🇰🇪 KENYA TAG*\n\n*From:* ${nomAuteurMessage}\n*Message:* ${mess}\n\n`;

  for (const m of keMembers) {
    tag += `🦁 @${m.id.split("@")[0]}\n`;
  }

  await zk.sendMessage(dest, { text: tag, mentions: keMembers.map(i => i.id) }, { quoted: ms });
  await sendTimnasaExtras(zk, dest, ms);
});
