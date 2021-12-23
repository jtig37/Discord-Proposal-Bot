const Keyv = require('keyv');
const { MessageActionRow, MessageButton } = require('discord.js');
const { database, permissionedRolesId } = require('./config.json');
const Embed = require('./embed/embed.js');

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

  /**
   * @dev interaction handler for bot slash commands
   * @param {discord interaction object} interaction
   */
  async interactionHandler(interaction) {
    const member = interaction.member;
    const membersRoles = member.roles.cache.map((role) => role.id);
    const { commandName, options, channel } = interaction;

    // register command
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
          content: `This address has already been registered: ${address}`,
          ephemeral: true,
        });
      } else {
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
      // proposal command (admin)
    } else if (commandName === 'proposal') {
      console.log({
        reactions: options.getString('reactions').match(/([\s\S]+?:)/g),
      });
      const proposal = new Embed(
        options.getString('title'),
        options.getString('description'),
        options.getString('reactions').match(/([\s\S]+?:)/)
      );
      const embeddedProposal = proposal.message;
      console.log({ embeddedProposal });
      const message = await channel.send({
        embeds: [embeddedProposal],
      });
      // const messageActionRow = new MessageActionRow(message);
      await interaction.reply('Proposal sent!');
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
