const { zokou } = require("../framework/zokou");
const os = require("os");

/**
 * Formats uptime into a highly clean, modern string structure
 */
function formatModernUptime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(" : ");
}

// ---------------- COMMAND: ALIVE / TEST / UPTIME ----------------
zokou({
    nomCom: "alive",
    aliases: ["test", "runtime", "uptime"],
    categorie: "General",
    reaction: "🌐"
}, async (dest, zk, info) => {
    const { ms, repondre } = info;
    const startTimestamp = Date.now();

    try {
        // 1. System Telemetry Calculations
        const uptimeString = formatModernUptime(process.uptime());
        const latency = Date.now() - startTimestamp;
        
        // RAM calculations
        const totalMemory = (os.totalmem() / (1024 ** 3)).toFixed(2);
        const freeMemory = (os.freemem() / (1024 ** 3)).toFixed(2);
        const usedMemory = (totalMemory - freeMemory).toFixed(2);
        const ramPercentage = ((usedMemory / totalMemory) * 100).toFixed(0);

        // CPU Core detection
        const cpuModel = os.cpus()[0] ? os.cpus()[0].model.split("@")[0].trim() : "Virtual Core";

        // 2. Fetch Visual Assets (Dynamic Profile Picture Fallback)
        let displayImage = "https://files.catbox.moe/zm113g.jpg"; // Default banner
        try {
            // Seeks bot's current DP live from servers
            displayImage = await zk.profilePictureUrl(zk.user.id, 'image').catch(() => displayImage);
        } catch (e) {
            console.log("Using default fallback banner for alive command.");
        }

        // 3. Modern 2026 Text Template Design
        const aliveMessage = `*🤖 TIMNASA MD • ONLINE METRICS*
       
╭─────────────━┈⊷•
│🌐│ *Status:* Operational [ACTIVE]
│⏱️│ *Uptime:* ${uptimeString}
│⚡│ *Response:* ${latency} ms
│💻│ *OS Platform:* ${os.platform()} (${os.arch()})
│🧠│ *CPU Type:* ${cpuModel}
│📊│ *RAM Allocation:* ${usedMemory}GB / ${totalMemory}GB [${ramPercentage}%]
╰─────────────━┈⊷•

╭─────────────━┈⊷•
│🔗│ *Official Channel:* https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u
╰─────────────━┈⊷•

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛɪᴍɴᴀsᴀ-ᴍᴅ ᴇʟɪᴛᴇ ᴇᴅɪᴛɪᴏɴ`;

        // 4. Send Message with rich interface mapping
        await zk.sendMessage(dest, {
            image: { url: displayImage },
            caption: aliveMessage,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA MD CORE ACTIVE",
                    body: `System Latency: ${latency}ms | All Nodes Stable`,
                    thumbnailUrl: displayImage,
                    sourceUrl: "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                },
                newsletterJid: "120363316279146194@newsletter", // Channel JID yako
                newsletterName: "TIMNASA MD CORE TELEMETRY"
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Error in Alive Command:", error);
        repondre("❌ Critical: Could not retrieve system runtime logs.");
    }
});
