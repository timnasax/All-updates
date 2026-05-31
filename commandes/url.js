const { zokou } = require("../framework/zokou");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

// --- UTILITY: UPLOAD TO CATBOX USING AXIOS ---
async function uploadToCatbox(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("File does not exist locally.");
    }

    try {
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("userhash", ""); // Unaweza kuacha wazi kwa anonymous uploads
        form.append("fileToUpload", fs.createReadStream(filePath));

        const response = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data && String(response.data).startsWith("https://")) {
            return response.data.trim(); // Inarudisha ile link ya catbox moja kwa moja
        } else {
            throw new Error("Invalid response from Catbox: " + response.data);
        }
    } catch (err) {
        throw new Error("Catbox Upload Failed: " + err.message);
    }
}

// --- UTILITY: AUDIO TO MP3 CONVERTER ---
function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('mp3')
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .save(outputPath);
    });
}

// ---------------- COMMAND: URL GENERATOR ----------------
zokou({ 
    nomCom: "url", 
    aliases: ["tourl", "makeurl"],
    categorie: "General", 
    reaction: "👨🏿‍💻" 
}, async (dest, zk, info) => {
    const { msgRepondu, repondre, ms } = info;

    if (!msgRepondu) {
        return repondre('❌ Please reply to an image, video, or audio file.');
    }

    // Kupata ujumbe halisi uliolengwa (unaojumuisha viewOnce na kawaida)
    const messageContent = msgRepondu.imageMessage || msgRepondu.videoMessage || msgRepondu.audioMessage || 
                           msgRepondu.viewOnceMessageV2?.message?.imageMessage || 
                           msgRepondu.viewOnceMessageV2?.message?.videoMessage;

    if (!messageContent) {
        return repondre('⚠️ Unsupported media type. Please reply to a valid Image, Video, or Audio.');
    }

    let mediaType = "";
    if (msgRepondu.imageMessage || msgRepondu.viewOnceMessageV2?.message?.imageMessage) mediaType = "image";
    else if (msgRepondu.videoMessage || msgRepondu.viewOnceMessageV2?.message?.videoMessage) mediaType = "video";
    else if (msgRepondu.audioMessage) mediaType = "audio";

    // Kuzuia ma-file makubwa sana yanayoweza kujaza RAM ya VPS yako
    if (messageContent.fileLength && parseInt(messageContent.fileLength) > 50 * 1024 * 1024) {
        return repondre('❌ File is too large! Maximum limit is 50MB.');
    }

    let tempLocation = path.join(__dirname, `../tmp_media_${Date.now()}`);

    try {
        repondre("⏳ *TIMNASA MD is processing and uploading your file to cloud storage...*");

        // Pakua faili kwa njia salama ya Baileys
        const buffer = await downloadMediaMessage(
            { message: msgRepondu },
            'buffer',
            {},
            { logger: console }
        );

        await fs.writeFile(tempLocation, buffer);

        // Shughulikia ubadilishaji wa Audio kuwa MP3
        if (mediaType === 'audio') {
            const mp3Location = `${tempLocation}.mp3`;
            try {
                await convertToMp3(tempLocation, mp3Location);
                if (fs.existsSync(tempLocation)) fs.unlinkSync(tempLocation);
                tempLocation = mp3Location;
            } catch (convErr) {
                console.error("Audio conversion failed:", convErr);
                if (fs.existsSync(tempLocation)) fs.unlinkSync(tempLocation);
                return repondre('❌ Failed to optimize the audio format.');
            }
        }

        // Tuma kwenda Catbox
        const cloudUrl = await uploadToCatbox(tempLocation);
        
        // Futa faili la hapa nyumbani (local temp file) kuzuia space kujaa
        if (fs.existsSync(tempLocation)) fs.unlinkSync(tempLocation);

        // Tuma matokeo ya mwisho kwa mtumiaji
        const finalResponse = `╭─────═━┈┈━═──━┈⊷
┇ 『 *TIMNASA MD URL ENGINE* 』
┇ *Media Type:* ${mediaType.toUpperCase()}
╰─────═━┈┈━═──━┈⊷
🔗 *Generated Link:* ${cloudUrl}

> 📥 Link runs permanently on cloud storage.`;

        await zk.sendMessage(dest, { 
            text: finalResponse,
            contextInfo: {
                newsletterJid: "120363316279146194@newsletter",
                newsletterName: "TIMNASA MD CLOUD LOGS"
            }
        }, { quoted: ms });

    } catch (error) {
        console.error('Critical Error in URL Command:', error);
        if (fs.existsSync(tempLocation)) fs.unlinkSync(tempLocation);
        repondre('❌ Dynamic cloud link generation failed. Server error.');
    }
});
