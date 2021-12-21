const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require('discord.js');
const GrayBoy = new MessageAttachment('./assets/GrayBoy.jpg');

// TODO: Test UX and Admin UX if reaction emojis or buttons for best voting experience
/**
 * @dev Creates embedded message for dao proposals
 * @param {dao proposal title | string} title
 * @param {dao proposal url | string} url (optional)
 * @param {proposal description | string} description
 * @param {reactions for voting options| string[] i.e. :smile:} reactionNames
 * @param {object with key value pair being reaction name and user weighted votes respectively | i.e. {":smile:": 2}} updateVotes
 * @param {TODO: admin image upload for individual proposals} image (optional)
 * @returns {typeOf MessageEmbed}
 */
class Embed {
  constructor(title, url, description, reactionNames) {
    this.title = title;
    this.url = url;
    this.description = description;
    this.votes = reactionNames.reduce(
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
    // this.message = new MessageEmbed()
    //   .setColor('#0099ff')
    //   .setTitle(this.title)
    //   .setURL(this.url)
    //   .setDescription(this.description)
    //   .addField({ name: 'Please react to vote:', value: '\u200B' })
    //   .addFields(...this.fields())
    //   .setThumbnail(GrayBoy)
    //   .setTimestamp()
    //   .setFooter(
    //     'These votes are weighted according to the number of GrayBoys in voters accounts.'
    //   );
    this.message = {
      color: 0x0099ff,
      title: this.title,
      url: this.url,
      author: {
        name: 'Some name',
        icon_url: 'https://i.imgur.com/AfFp7pu.png',
        url: 'https://discord.js.org',
      },
      description: this.description,
      thumbnail: {
        url: 'https://i.imgur.com/AfFp7pu.png',
      },
      fields: this.fields(),
      image: {
        url: 'https://i.imgur.com/AfFp7pu.png',
      },
      timestamp: new Date(),
      footer: {
        text: 'These votes are weighted according to the number of GrayBoys in voters accounts.',
      },
    };
  }

  updateVotes = (reaction, weightedVote) => {
    this.votes[reaction] += weightedVote;
    return this.message;
  };
}

module.exports = Embed;
