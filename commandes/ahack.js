const { zokou } = require("../framework/zokou");

zokou({
  'nomCom': "hack",
  'categorie': "Fun",
  'reaction': '⚠️'
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const messages = [
      "```⚡ *ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ* Injecting malware⚡```",
      "```🔐 *ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ* into device \n 0%```",
      "```♻️ transfering photos \n █ 10%```",
      "```♻️ transfer successful \n █ █ 20%```",
      "```♻️ transfering videos \n █ █ █ 30%```",
      "```♻️ transfer successful \n █ █ █ █ 40%```",
      "```♻️ transfering audio \n █ █ █ █ █ 50%```",
      "```♻️ transfer successful \n █ █ █ █ █ █ 60%```",
      "```♻️ transfering hidden files \n █ █ █ █ █ █ █ 70%```",
      "```♻️ transfer successful \n █ █ █ █ █ █ █ █ 80%```",
      "```♻️ transfering whatsapp chat \n █ █ █ █ █ █ █ █ █ 90%```",
      "```♻️ transfer successful \n █ █ █ █ █ █ █ █ █ █ 100%```",
      "```📲 System hyjacking on process.. \n Conecting to Server```",
      "```🔌 Device successfully connected... \n Recieving data...```",
      "```💡 Data hyjacked from divice 100% completed \n killing all evidence killing all malwares...```",
      "```🔋 HACKING COMPLETED```",
      "```📤 SENDING PHONE DOCUMENTS```"
    ];

    for (const msg of messages) {
      await repondre(msg);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    await repondre("```🗂️ ALL FILES TRANSFERRED```");
    
    // Sehemu ya Countdown
    const countdown = ['3', '2', '1'];
    for (const num of countdown) {
      await repondre(`\`\`\`❇️ DISCONNECTING IN ${num}...\`\`\``);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await repondre("😏 *VICTIM SYSTEM DEMOLISHED!* 🤔");

    // --- NYONGEZA YA VIEW CHANNEL NA MZIKI ---

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

  } catch (error) {
    console.error("Error in hack script:", error);
    return await repondre("_An error occurred during the process._");
  }
});
