const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou(
  {
    nomCom: "addcmdgithub",
    alias: ["addgit", "gitcmd", "pushcmd"],
    categorie: "Owner",
    reaction: "🐙"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    // Zuia wasio na mamlaka
    if (!superUser) {
      return repondre("❌ Command hii ni maalum kwa ajili ya Owner tu!");
    }

    if (!arg || arg.length < 2) {
      return repondre(
        "❌ *Jinsi ya kutumia:*\n\n" +
        "`.addgit <jina_la_faili.js> <code_ya_javascript>`\n\n" +
        "*Mfano:*\n" +
        "`.addgit test.js const { zokou } = require('../framework/zokou'); zokou({nomCom:'test'}, async(dest, zk, opt) => { opt.repondre('Hello'); });`"
      );
    }

    // Mpangilio wa GitHub Repository
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Weka GitHub Personal Access Token kwenye set.js au env
    const REPO_OWNER = "timnasax";
    const REPO_NAME = "all-updates";
    const BRANCH = "main"; // Au 'master' kutokana na tawi la repo yako

    if (!GITHUB_TOKEN) {
      return repondre("⚠️ *GITHUB_TOKEN haijapatikana!* Weka Token yako kwenye Environment Variables (env) au set.js.");
    }

    const filename = arg[0].endsWith(".js") ? arg[0] : `${arg[0]}.js`;
    const codeContent = arg.slice(1).join(" ");
    const filePath = `commandes/${filename}`;
    const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    try {
      await repondre(`⏳ *Inapakia faili \`${filename}\` kwenda GitHub (${REPO_OWNER}/${REPO_NAME})...*`);

      // 1. Angalia kama faili tayari lipo kwenye GitHub ili kupata SHA yake (kwa ajili ya ku-update)
      let sha = null;
      try {
        const checkFile = await axios.get(githubApiUrl, {
          headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        sha = checkFile.data.sha;
      } catch (err) {
        // Faili halipo, litaundwa upya
      }

      // 2. Badilisha code kuwa mfumo wa Base64 (Hitaji la GitHub API)
      const contentEncoded = Buffer.from(codeContent).toString("base64");

      // 3. Tuma commit kwenda GitHub
      const payload = {
        message: `Add/Update command: ${filename} via WhatsApp Bot`,
        content: contentEncoded,
        branch: BRANCH,
        ...(sha && { sha })
      };

      await axios.put(githubApiUrl, payload, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      return repondre(
        `✅ *FAILI LIMEWEKWA KWENYE GITHUB!*\n\n` +
        `📌 *Repo:* \`${REPO_OWNER}/${REPO_NAME}\`\n` +
        `📁 *Njia:* \`${filePath}\`\n` +
        `🔗 *Link:* https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${filePath}`
      );

    } catch (error) {
      console.error("GitHub Push Error:", error.response?.data || error.message);
      const errMsg = error.response?.data?.message || error.message;
      return repondre(`❌ *Imeshindikana kuweka kwenye GitHub:* ${errMsg}`);
    }
  }
);
