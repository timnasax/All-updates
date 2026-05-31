const { zokou } = require("../framework/zokou");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const { generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

zokou({ 
  nomCom: "video2", 
  categorie: "Download", 
  reaction: "🎥" 
}, async (dest, zk, commandOptions) => {
  const { arg, ms, reponce } = commandOptions;

  try {
    if (!arg || arg.length === 0) {
      return reponce('Tafadhali weka jina la video unayotafuta.');
    }

    const query = arg.join(' ');
    const search = await ytSearch(query);

    if (!search || !search.videos || search.videos.length === 0) {
      return reponce('Sikupata matokeo yoyote ya: ' + query);
    }

    // Kuchakata kadi za carousel (Sehemu ya muonekano)
    const cards = await Promise.all(
      search.videos.slice(0, 5).map(async (video) => ({
        header: { 
          title: `📸 ${video.title}`, 
          hasMediaAttachment: true, 
          imageMessage: (await generateWAMessageContent({ image: { url: video.thumbnail } }, { upload: zk.waUploadToServer })).imageMessage, 
        },
        body: { 
          text: `*🎧 Views:* ${video.views.toLocaleString()}\n*🎻 Uploaded:* ${video.ago}\n*⏳ Duration:* ${video.timestamp}`, 
        },
        footer: { 
          text: "Zokou-MD Video Downloader", 
        },
        nativeFlowMessage: {
          buttons: [
            { 
              name: "cta_url", 
              buttonParamsJson: JSON.stringify({ 
                display_text: "🌐 Angalia YouTube", 
                url: `https://youtu.be/${video.videoId}`, 
              }), 
            }
          ],
        },
      }))
    );

    const message = generateWAMessageFromContent(
      dest, 
      { 
        viewOnceMessage: { 
          message: { 
            interactiveMessage: { 
              body: { 
                text: `*ZOKOU YOUTUBE SEARCH*\n\n🔍 Matokeo ya: ${query}` 
              }, 
              footer: { 
                text: `Imeandaliwa na Zokou Framework` 
              }, 
              carouselMessage: { 
                cards 
              }, 
            }, 
          }, 
        }, 
      }, 
      { quoted: ms }
    );

    await zk.relayMessage(dest, message.message, { messageId: message.key.id });

    // Kuanza kupakua video ya kwanza iliyopatikana
    const firstVideo = search.videos[0];
    reponce(`Napakua: *${firstVideo.title}* ... Tafadhali subiri.`);

    const apiURL = `https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(firstVideo.url)}&format=mp4`;

    try {
      const response = await axios.get(apiURL);
      
      // Kumbuka: API tofauti zina muundo tofauti, hapa natumia 'downloadLink' kama ilivyokuwa kwenye kodi yako
      const downloadUrl = response.data.downloadLink || response.data.result || response.data.url;

      if (!downloadUrl) {
        throw new Error('Imeshindwa kupata link ya kudownload.');
      }

      await zk.sendMessage(dest, { 
        video: { url: downloadUrl }, 
        caption: `*Kichwa:* ${firstVideo.title}\n*Muda:* ${firstVideo.timestamp}\n\nEnjoy by Zokou-MD`,
        mimetype: 'video/mp4'
      }, { quoted: ms });

    } catch (err) {
      console.error('[VIDEO] API Error:', err);
      reponce('Samahani, imeshindikana kupakua video hii kwa sasa.');
    }

  } catch (err) {
    console.error('[VIDEO] Error:', err);
    reponce('Kuna hitilafu imetokea: ' + err.message);
  }
});
