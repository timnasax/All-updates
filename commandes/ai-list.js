const { zokou } = require('../framework/zokou');

zokou({
  nomCom: "100",
  categorie: "AI",
  reaction: "💯"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg, repondre, prefixe } = commandeOptions;
  
  // Kuunganisha maneno aliyoandika mtumiaji
  const q = arg.join(" ");

  // 1. Angalia kama mtumiaji ameweka swali au ujumbe
  if (!q) {
    return repondre(`*Syntax Error*\nMfano:\n${prefixe}100 What day is today`);
  }

  // 2. Kuandaa URL na ku-encode matini
  const txt = encodeURIComponent(q);
  const url = `https://api-faa.my.id/faa/ai-realtime?text=${txt}`;

  try {
    // 3. Onyesha status kuwa bot inaandika (Typing...)
    await zk.sendPresenceUpdate('composing', dest);

    // 4. Pakua majibu kutoka kwenye API
    const response = await fetch(url);
    const res = await response.json();

    // 5. Angalia kama majibu yamepatikana
    if (!res || !res.result) {
      return repondre(`❌ Imeshindikana kupata majibu kutoka kwa AI.`);
    }

    const aiResult = res.result;

    // 6. Tuma majibu ya AI kwa mtumiaji
    return zk.sendMessage(
      dest,
      { text: `💯 *TIMNASA AI (Timothy)*:\n\n${aiResult}` },
      { quoted: ms }
    );

  } catch (e) {
    return repondre(`❌ Kutokea kwa hitilafu.\nError: ${String(e.message || e)}`);
  }
});
