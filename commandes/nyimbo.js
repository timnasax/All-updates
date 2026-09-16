const { zokou } = require("../framework/zokou");
const axios = require("axios");
const ytSearch = require("yt-search");

// ========== RANDOM IMAGE ==========
function getRandomImage() {
    const images = [
        "https://raw.githubusercontent.com/NjabuloJf/njabulo-data/main/njabuloimg/njabuloimg.png",
        "https://raw.githubusercontent.com/NjabuloJf/njabulo-data/main/njabuloimg/njabuloimg2.png",
        "https://raw.githubusercontent.com/NjabuloJf/njabulo-data/main/njabuloimg/njabuloimg3.png",
        "https://raw.githubusercontent.com/NjabuloJf/njabulo-data/main/njabuloimg/njabuloimg4.png",
        "https://raw.githubusercontent.com/NjabuloJf/njabulo-data/main/njabuloimg/njabuloimg5.png"
    ];
    return images[Math.floor(Math.random() * images.length)];
}

// ========== GET AUDIO DOWNLOAD URL - MULTIPLE APIS ==========
async function getAudioUrl(videoId) {
    const apis = [
        // API 1: Noobs API
        {
            url: `https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(videoId)}&format=mp3`,
            extract: (data) => data.downloadLink || data.download_url || data.result?.downloadLink || data.result?.download_url || data.link || data.url
        },
        // API 2: Agatz API
        {
            url: `https://api.agatz.xyz/api/ytdl?url=https://youtu.be/${videoId}&type=mp3`,
            extract: (data) => data.result?.download_url || data.result?.downloadUrl || data.download_url || data.url
        },
        // API 3: Alternative
        {
            url: `https://api.davidcyriltech.my.id/download/ytdl?url=https://youtu.be/${videoId}&filter=audio`,
            extract: (data) => data.result?.downloadUrl || data.result?.download_url || data.downloadUrl || data.url
        }
    ];

    for (const api of apis) {
        try {
            console.log(`[NYIMBO] Trying API: ${api.url}`);
            const response = await axios.get(api.url, { 
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.status === 200 && response.data) {
                const url = api.extract(response.data);
                if (url && typeof url === 'string' && url.startsWith('http')) {
                    console.log(`[NYIMBO] ✅ Got download URL: ${url.substring(0, 50)}...`);
                    return url;
                }
            }
        } catch (err) {
            console.log(`[NYIMBO] ❌ API failed: ${err.message}`);
            continue;
        }
    }
    return null;
}

// ========== SEARCH YOUTUBE ==========
async function searchYouTube(query) {
    try {
        const results = await ytSearch(query);
        if (!results || !results.videos || results.videos.length === 0) {
            return null;
        }
        return results.videos;
    } catch (error) {
        console.error('Search error:', error);
        return null;
    }
}

// ========== ZOKOU COMMAND REGISTRATION ==========
zokou({
    nomCom: "nyimbo",
    alias: ["song", "music", "play", "mp3"],
    categorie: "Download",
    reaction: "🎵"
},
async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe } = commandeOptions;
    
    let query = arg.join(' ').trim();

    if (!query) {
        const randomImage = getRandomImage();
        return await zk.sendMessage(dest, {
            image: { url: randomImage },
            caption: `🎵 *Please provide a song title*\n\nExample: *${prefixe}nyimbo Shape of You*`
        }, { quoted: ms });
    }

    try {
        // Send searching message
        await zk.sendMessage(dest, {
            text: `🔍 *Searching for song: ${query}*`
        }, { quoted: ms });

        // Search YouTube
        const videos = await searchYouTube(query);
        if (!videos || videos.length === 0) {
            const randomImage = getRandomImage();
            return await zk.sendMessage(dest, {
                image: { url: randomImage },
                caption: '❌ *No results found for your search.*'
            }, { quoted: ms });
        }

        const video = videos[0];
        const videoId = video.videoId;
        const title = video.title;
        const artist = video.author?.name || 'Unknown';
        const duration = video.timestamp || video.duration || 'Unknown';
        const views = video.views ? video.views.toLocaleString() : 'Unknown';
        const thumbnail = video.thumbnail || getRandomImage();

        // Send song details
        const infoCaption = `🎵 *Title:* ${title}\n👤 *Artist:* ${artist}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}`;
        
        await zk.sendMessage(dest, {
            image: { url: thumbnail },
            caption: `📥 *Downloading audio...*\n\n${infoCaption}`
        }, { quoted: ms });

        // Fetch download link
        const downloadUrl = await getAudioUrl(videoId);

        if (!downloadUrl) {
            const randomImage = getRandomImage();
            return await zk.sendMessage(dest, {
                image: { url: randomImage },
                caption: `❌ *Failed to retrieve audio download link.*\n\nPlease try again later or search with a different keyword:\n*${prefixe}nyimbo ${query}*`
            }, { quoted: ms });
        }

        // ========== SEND AUDIO ==========
        await zk.sendMessage(dest, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
            ptt: false,
            contextInfo: {
                externalAdReply: {
                    title: title.substring(0, 100),
                    body: artist,
                    mediaType: 1,
                    sourceUrl: video.url,
                    thumbnailUrl: thumbnail,
                    renderLargerThumbnail: true,
                }
            }
        }, { quoted: ms });

        // Send completion message
        const randomImage = getRandomImage();
        await zk.sendMessage(dest, {
            image: { url: randomImage },
            caption: `✅ *Audio Download Completed!*\n\n🎵 ${title}\n👤 ${artist}\n⏱️ ${duration}`
        }, { quoted: ms });

    } catch (err) {
        console.error('[NYIMBO] Error:', err);
        const randomImage = getRandomImage();
        
        let errorMsg = 'Failed to process your request.';
        if (err.response && err.response.status === 500) {
            errorMsg = 'Server is busy at the moment. Please try again later.';
        } else if (err.message) {
            errorMsg = err.message;
        }
        
        await zk.sendMessage(dest, {
            image: { url: randomImage },
            caption: `❌ *Error:* ${errorMsg}\n\nTry again using:\n*${prefixe}nyimbo ${query || ''}*`
        }, { quoted: ms });
    }
});
