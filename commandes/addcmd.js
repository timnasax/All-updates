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

    // Restrict access to owner only
    if (!superUser) {
      return repondre("❌ This command is restricted to the bot owner only!");
    }

    if (!arg || arg.length < 2) {
      return repondre(
        "❌ *Usage:*\n\n" +
        "`.addgit <filename.js> <javascript_code>`\n\n" +
        "*Example:*\n" +
        "`.addgit test.js const { zokou } = require('../framework/zokou'); zokou({nomCom:'test'}, async(dest, zk, opt) => { opt.repondre('Hello'); });`"
      );
    }

    // GitHub Repository Configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "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";
    const REPO_OWNER = "timnasax";
    const REPO_NAME = "all-updates";
    const BRANCH = "main"; // Or 'master' depending on your repository default branch

    const filename = arg[0].endsWith(".js") ? arg[0] : `${arg[0]}.js`;
    const codeContent = arg.slice(1).join(" ");
    const filePath = `commandes/${filename}`;
    const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    try {
      await repondre(`⏳ *Uploading \`${filename}\` to GitHub (${REPO_OWNER}/${REPO_NAME})...*`);

      // 1. Check if the file already exists on GitHub to retrieve its SHA (required for updating)
      let sha = null;
      try {
        const checkFile = await axios.get(githubApiUrl, {
          headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        sha = checkFile.data.sha;
      } catch (err) {
        // File does not exist yet; it will be created as a new file
      }

      // 2. Encode the source code to Base64 (GitHub API requirement)
      const contentEncoded = Buffer.from(codeContent).toString("base64");

      // 3. Send commit request to GitHub API
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
        `✅ *FILE SUCCESSFULLY ADDED TO GITHUB!*\n\n` +
        `📌 *Repository:* \`${REPO_OWNER}/${REPO_NAME}\`\n` +
        `📁 *Path:* \`${filePath}\`\n` +
        `🔗 *Link:* https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${filePath}`
      );

    } catch (error) {
      console.error("GitHub Push Error:", error.response?.data || error.message);
      const errMsg = error.response?.data?.message || error.message;
      return repondre(`❌ *Failed to push to GitHub:* ${errMsg}`);
    }
  }
);
