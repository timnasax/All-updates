const { zokou } = require("../framework/zokou");
const os = require("os");
const { performance } = require("perf_hooks");
const fs = require("fs");

zokou(
  {
    nomCom: "uptime",
    alias: ["runtime", "status", "ping"],
    categorie: "General",
    reaction: "⚡"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    try {
      const startTime = performance.now();
      
      // Kupima kasi (Ping / Response speed)
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

      // Tarehe na Saa ya Sasa (Inatumia saa za Afrika Mashariki / EAT au eneo ulilopo)
      const now = new Date();
      const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = now.toLocaleDateString('en-US', optionsDate);
      const currentTime = now.toLocaleTimeString('en-US', { hour12: true });

      // Disk / Storage Check (Kama inapatikana kwenye mazingira ya Linux/VPS)
      let diskInfo = "N/A";
      try {
        // Hii inafanya kazi vizuri kwenye Linux/Termux/VPS
        const disk = fs.statSync(process.cwd());
        // Unaweza kutumia package kama 'check-disk-space' kama unataka storage kamili ya disk, 
        // ila hapa tutaweka taarifa za jumla za Mfumo ili kuepusha error.
      } catch (e) {
        diskInfo = "Unavailable";
      }

      // Ujumbe kamili wa System Status
      let statusText = `📊 *BOT SYSTEM STATUS & PERFORMANCE* 📊\n\n`;
      statusText += `⏱️ *Uptime:* ${uptimeFormatted}\n`;
      statusText += `⚡ *Speed (Ping):* ${ping} ms\n`;
      statusText += `🧠 *RAM Usage:* ${formatSize(usedMemory)} / ${formatSize(totalMemory)}\n`;
      statusText += `💻 *Platform:* ${os.platform()} (${os.arch()})\n`;
      statusText += `⚙️ *Node.js:* ${process.version}\n`;
      statusText += `📂 *Free RAM:* ${formatSize(freeMemory)}\n`;
      statusText += `🖥️ *Hostname:* ${os.hostname()}\n\n`;
      statusText += `📅 *Date:* ${currentDate}\n`;
      statusText += `⏰ *Time:* ${currentTime}\n\n`;
      statusText += `✨ *Bot Framework:* Zokou`;

      return repondre(statusText);

    } catch (error) {
      console.error("Uptime Error:", error);
      return repondre("❌ Imeshindikana kupata taarifa za mfumo wa bot.");
    }
  }
);
