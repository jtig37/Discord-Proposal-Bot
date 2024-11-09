const { MessageEmbed } = require('discord.js');
const { imageURL } = require('../config.json');

// TODO: Test UX and Admin UX with reaction emojis or buttons for best voting experience
/**
 * @dev Creates embedded message for Solana DAO proposals
 * @param {string} title - Title of the DAO proposal
 * @param {string} url - URL for the proposal (optional)
 * @param {string} description - Proposal description
 * @param {string[]} reactions - Reactions for voting options (e.g., :smile:)
 * @param {object} updateVotes - Object with reaction name as key and user weighted votes as value (e.g., {":smile:": 2})
 * @param {string} image - Image for the proposal (optional)
 * @returns {MessageEmbed}
 */
class Embed {
  constructor(title, description, reactions, authorsName, url) {
    this.title = title;
    this.url = url || null;
    this.authorsName = authorsName;
    this.description = description;

    // Initialize votes for each reaction option with a default of 0
    this.votes = reactions.reduce(
      (prev, name) => ({ ...prev, [name]: '0' }),
      {}
    );
    this.fields = () => {
      const fields = [];

      Object.keys(this.votes).forEach((name) => {
        fields.push({
          name: `Option ${name}:`,
          value: this.votes[name],
          inline: true,
        });
      });

      return fields;
    };
    this.message = {
      color: 0x0099ff,
      title: this.title,
      url: this.url,
      author: {
        name: this.authorsName,
        icon_url: imageURL,
        url: this.url,
      },
      description: this.description,
      thumbnail: {
        url: imageURL,
      },
      fields: this.fields(),
      image: {
        // Placeholder for potential future image customization
        // url: customImageURL,
      },
      timestamp: new Date(),
      footer: {
        text: 'These votes are weighted according to the user\'s holdings in the Solana-based assets.',
      },
    };
  }
}

/**
 * Updates the embed votes by adding or removing votes based on the reaction and balance
 * @param {MessageEmbed} cachedEmbed - Cached embed from message.embeds[0]
 * @param {string} reactionName - Reaction emoji name
 * @param {number} votersBalance - Balance from Solana wallet (e.g., token balance or NFT count)
 * @param {'add'|'remove'} updateType - Type of vote update (either 'add' or 'remove')
 * @returns {MessageEmbed}
 */
function updateEmbedVotes(
  cachedEmbed,
  reactionName,
  votersBalance,
  updateType = 'add'
) {
  const updatedFields = cachedEmbed.fields.map((x) =>
    x.name === `Option ${reactionName}:`
      ? {
          ...x,
          value: (updateType === 'add'
            ? parseInt(x.value) + parseInt(votersBalance)
            : parseInt(x.value) - parseInt(votersBalance)
          ).toString(),
        }
      : x
  );
  const newEmbed = new MessageEmbed(cachedEmbed).setFields(updatedFields);

  return newEmbed;
}

module.exports = { Embed, updateEmbedVotes };
