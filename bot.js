const Keyv = require('keyv');
const { dbName } = require('./config.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

class DaoApp {
  /**
   * @dev constructor
   * @param {Discord bot application token: string} token
   * @param {discord client api; Client Object} client
   * @param {snowflakes of channels; string[]} channel
   * @param {snowflakes of permissioned roles for bot interactions; string[]} permissionedRoles
   */
  constructor(token, client, channel, permissionedRoles) {
    this.token = token;
    this.client = client;
    this.channel = channel;
    this.permissionedRoles = permissionedRoles;
    this.db = new Keyv(`sqlite://../database/${databaseName}.sqlite`);
  }

  /**
   * @dev Requires discord user to have the permissioned role, else fails bot interaction
   * @param {discord interaction object} interaction
   * @param {snowflake of discord permissioned | string} role
   * @returns {boolean}
   */
  async interactionRoleFilter(interaction, role = this.permissionedRoles[0]) {
    const member = interaction.member;
    const roles = member.roles.cache;

    return roles.has(role);
  }

  // TODO: Test UX and Admin UX if reaction emojis or buttons for best voting experience
  /**
   * @dev Creates embedded message for dao proposals
   * @param {dao proposal title | string} title
   * @param {proposal description | string} description
   * @param {snowflakes of reactions for voting| string[]} reactions
   * @param {TODO: admin image upload for individual proposals} image
   * @returns {typeOf MessageEmbed}
   */
  createEmbed(title, description, reactions, image) {}

  /**
   * @dev interaction handler for bot slash commands
   * @param {discord interaction object} interaction
   */
  async interactionHandler(interaction) {
    if (!interaction.isCommand()) return;
    const member = interaction.member;

    const { commandName } = interaction;

    if (
      commandName === 'register' &&
      // snowflake id is for the test servers tester role
      member.roles.cache.has('921594568581984256')
    ) {
      await interaction.reply('please enter your ethereum address');
    } else if (commandName === 'beep') {
      await interaction.reply('Boop!');
    }
  }

  async start() {
    try {
      await this.client.once('ready', () => {
        console.log('Ready!');
      });

      this.client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        const member = interaction.member;

        const { commandName } = interaction;

        if (
          commandName === 'register' &&
          // snowflake id is for the test servers tester role
          member.roles.cache.has('921594568581984256')
        ) {
          await interaction.reply('please enter your ethereum address');
        } else if (commandName === 'beep') {
          await interaction.reply('Boop!');
        }
      });

      // starts the application client
      await client.login(this.token);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = DaoApp;
