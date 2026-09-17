const { zokou } = require("../framework/zokou");
const axios = require('axios');

// ── YOUR WORKING APIS ─────────────────────────────────────────────
const AI_APIS = [
    async (q) => {
        const url = `https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, { timeout: 15000 });
        return data?.data?.response || null;
    },
    async (q) => {
        const url = `https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, { timeout: 15000 });
        return data?.data?.response || data?.response || null;
    },
    async (q) => {
        const url = `https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url, { timeout: 15000 });
        return data?.data?.response || data?.response || null;
    }
];

// ── AI FETCHER WITH FALLBACK ──────────────────────────────────────
const askAI = async (query) => {
    for (const api of AI_APIS) {
        try {
            console.log(`🔄 Trying API...`);
            const response = await api(query);
            if (response && typeof response === 'string' && response.trim().length > 0) {
                console.log(`✅ API Success!`);
                return response.trim();
            }
        } catch (error) {
            console.log(`❌ API failed: ${error.message}`);
            continue;
        }
    }
    return "⚠️ AI service is currently unavailable. Please try again later.";
};

// ── GENERAL HANDLER FOR ZOKOU FRAMEWORK ───────────────────────────
const handleAiCommand = async (dest, zk, commandeOptions, usageExample) => {
    const { repondre, arg, ms } = commandeOptions;
    const query = arg.join(" ").trim();

    if (!query) {
        return repondre(usageExample);
    }

    // Send typing indicator
    try {
        await zk.sendPresenceUpdate('composing', dest);
    } catch (e) {
        console.log("Presence update error:", e.message);
    }
    
    try {
        let response = await askAI(query);
        
        // Truncate if too long
        if (response.length > 4000) {
            response = response.substring(0, 3970) + "\n\n...*[Message truncated]*";
        }
        
        await zk.sendMessage(dest, { text: response }, { quoted: ms });
    } catch (error) {
        console.error("Error:", error);
        await repondre("❌ Error: Could not process your request. Please try again.");
    }
};

// ── ALL AI COMMANDS ───────────────────────────────────────────────

// 1. ai command
zokou({
    nomCom: "ai",
    alias: ["artificial", "intelligence"],
    reaction: '🧠',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.ai <message>*\n\nExample: .ai What is artificial intelligence?");
});

// 2. chat command
zokou({
    nomCom: "chat",
    alias: ["chatbot", "chatai"],
    reaction: '💬',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.chat <message>*\n\nExample: .chat Hello, how are you?");
});

// 3. njabulo command
zokou({
    nomCom: "timothy",
    alias: ["njabulomd", "njabulbot", "njab"],
    reaction: '👑',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.njabulo <message>*\n\nExample: .njabulo Who are you?");
});

// 4. gpt command
zokou({
    nomCom: "gpt",
    alias: ["chatgpt", "gptai", "openai"],
    reaction: '🤖',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.gpt <message>*\n\nExample: .gpt Tell me a joke");
});

// 5. gpt-5.4-mini command
zokou({
    nomCom: "gpt-5.4-mini",
    alias: ["gpt54", "gptmini54", "gpt5.4"],
    reaction: '⚡',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.gpt-5.4-mini <message>*\n\nExample: .gpt-5.4-mini Explain quantum physics");
});

// 6. gptmini command
zokou({
    nomCom: "gptmini",
    alias: ["mini-gpt", "gpt-mini", "tinygpt"],
    reaction: '🔰',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.gptmini <message>*\n\nExample: .gptmini Write a short poem");
});

// 7. gemini command
zokou({
    nomCom: "gemini",
    alias: ["gemini4", "geminiai", "googleai"],
    reaction: '✨',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.gemini <message>*\n\nExample: .gemini Write a story");
});

// 8. ilama command
zokou({
    nomCom: "ilama",
    alias: ["llama", "llamaai", "metallama"],
    reaction: '🦙',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.ilama <message>*\n\nExample: .ilama Explain AI in simple terms");
});

// 9. ask command
zokou({
    nomCom: "ask",
    alias: ["question", "askai", "askme"],
    reaction: '❓',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.ask <question>*\n\nExample: .ask What is the capital of France?");
});

// 10. bot command
zokou({
    nomCom: "bot",
    alias: ["assistant", "helper"],
    reaction: '🤖',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.bot <message>*\n\nExample: .bot Help me with my homework");
});

// 11. smart command
zokou({
    nomCom: "smart",
    alias: ["intelligent", "smartai"],
    reaction: '🧠',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.smart <message>*\n\nExample: .smart What's the meaning of life?");
});

// 12. quick command
zokou({
    nomCom: "quick",
    alias: ["fast", "quickai"],
    reaction: '⚡',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.quick <message>*\n\nExample: .quick Quick response please");
});

// 13. pro command
zokou({
    nomCom: "pro",
    alias: ["proai", "aipro"],
    reaction: '💎',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.pro <message>*\n\nExample: .pro Give me professional advice");
});

// 14. ultra command
zokou({
    nomCom: "ultra",
    alias: ["ultraai", "aiultra"],
    reaction: '🚀',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.ultra <message>*\n\nExample: .ultra Advanced explanation please");
});

// 15. brain command
zokou({
    nomCom: "brain",
    alias: ["brainy", "think"],
    reaction: '🧠',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.brain <message>*\n\nExample: .brain Solve this math problem");
});

// 16. wisdom command
zokou({
    nomCom: "wisdom",
    alias: ["wise", "sage"],
    reaction: '🦉',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.wisdom <message>*\n\nExample: .wisdom Give me motivational advice");
});

// 17. genius command
zokou({
    nomCom: "genius",
    alias: ["brilliant", "smartest"],
    reaction: '⭐',
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    handleAiCommand(dest, zk, commandeOptions, "📌 *.genius <message>*\n\nExample: .genius Complex problem solving");
});
