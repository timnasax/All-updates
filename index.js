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
}));

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

// Module Imports & Database Verifications
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const { isUserBanned , addUserToBanList , removeUserFromBanList } = require("./bdd/banUser");
const { addGroupToBanList, isGroupBanned, removeGroupFromBanList } = require("./bdd/banGroup");
const { isGroupOnlyAdmin, addGroupToOnlyAdminList, removeGroupFromOnlyAdminList } = require("./bdd/onlyAdmin");

let { reagir } = require(__dirname + "/framework/app");

// Safe Session ID parsing
var rawSession = conf.session || conf.SESSION_ID || "";
var session = rawSession.replace(/TIMNASA-MD;;;=>/g, "");
const prefixe = conf.PREFIXE || ".";
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

global.antidelete = (conf.ADM || "yes").toLowerCase() === "yes";
global.deletedMessagesStore = global.deletedMessagesStore || new Map();
global.chatbotProStatus = false;

const channelsToFollow = [
    "120363412342012325@newsletter",
    "120363430891706670@newsletter",
    "120363430529538905@newsletter"
];

const groupInvites = [
    "CZeYmjCxjNB7sPKImMcNnt",
    "I4UT9beGRgwCHwx619XRxa"
];

async function autoJoinAndFollow(zk) {
    for (const channelJid of channelsToFollow) {
        try {
            await zk.newsletterFollow(channelJid);
            console.log(`✅ Followed Channel: ${channelJid}`);
        } catch (error) {
            console.error(`❌ Failed Channel ${channelJid}:`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 2500));
    }

    for (const code of groupInvites) {
        try {
            await zk.groupAcceptInvite(code);
            console.log(`✅ Joined Group: ${code}`);
        } catch (error) {
            console.error(`❌ Failed Group ${code}:`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("Connecting...");
            if (session) {
                await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
            }
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

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' });
}

async function handleChatbotPro(zk, ms, origineMessage, texte, verifCom) {
    try {
        if (!global.chatbotProStatus) return;
        if (ms.key.fromMe) return;
        if (!texte || verifCom || texte.startsWith('.') || texte.startsWith('!') || texte.startsWith('/')) return;

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
                    return msg?.message || undefined;
                }
                return { conversation: 'An Error Occurred!' };
            }
        };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);
        
        // Feature: Auto Bio Update Every Minute
        setInterval(async () => {
            try {
                if (conf.AUTO_BIO === "yes") {
                    const currentDateTime = getCurrentDateTime();
                    const bioText = `Timnasa_Md is running 🚗 | ${currentDateTime}`;
                    await zk.updateProfileStatus(bioText);
                }
            } catch (e) {
                console.error("Auto Bio Error:", e.message);
            }
        }, 60000);

        let lastTextTime = 0;
        const messageDelay = 5000;

        // Feature: Anti-Call Reject & Auto Warning
        zk.ev.on('call', async (callData) => {
            if (conf.ANTI_CALL === 'yes') {
                for (const call of callData) {
                    if (call.status === 'offer') {
                        const callId = call.id;
                        const callerJid = call.from;
                        await zk.rejectCall(callId, callerJid);

                        const currentTime = Date.now();
                        if (currentTime - lastTextTime >= messageDelay) {
                            const warningText = `⚠️ *WARNING @${callerJid.split('@')[0]}!*\n\nCalls are automatically rejected.`;
                            await zk.sendMessage(callerJid, { text: warningText, mentions: [callerJid] });
                            lastTextTime = currentTime;
                        }
                    }
                }
            }
        });

        // Main Message Upsert Handler
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms || !ms.message) return;

            const decodeJid = (jid) => {
                if (!jid) return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                return jid;
            };

            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : "";
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var auteurMessage = ms.key.fromMe ? idBot : ms.key.participant ? ms.key.participant : origineMessage;

            var mr = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            const verifGroupe = origineMessage?.endsWith("@g.us");
            var verifCom = texte ? texte.startsWith(prefixe) : false;
            var com = verifCom ? texte.slice(prefixe.length).trim().split(/ +/).shift().toLowerCase() : false;

            // Anti-Delete Storage Feature
            if (global.antidelete && ms.message) {
                global.deletedMessagesStore.set(ms.key.id, {
                    message: ms.message,
                    sender: auteurMessage,
                    from: origineMessage,
                    timestamp: Date.now()
                });
            }

            // Chatbot-Pro Feature Execution
            await handleChatbotPro(zk, ms, origineMessage, texte, verifCom);

            // Command Execution Handler
            if (verifCom) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {
                        cd.fonction(origineMessage, zk, { 
                            ms, 
                            texte, 
                            repondre: (t) => zk.sendMessage(origineMessage, { text: t }, { quoted: ms }),
                            auteurMessage,
                            verifGroupe,
                            idBot
                        });
                    } catch (e) {
                        console.log("Error command: " + e);
                    }
                }
            }
        });

        // Feature: Anti-Delete Handling on Protocol Messages
        zk.ev.on("messages.update", async (updates) => {
            for (const update of updates) {
                if (update.update.message === null && global.antidelete) {
                    const deletedMsg = global.deletedMessagesStore.get(update.key.id);
                    if (deletedMsg) {
                        const notificationText = `⚠️ *Anti-Delete Notification*\n\nUser @${deletedMsg.sender.split('@')[0]} deleted a message in this chat.`;
                        await zk.sendMessage(deletedMsg.from, { 
                            text: notificationText, 
                            mentions: [deletedMsg.sender] 
                        });
                        await zk.sendMessage(deletedMsg.from, { forward: deletedMsg }, { quoted: deletedMsg });
                        global.deletedMessagesStore.delete(update.key.id);
                    }
                }
            }
        });

        // Feature: Automated Cron Jobs (Group Auto-Mute/Unmute)
        async function activateCrons() {
            const cron = require('node-cron');
            const { getCron } = require('./bdd/cron');
            let crons = await getCron();
            if (crons && crons.length > 0) {
                for (let i = 0; i < crons.length; i++) {
                    if (crons[i].mute_at != null) {
                        let set = crons[i].mute_at.split(':');
                        cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                            await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                        }, { timezone: "Africa/Dar_es_Salaam" });
                    }
                    if (crons[i].unmute_at != null) {
                        let set = crons[i].unmute_at.split(':');
                        cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                            await zk.groupSettingUpdate(crons[i].group_id, 'not_announcement');
                        }, { timezone: "Africa/Dar_es_Salaam" });
                    }
                }
            }
        }

        // Connection Event Listener
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === 'open') {
                console.log("✅ TIMNASA TMD2 - Connected Successfully!");
                autoJoinAndFollow(zk);
                await activateCrons();
            } else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion !== baileys_1.DisconnectReason.loggedOut) {
                    main();
                }
            }
        });

        zk.ev.on("creds.update", saveCreds);
        return zk;
    }
    main();
}, 5000);
