const { zokou } = require("../framework/zokou");
const fancyStyle = require("../framework/fancy"); // Ensure the relative path to your fancy module is correct

zokou(
  {
    nomCom: "fancy",
    alias: ["font", "style", "styletext"],
    categorie: "Tools",
    reaction: "🎨"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre } = commandeOptions;

    // If the user provides no arguments
    if (!arg || arg.length === 0) {
      return repondre(
        "❌ *Please provide text or choose a style number!*\n\n" +
        "*Usage Examples:*\n" +
        "1. `.fancy 5 Timnasa` (Converts text to style number 5)\n" +
        "2. `.fancy Timnasa` (Shows all available styles)"
      );
    }

    const firstInput = arg[0];
    const styleIndex = parseInt(firstInput);

    // If the user inputs a style number first, followed by text (e.g., .fancy 3 Hello World)
    if (!isNaN(styleIndex) && arg.length > 1) {
      const textToStyle = arg.slice(1).join(" ");
      
      try {
        const allStyles = fancyStyle.listall(textToStyle);

        if (styleIndex < 1 || styleIndex > allStyles.length) {
          return repondre(`❌ Invalid choice. Please select a number between 1 and ${allStyles.length}`);
        }

        const result = allStyles[styleIndex - 1];
        return repondre(result);
      } catch (error) {
        console.error("Fancy Error:", error);
        return repondre("❌ Failed to transform the text style.");
      }
    }

    // If the user provides only text (e.g., .fancy Timnasa)
    const textToStyle = arg.join(" ");
    
    try {
      const allStyles = fancyStyle.listall(textToStyle);
      
      let menuText = `✨ *FANCY TEXT STYLES FOR:* "${textToStyle}" ✨\n\n`;
      menuText += `*Usage:* Type \`.fancy <number> ${textToStyle}\`\n\n`;

      allStyles.forEach((styledText, index) => {
        menuText += `*${index + 1}.* ${styledText}\n`;
      });

      return repondre(menuText);
    } catch (error) {
      console.error("Fancy Error:", error);
      return repondre("❌ An error occurred while fetching fonts.");
    }
  }
);
