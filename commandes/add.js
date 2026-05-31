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
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: ms });
  } catch (e) { console.log("Extras Error: " + e); }
};

// --- AMRI YA KUADD MEMBERS ---
zokou({ nomCom: "add", categorie: 'Group', reaction: "➕" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, verifAdmin, superUser, idBot } = commandeOptions;

  // 1. Hakikisha ni kwenye kundi
  if (!verifGroupe) return repondre("✋🏿 Amri hii ni kwa ajili ya makundi tu.");

  // 2. Hakikisha anayetumia ni admin au mmiliki
  if (!verifAdmin && !superUser) return repondre("❌ Amri hii ni kwa ajili ya Ma-admin pekee.");

  // 3. Hakikisha Bot ni admin ili iweze kuongeza watu
  const metadata = await zk.groupMetadata(dest);
  const participants = metadata.participants;
  const botIsAdmin = participants.find(p => p.id === idBot && (p.admin === 'admin' || p.admin === 'superadmin'));

  if (!botIsAdmin) return repondre("❌ Siwezi kuongeza watu kwa sababu mimi si Admin wa kundi hili.");

  // 4. Angalia kama kuna namba zimetolewa
  if (!arg[0]) return repondre("Tafadhali weka namba ya mtu unayetaka kumwongeza.\nMfano: .add 2557XXXXXXXX");

  // Tenganisha namba ikiwa ni nyingi (zilizotenganishwa kwa koma)
  let users = arg.join(' ').replace(/[^0-9,]/g, '').split(',').map(v => v.trim() + '@s.whatsapp.net');

  try {
    await zk.groupParticipantsUpdate(dest, users, "add");
    repondre(`✅ Wanachama ${users.length} wameongezwa kwa mafanikio na ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ.`);
    
    // Tuma Newsletter na Mziki
    await sendTimnasaExtras(zk, dest, ms);
  } catch (e) {
    repondre("❌ Imeshindikana kuongeza wanachama. Huenda namba si sahihi au wameweka ulinzi wa 'Privacy' kwenye WhatsApp zao.");
    console.log(e);
  }
});
