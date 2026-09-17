const { zokou } = require('../framework/zokou');
const axios = require('axios');

// Command: .vpn or .proxy
zokou({
  nomCom: "vpn",
  alias: ["proxy", "proxies"],
  categorie: "Tools",
  reaction: "🌐"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  try {
    // Default protocol is http if not specified (options: http, socks4, socks5)
    let protocol = arg[0] ? arg[0].toLowerCase() : 'http';

    if (!['http', 'socks4', 'socks5'].includes(protocol)) {
      return repondre("⚠️ *Invalid protocol!* Please use: `.vpn http`, `.vpn socks4`, or `.vpn socks5`");
    }

    repondre(`🔍 *Fetching fresh ${protocol.toUpperCase()} proxy servers...*`);

    // Fetch raw proxy list from GitHub proxy-list API
    const response = await axios.get(`https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/${protocol}.txt`);
    
    if (!response.data) {
      return repondre("❌ *Failed to fetch proxy servers. Try again later.*");
    }

    // Process and extract top proxies
    const proxyList = response.data.trim().split('\n');
    const topProxies = proxyList.slice(0, 10).join('\n📍 ');

    const message = `🌐 *TIMNASA-TMD VPN / PROXY LIST* 🌐\n\n` +
                    `📡 *Protocol:* ${protocol.toUpperCase()}\n` +
                    `📊 *Total Found:* ${proxyList.length} proxies\n\n` +
                    `📌 *Top 10 Active Proxies:* \n📍 ${topProxies}\n\n` +
                    `💡 *Tip:* Copy any IP:PORT above and set it up in your Telegram, browser, or VPN proxy settings.`;

    await zk.sendMessage(dest, { text: message });

  } catch (error) {
    console.error("Error in VPN command:", error);
    repondre("❌ *An error occurred while retrieving VPN/Proxy configuration.*");
  }
});
