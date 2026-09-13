const { zokou } = require("../framework/zokou");
const os = require("os");
const { performance } = require("perf_hooks");

zokou(
  {
    nomCom: "uptime",
    alias: ["runtime", "status", "ping"],
    categorie: "General",
    reaction: "⚡"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;

    try {
      const startTime = performance.now();
      const endTime = performance.now();
      const ping = (endTime - startTime).toFixed(4);

      // Kukokotoa Uptime ya Bot
      const uptimeSeconds = process.uptime();
      const days = Math.floor(uptimeSeconds / (3600 * 24));
      const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = Math.floor(uptimeSeconds % 60);

      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Takwimu za RAM
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;

      const formatSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      // Tarehe na Saa ya Sasa
      const now = new Date();
      const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = now.toLocaleDateString('en-US', optionsDate);
      const currentTime = now.toLocaleTimeString('en-US', { hour12: true });

      // Ujumbe wa Taarifa za Bot
      let statusText = `📊 *BOT SYSTEM STATUS & PERFORMANCE* 📊\n\n`;
      statusText += `⏱️ *Uptime:* ${uptimeFormatted}\n`;
      statusText += `⚡ *Speed (Ping):* ${ping} ms\n`;
      statusText += `🧠 *RAM Usage:* ${formatSize(usedMemory)} / ${formatSize(totalMemory)}\n`;
      statusText += `📂 *Free RAM:* ${formatSize(freeMemory)}\n`;
      statusText += `💻 *Platform:* ${os.platform()} (${os.arch()})\n`;
      statusText += `⚙️ *Node.js:* ${process.version}\n`;
      statusText += `🖥️ *Hostname:* ${os.hostname()}\n\n`;
      statusText += `📅 *Date:* ${currentDate}\n`;
      statusText += `⏰ *Time:* ${currentTime}\n\n`;
      statusText += `👑 *Bot by Timnasa Tmd*`;

      // Kutuma Picha ikiwa na Ujumbe (Caption)
      const imageUrl = "https://raw.githubusercontent.com/timnasax/All-updates/refs/heads/main/img_timoth/IMG_3282.jpeg";

      await zk.sendMessage(
        dest,
        {
          image: { url: imageUrl },
          caption: statusText
        },
        { quoted: ms }
      );

    } catch (error) {
      console.error("Uptime Error:", error);
      return repondre("❌ Imeshindikana kupata taarifa za mfumo wa bot.");
    }
  }
);
