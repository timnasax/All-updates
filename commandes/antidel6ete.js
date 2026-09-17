const { zokou } = require(__dirname + "/../framework/zokou");

zokou(
    {
        nomCom: "antidelete",
        categorie: "Mods",
        reaction: "🗑️"
    },
    async (dest, zk, commandeOptions) => {
        const { superUser, arg, repondre } = commandeOptions;

        if (!superUser) {
            return repondre("❌ This command is restricted to the Bot Owner only.");
        }

        const option = arg[0] ? arg[0].toLowerCase() : "";

        if (option === "on" || option === "yes") {
            global.antidelete = true;
            return repondre("✅ Anti-Delete feature has been successfully enabled!");
        } else if (option === "off" || option === "no") {
            global.antidelete = false;
            return repondre("🔴 Anti-Delete feature has been disabled!");
        } else {
            return repondre(
                `🗑️ *ANTIDELETE CONTROL*\n\n` +
                `Current status: *${global.antidelete ? "ENABLED (ON)" : "DISABLED (OFF)"}*\n` +
                `Messages cached in memory: *${global.deletedMessagesStore ? global.deletedMessagesStore.size : 0} / 3000*\n\n` +
                `Usage:\n` +
                `• *${commandeOptions.prefixe}antidelete on* - Enable Anti-Delete\n` +
                `• *${commandeOptions.prefixe}antidelete off* - Disable Anti-Delete`
            );
        }
    }
);
