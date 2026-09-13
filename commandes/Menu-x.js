const { zokou } = require('../framework/zokou');

zokou({
  nomCom: "menu-x",
  categorie: "General",
  reaction: "🔥"
}, async (dest, zk, commandeOptions) => {
  const { ms, sender } = commandeOptions;

  // 1. Fetch user's profile picture
  let userPfp;
  try {
    userPfp = await zk.profilePictureUrl(sender, 'image');
  } catch {
    // Fallback profile image
    userPfp = "https://files.catbox.moe/vy870v.jpg";
  }

  // 2. Audio URL
  const audioUrl = "https://raw.githubusercontent.com/timnasax/All-updates/refs/heads/main/Audio/Timothy%20Ping.m4a";

  // 3. Send Voice Note (PTT)
  await zk.sendMessage(dest, {
    audio: { url: audioUrl },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });

  // 4. Universal iOS-Compatible Menu Layout
  const menuText = `*═══════════════════*
  *TIMNASA TMD 2026/27*
*═══════════════════*

👋 *User:* @${sender.split('@')[0]}
🚀 *Bot Status:* Active

📌 *AVAILABLE COMMANDS:*
1️⃣ *.ping* — Check Bot Speed
2️⃣ *.owner* — Owner Information
3️⃣ *.menu* — Display Full Menu
4️⃣ *.play* — Download Music

*═══════════════════*
> Powered by Timnasa Tmd 2026/27`;

  // 5. Send User's Profile Picture with Menu Text
  await zk.sendMessage(dest, {
    image: { url: userPfp },
    caption: menuText,
    mentions: [sender]
  }, { quoted: ms });

});
