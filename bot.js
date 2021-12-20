const Keyv = require('keyv');
const { database, permissionedRolesId } = require('./config.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

class DaoApp {
  /**
   * @dev constructor
   * @param {Discord bot application token: string} token
   * @param {discord client api; Client Object} client
   * @param {snowflakes of channels; string[]} channel
   * @param {snowflakes of permissioned roles for bot interactions; string[]} permissionedRoles
   */
  constructor(token, client, channel) {
    this.token = token;
    this.client = client;
    this.channel = channel;
    this.db = new Keyv(`sqlite://${__dirname}/database/${database}.sqlite`);

    this.db.on('error', (err) => {
      console.error(err);
    });
  }

  /**
   * @dev Requires discord user to have the permissioned role, else fails bot interaction
   * @param {discord members roles for guild | string[]} membersRoles
   * @param {snowflake of discord permissioned | string[]} roles
   * @returns {boolean}
   */
  async interactionRoleChecker(membersRoles, roles = permissionedRolesId) {
    return membersRoles.some((role) => roles.includes(role));
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
    const member = interaction.member;
    const membersRoles = member.roles.cache.map((role) => role.id);
    const { commandName, options } = interaction;

    if (
      commandName === 'register' &&
      // snowflake id is for the test servers tester role
      (await this.interactionRoleChecker(membersRoles))
    ) {
      // Checks if address has already been registered
      const user = await this.db.get(options.getString('address'));

      if (user === undefined) {
        console.log({ user });
        return interaction.reply('This address has already been registered');
      }

      const address = await this.db.get(member.user.id);

      if (address) {
        return await interaction.reply({
          content: `This address has already been registeed: ${address}`,
          ephemeral: true,
        });
      } else {
        // console.log({
        //   id: member.user.id,
        //   address: options.getString('address'),
        // });

        // TODO: Need to come up with another solution to this, as it is not ideal
        const registeredUserToAddress = await this.db.set(
          member.user.id,
          options.getString('address')
        );
        const registerAddressToUser = await this.db.set(
          options.getString('address'),
          member.user.id
        );

        if (registeredUserToAddress && registerAddressToUser) {
          return await interaction.reply({
            content: "You've been registered!",
            ephemeral: true,
          });
        } else {
          return await interaction.reply({
            content: 'Something went wrong!',
            ephemeral: true,
          });
        }
      }
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

        await this.interactionHandler(interaction);
        // if (
        //   commandName === 'register' &&
        //   // snowflake id is for the test servers tester role
        //   member.roles.cache.has('921594568581984256')
        // ) {
        //   await interaction.reply('please enter your ethereum address');
        // } else if (commandName === 'beep') {
        //   await interaction.reply('Boop!');
        // }
      });

      // starts the application client
      await this.client.login(this.token);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = DaoApp;
