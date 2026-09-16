const { zokou } = require("../framework/zokou");
const axios = require("axios");
const s = require("../set");

zokou(
  {
    nomCom: "addcmdgithub",
    alias: ["addgit", "gitcmd", "pushcmd"],
    categorie: "Owner",
    reaction: "🐙"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    if (!superUser) {
      return repondre("❌ Command hii ni maalum kwa ajili ya Owner tu!");
    }

    if (!arg || arg.length < 2) {
      return repondre("❌ *Weka jina la faili na code!*");
    }

    // Kuchukua Token kutoka Environment Variables au set.js
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || s.GITHUB_TOKEN;
    const REPO_OWNER = "timnasax";
    const REPO_NAME = "all-updates";
    const BRANCH = "main";

    if (!GITHUB_TOKEN || GITHUB_TOKEN.includes("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")) {
      return repondre("⚠️ *Token ya zamani au batili inatumika!* Badilisha GITHUB_TOKEN kwenye Dashboard ya hosting yako.");
    }

    const filename = arg[0].endsWith(".js") ? arg[0] : `${arg[0]}.js`;
    const codeContent = arg.slice(1).join(" ");
    const filePath = `commandes/${filename}`;
    const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    try {
      await repondre(`⏳ *Inapakia faili \`${filename}\` kwenda GitHub (${REPO_OWNER}/${REPO_NAME})...*`);

      let sha = null;
      try {
        const checkFile = await axios.get(githubApiUrl, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
        });
        sha = checkFile.data.sha;
      } catch (err) {}

      const contentEncoded = Buffer.from(codeContent).toString("base64");

      const payload = {
        message: `Add/Update command: ${filename} via WhatsApp Bot`,
        content: contentEncoded,
        branch: BRANCH,
        ...(sha && { sha })
      };

      await axios.put(githubApiUrl, payload, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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
