const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "livescore",
    alias: ["live", "score", "matches"],
    categorie: "Sports",
    reaction: "⚽"
},
async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe } = commandeOptions;

    const country = arg.join(" ").trim();

    if (!country) {
        return repondre(`⚽ *LIVESCORE SEARCH*\n\nPlease provide a country name to get live match scores.\n\n*Example:* ${prefixe}livescore England\n*Example:* ${prefixe}livescore Tanzania`);
    }

    try {
        await repondre(`🔍 *Searching for live scores in:* **${country.toUpperCase()}**...`);

        // Free Sports LiveScore API
        const apiUrl = `https://api.footapicom.workers.dev/matches?country=${encodeURIComponent(country)}`;
        const response = await axios.get(apiUrl, { timeout: 12000 });

        const matches = response.data?.matches || response.data?.data || response.data;

        if (!matches || matches.length === 0) {
            return repondre(`❌ No live matches found currently for *${country}*.`);
        }

        let scoreText = `⚽ *LIVE SCORES - ${country.toUpperCase()}* ⚽\n\n`;

        // Limit to top 10 matches to avoid reaching message length limits
        const selectedMatches = Array.isArray(matches) ? matches.slice(0, 10) : [];

        if (selectedMatches.length === 0) {
            return repondre(`❌ Could not retrieve recent matches for *${country}*.`);
        }

        selectedMatches.forEach((match, index) => {
            const home = match.homeTeam?.name || match.home || "Home";
            const away = match.awayTeam?.name || match.away || "Away";
            const homeScore = match.homeScore?.current ?? match.scores?.home ?? 0;
            const awayScore = match.awayScore?.current ?? match.scores?.away ?? 0;
            const status = match.status?.description || match.status || "In Progress";
            const league = match.tournament?.name || match.league || "League";

            scoreText += `*${index + 1}. ${league}*\n`;
            scoreText += `👕 ${home} *${homeScore} - ${awayScore}* ${away}\n`;
            scoreText += `⏱️ *Status:* ${status}\n`;
            scoreText += `─────────────────\n`;
        });

        scoreText += `\n> *Timnasa-MD Sports Updates*`;

        return repondre(scoreText);

    } catch (error) {
        console.error("Livescore Error:", error.message);
        return repondre(`⚠️ Failed to fetch scores for *${country}*. Please ensure the country name is spelled correctly in English (e.g., *Tanzania, England, Spain, Italy*).`);
    }
});
