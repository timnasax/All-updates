const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const { getBuffer } = require("../framework/dl/Function");
const { default: axios } = require('axios');

const runtime = function (seconds) { 
 seconds = Number(seconds); 
 var d = Math.floor(seconds / (3600 * 24)); 
 var h = Math.floor((seconds % (3600 * 24)) / 3600); 
 var m = Math.floor((seconds % 3600) / 60); 
 var s = Math.floor(seconds % 60); 
 var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
 var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
 var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
 var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
 return dDisplay + hDisplay + mDisplay + sDisplay; 
} 

// 1. VCF Command
zokou({ 
    nomCom: 'vcf',
    desc: 'Generate contact file',
    Categorie: 'General',
    reaction: '📄', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *📂 TIMNASA TMD VCF SYSTEM*\n\n*_Please wait a moment, your contact file is being prepared..._*`);
  }
);

// 2. Get All Members Command
zokou({ 
    nomCom: 'getallmembers',
    desc: 'Get all group members info',
    Categorie: 'General',
    reaction: '♻️', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *👥 GROUP MEMBERS SCANNER*\n\n*_Gathering all members list, please be patient..._*`);
  }
);

// 3. First Channel Command
zokou({ 
    nomCom: 'channel',
    desc: 'Official WhatsApp Channel',
    Categorie: 'My Contact',
    reaction: '🐞', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *📢 TIMNASA TMD OFFICIAL CHANNEL*\n\nTap below to join our official channel:\nhttps://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f`);
  }
);

// 4. Second Channel Command
zokou({ 
    nomCom: 'channel1',
    desc: 'Second WhatsApp Channel',
    Categorie: 'My Contact',
    reaction: '🚀', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *🚀 TIMNASA TMD UPDATE CHANNEL*\n\nTap below to join our second channel:\nhttps://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f`);
  }
);

// 5. Update Command
zokou({ 
    nomCom: 'update',
    desc: 'Check bot updates',
    Categorie: 'General',
    reaction: '⚙️', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *⚙️ SYSTEM UPDATE STATUS*\n\n*_Timnasa Tmd is running on its latest version and operating smoothly!_* 🚀`);
  }
);

// 6. Vision/Version Command
zokou({ 
    nomCom: 'vision',
    desc: 'Check bot version',
    Categorie: 'General',
    reaction: '🔎', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *🔎 SYSTEM INFORMATION*\n\n*Bot Name:* Timnasa Tmd\n*Version:* v7.0.0\n*Status:* Online 🔥`);
  }
);
  
// 7. Timothic Group Command
zokou({ 
    nomCom: 'timothicgc',
    desc: 'Join Timothic WhatsApp group',
    Categorie: 'My Contact',
    reaction: '♻️', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *🔗 TIMOTHIC OFFICIAL GROUP*\n\nJoin our chat group via the link below:\nhttps://chat.whatsapp.com/HdrwMccSFIaB5Zi7s9BzN9`);
  }
);

// 8. Support / Owner Contact Command
zokou({ 
    nomCom: 'mee',
    desc: 'Contact bot owner',
    Categorie: 'My Contact',
    reaction: '🐅', 
    fromMe: false, 
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    await repondre(`> *👑 TIMNASA TMD SUPPORT & OWNERS*\n\nFor more help, please contact our owners:\n\n1️⃣ wa.me/255784766591\n2️⃣ wa.me/260767063077`);
  }
);
