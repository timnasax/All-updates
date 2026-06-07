const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const axios = require("axios"); // Hakikisha axios ipo kwa ajili ya kuitisha API

zokou({
    nomCom: "solo",
    categorie: "Download",
    reaction: "🎵"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg } = commandeOptions;

    // 1. Angalia kama mtumiaji ameweka jina la wimbo au link
    if (!arg || arg.length === 0) {
        return zk.sendMessage(dest, { text: "❌ Tafadhali weka jina la wimbo au link ya YouTube.\n\nMfano: .play Harmonize Single Again" }, { quoted: ms });
    }

    const searchQuery = arg.join(" ");

    try {
        // Tuma ujumbe wa kuanza kutafuta wimbo
        await zk.sendMessage(dest, { text: `🔍 Inatafuta: *${searchQuery}*...` }, { quoted: ms });

        // 2. Tafuta video kwenye YouTube
        const searchResults = await yts(searchQuery);
        const video = searchResults.videos[0];

        if (!video) {
            return zk.sendMessage(dest, { text: "❌ Wimbo haujapatikana. Jaribu tena." }, { quoted: ms });
        }

        const videoUrl = video.url;
        const title = video.title;
        const duration = video.timestamp;
        const thumbnail = video.thumbnail;

        // Tuma cover picha na maelezo ya wimbo kwanza
        const infoMessage = `🎵 *YOUTUBE PLAY* 🎵\n\n📝 *Jina:* ${title}\n⏱️ *Muda:* ${duration}\n🔗 *Link:* ${videoUrl}\n\n⏳ *Inapakua MP3 kupitia API...*`;
        await zk.sendMessage(dest, { image: { url: thumbnail }, caption: infoMessage }, { quoted: ms });

        // ==========================================
        // 🛠️ SEHEMU YA API (IJAZE WEWE MWENYEWE)
        // ==========================================
        
        // Mfano: const apiUrl = `https://api.website yako.com/download?url=${encodeURIComponent(videoUrl)}`;
        const apiUrl = `https://apiz.xhclinton.me/api/downloader/vimeo?apikey=toxicapis&url=https://vimeo.com/76979871`; 

        // Kuitisha API yako (fanya marekebisho kulingana na muundo wa response ya API yako)
        const response = await axios.get(apiUrl);
        
        // Hapa chukua ile link ya mp3 iliyorudishwa na API yako
        // Mfano kama inarudisha { status: true, dl_url: "link" } utachukua response.data.dl_url
        const mp3DownloadUrl = response.vimeo.com/76979871; 

        // ==========================================

        if (!mp3DownloadUrl) {
            return zk.sendMessage(dest, { text: "❌ Hitilafu: API imeshindwa kurudisha link ya MP3." }, { quoted: ms });
        }

        // 3. Tuma faili la MP3 kwenda kwa mtumiaji
        await zk.sendMessage(dest, { 
            audio: { url: mp3DownloadUrl }, 
            mimetype: 'audio/mp4', 
            ptt: false 
        }, { quoted: ms });

    } catch (error) {
        console.error(error);
        await zk.sendMessage(dest, { text: "❌ Amri imeshindwa kufanya kazi. Angalia kama API yako iko sawa." }, { quoted: ms });
    }
});
