const { zokou } = require('../framework/zokou');

zokou({
  nomCom: "menu-x",
  categorie: "General",
  reaction: "🔥"
}, async (dest, zk, commandeOptions) => {
  const { ms, sender } = commandeOptions;

  // 1. Fetch the user's Profile Picture
  let userPfp;
  try {
    userPfp = await zk.profilePictureUrl(sender, 'image');
  } catch {
    // Fallback image if user has no profile picture set
    userPfp = "https://files.catbox.moe/vy870v.jpg";
  }

  // 2. Audio URL Setup
  const audioUrl = "https://raw.githubusercontent.com/timnasax/All-updates/refs/heads/main/Audio/Timothy%20Ping.m4a";

  // 3. Send Voice Note (PTT) first
  await zk.sendMessage(dest, {
    audio: { url: audioUrl },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });

  // 4. Setup Interactive Buttons
  const buttons = [
    {
      buttonId: '.ping',
      buttonText: { displayText: '⚡ SPEED / PING' },
      type: 1
    },
    {
      buttonId: '.owner',
      buttonText: { displayText: '👑 OWNER INFO' },
      type: 1
    },
    {
      buttonId: '.menu',
      buttonText: { displayText: '📜 MAIN MENU' },
      type: 1
    }
  ];

  // 5. Structure Button Message with User's Photo
  const buttonMessage = {
    image: { url: userPfp },
    caption: `*═══════════════════*\n  *TIMNASA TMD 2026/27*\n*═══════════════════*\n\n👋 *Hello:* @${sender.split('@')[0]}\n🚀 *Bot Status:* Active\n\nSelect a button below to proceed:`,
    footer: 'Powered by Timnasa Tmd 2026/27',
    buttons: buttons,
    headerType: 4,
    mentions: [sender]
  };

  // 6. Send Image with Buttons
  await zk.sendMessage(dest, buttonMessage, { quoted: ms });

});
