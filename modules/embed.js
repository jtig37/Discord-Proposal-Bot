const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require('discord.js');
const GrayBoy = new MessageAttachment('./assets/GrayBoy.jpg');
const { politicianGrayBoyURL } = require('../config.json');

// TODO: Test UX and Admin UX if reaction emojis or buttons for best voting experience
/**
 * @dev Creates embedded message for dao proposals
 * @param {dao proposal title | string} title
 * @param {dao proposal url | string} url (optional)
 * @param {proposal description | string} description
 * @param {reactions for voting options| string[] i.e. :smile:} reactions
 * @param {object with key value pair being reaction name and user weighted votes respectively | i.e. {":smile:": 2}} updateVotes
 * @param {TODO: admin image upload for individual proposals} image (optional)
 * @returns {typeOf MessageEmbed}
 */
class Embed {
  constructor(title, description, reactions, url) {
    this.title = title;
    this.url = url ? url : null;
    this.description = description;

    // creates and array of reactions then creates and object of reactions with {[reaction]: [weighted votes]}
    // (weighted votes default is 0)
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
        name: 'GrayBoys High Council',
        icon_url: politicianGrayBoyURL,
        url: this.url,
      },
      description: this.description,
      thumbnail: {
        url: politicianGrayBoyURL,
      },
      fields: this.fields(),
      image: {
        // url: politicianGrayBoyURL,
      },
      timestamp: new Date(),
      footer: {
        text: 'These votes are weighted according to the number of GrayBoys in voters accounts.',
      },
    };
  }
}

/**
 *
 * @param {cached embed from message.embeds[0]} cachedEmbed
 * @param {reaction emoji name} reactionName
 * @param {returned balance from contract} votersBalance
 * @param {'add' or 'remove' for type of vote update} updateType
 * @returns {typeOf MessageEmbed}
 */
function updateEmbedVotes(
  cachedEmbed,
  reactionName,
  votersBalance,
  updateType = 'add' | 'remove'
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
