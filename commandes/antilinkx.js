const { zokou } = require('../framework/zokou');
const { verifierEtatJid, atbverifierEtatJid, recupererActionJid } = require('../bdd/antilien');
const { ajouterOuMettreAJourJidWithState, mettreAJourActionJid } = require('../bdd/antilien');

zokou({
    nomCom: "antilink-x",
    categorie: "Group",
    reaction: "🔗"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, verifAdmin, superUser } = commandeOptions;

    // 1. Hakikisha amri inatumiwa kwenye Group pekee
    if (!verifGroupe) {
        return repondre("❌ Amri hii inafanya kazi kwenye makundi (groups) pekee!");
    }

    // 2. Ruhusu Admin au SuperUser pekee
    if (!verifAdmin && !superUser) {
        return repondre("❌ Amri hii ni kwa ajili ya Ma-Admin wa group pekee!");
    }

    if (!arg || arg.length === 0) {
        return repondre(
            `⚡ *MFUMO WA ANTILINK-X* ⚡\n\n` +
            `Jinsi ya kutumia:\n` +
            `• *.antilink-x on* - Kuwasha AntiLink-X\n` +
            `• *.antilink-x off* - Kuzima AntiLink-X\n` +
            `• *.antilink-x action delete* - Kufuta tu ujumbe wa link\n` +
            `• *.antilink-x action remove* - Kumtoa mtumiaji anayetuma link\n` +
            `• *.antilink-x action warn* - Kumpa mtumiaji onyo (warning)`
        );
    }

    const option = arg[0].toLowerCase();

    if (option === "on") {
        await ajouterOuMettreAJourJidWithState(dest, "yes");
        return repondre("✅ *AntiLink-X imewashwa kwa mafanikio!* Bot itafuta kila aina ya link papo hapo.");
    } 
    else if (option === "off") {
        await ajouterOuMettreAJourJidWithState(dest, "no");
        return repondre("🔴 *AntiLink-X imezimwa.*");
    } 
    else if (option === "action") {
        if (!arg[1]) {
            return repondre("⚠️ Tafadhali chagua action: `delete`, `remove`, au `warn`.\nMfano: *.antilink-x action remove*");
        }

        const actionType = arg[1].toLowerCase();

        if (["delete", "remove", "warn"].includes(actionType)) {
            await mettreAJourActionJid(dest, actionType);
            return repondre(`⚙️ *AntiLink-X Action imewekwa kuwa:* \`${actionType.toUpperCase()}\``);
        } else {
            return repondre("❌ Action uliyochagua si sahihi! Chagua kati ya: `delete`, `remove`, au `warn`.");
        }
    } 
    else {
        return repondre("❌ Chagua sahihi! Tumia `.antilink-x` kuona mwongozo.");
    }
});
