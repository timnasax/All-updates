const { zokou } = require('../framework/zokou');
const fs = require('fs-extra');
const path = require('path');

// Path to store global anti-link configuration
const globalConfigPath = path.join(__dirname, '../data/antilinkAll.json');

function getGlobalAntiLink() {
    try {
        if (fs.existsSync(globalConfigPath)) {
            return JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
        }
    } catch (e) {}
    return { status: false, action: 'delete' };
}

function saveGlobalAntiLink(data) {
    fs.outputFileSync(globalConfigPath, JSON.stringify(data, null, 2));
}

zokou({
    nomCom: "antilink-all",
    categorie: "Group",
    reaction: "🔗"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, superUser } = commandeOptions;

    // Restrict command to Owner / SuperUser only
    if (!superUser) {
        return repondre("❌ This command is restricted to the Bot Owner/SuperUser only!");
    }

    if (!arg || arg.length === 0) {
        let current = getGlobalAntiLink();
        return repondre(
            `🌐 *ANTILINK-ALL SYSTEM (GLOBAL)* 🌐\n\n` +
            `Current Status: *${current.status ? 'ENABLED (ON)' : 'DISABLED (OFF)'}*\n` +
            `Current Action: *${current.action.toUpperCase()}*\n\n` +
            `How to use:\n` +
            `• *.antilink-all on* - Enable anti-link for ALL groups automatically\n` +
            `• *.antilink-all off* - Disable global anti-link\n` +
            `• *.antilink-all action delete* - Delete links and notify in all groups\n` +
            `• *.antilink-all action remove* - Remove users and send sticker in all groups\n` +
            `• *.antilink-all action warn* - Track warnings and remove users upon limit in all groups`
        );
    }

    let config = getGlobalAntiLink();
    const option = arg[0].toLowerCase();

    if (option === "on") {
        config.status = true;
        saveGlobalAntiLink(config);
        return repondre("✅ *AntiLink-All has been enabled!* The bot is now protecting ALL groups automatically.");
    } 
    else if (option === "off") {
        config.status = false;
        saveGlobalAntiLink(config);
        return repondre("🔴 *AntiLink-All has been disabled.*");
    } 
    else if (option === "action") {
        if (!arg[1]) {
            return repondre("⚠️ Choose a valid action: `delete`, `remove`, or `warn`.\nExample: *.antilink-all action remove*");
        }
        const actionType = arg[1].toLowerCase();
        if (["delete", "remove", "warn"].includes(actionType)) {
            config.action = actionType;
            saveGlobalAntiLink(config);
            return repondre(`⚙️ *AntiLink-All Action set to:* \`${actionType.toUpperCase()}\` for all groups.`);
        } else {
            return repondre("❌ Invalid action! Use: `delete`, `remove`, or `warn`.");
        }
    } 
    else {
        return repondre("❌ Unrecognized command option. Type `.antilink-all` to view the full guide.");
    }
});

module.exports = { getGlobalAntiLink };
