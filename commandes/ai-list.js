const { zokou } = require("../framework/zokou");
const axios = require("axios");

// An array of 100 distinct AI names/aliases for your commands
const AI_NAMES = [
    "ai", "gpt", "chatgpt", "deepseek", "timnasa", "tmd", "jarvis", "friday", "copilot", "gemini",
    "claud", "luma", "siri", "alexa", "cortana", "bixby", "omega", "alpha", "delta", "sigma",
    "matrix", "neo", "trinity", "morpheus", "orion", "vega", "sirius", "titan", "atlas", "phoenix",
    "cyber", "tech", "robot", "bot", "brain", "mind", "genius", "wizard", "oracle", "seer",
    "tmd_ai", "timnasa_ai", "gpt4", "gpt5", "llm", "neuron", "synapse", "quantum", "binary", "vector",
    "helix", "apex", "vertex", "zenith", "nadir", "echo", "shadow", "ghost", "phantom", "spectre",
    "vortex", "nova", "nebula", "cosmos", "galaxy", "universe", "infinity", "eternity", "aeon", "chronos",
    "zeus", "hades", "poseidon", "ares", "apollo", "hermes", "odin", "thor", "loki", "anubis",
    "osiris", "horus", "ra", "isis", "thoth", "shiva", "vishnu", "brahma", "kali", "durga",
    "gorgan", "kraken", "hydra", "chimera", "griffin", "pegasus", "sphinx", "valkyrie", "golem", "cyborg"
];

// Loop through the list to generate and register each command independently
AI_NAMES.forEach((commandName) => {
    zokou({
        nomCom: commandName,
        categorie: "AI",
        reaction: "🤖",
        desc: `Ask any question and the ${commandName.toUpperCase()} AI engine will answer.`
    }, async (dest, zk, commandeOptions) => {
        const { ms, repondre, arg } = commandeOptions;

        // Verify if a query/question was provided
        if (!arg || arg.length === 0) {
            return repondre(`❌ Hello! I am ${commandName.toUpperCase()} AI. Please provide a query after the command.\n\nExample:\n*.${commandName} What is quantum physics?*`);
        }

        const query = arg.join(" ");

        try {
            // Trigger Baileys typing presence indicator
            await zk.sendPresenceUpdate("composing", dest);
            
            // Fetch answers from a fast, reliable, open AI processing endpoint
            const response = await axios.get(`https://api.sandipbbaruwal.onrender.com/gpt4?prompt=${encodeURIComponent(query)}`);
            
            if (response.data && response.data.answer) {
                let aiResponse = `*🤖 ${commandName.toUpperCase()} AI MATRIX* 🤖\n`;
                aiResponse += `*╔════════════════════════╗*\n\n`;
                aiResponse += `${response.data.answer}\n\n`;
                aiResponse += `*╚════════════════════════╝*\n`;
                aiResponse += `⚡ _TIMNASA-TMD Engine • Live Response_`;

                await zk.sendMessage(dest, { text: aiResponse }, { quoted: ms });
            } else {
                repondre("❌ High traffic detected. I was unable to pull a response. Please retry.");
            }

        } catch (error) {
            console.error(`Error executing AI command [${commandName}]:`, error);
            repondre("❌ Network link exception. The AI neural net timed out.");
        }
    });
});
