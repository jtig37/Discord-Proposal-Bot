const Keyv = require('keyv');
const GrayBoyContract = require('./web3/web3.js');
const {
  database,
  clientId,
  permissionedRolesIds,
  adminRoleIds,
} = require('./config.json');
const Embed = require('./modules/embed.js');
const { MessageEmbed } = require('discord.js');

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
    this.contract = new GrayBoyContract();
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
  interactionRoleChecker(membersRoles, roles = permissionedRolesIds) {
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
      this.interactionRoleChecker(membersRoles)
    ) {
      // Checks if address has already been registered
      const submittedAddress = options.getString('address');
      const address = await this.db.get(member.user.id);
      const user = await this.db.get(submittedAddress);

      if (user === undefined && address === undefined) {
        const registeredUserToAddress = await this.db.set(
          member.user.id,
          submittedAddress
        );
        const registerAddressToUser = await this.db.set(
          submittedAddress,
          member.user.id
        );
        registerAddressToUser && registeredUserToAddress
          ? await interaction.reply({
              content: `You have sucessfully registered: ${submittedAddress}`,
              ephemeral: true,
            })
          : await interaction.reply({
              content: 'Something went wrong, please try again.',
              ephemeral: true,
            });
        {
        }
      } else if (address) {
        await interaction.reply({
          content: `You have already registered this address: ${address} \nIf you would like to change your address, please contact an admin.`,
          ephemeral: true,
        });
      } else if (user !== member.user.id && user !== undefined) {
        return await interaction.reply({
          content: `This address has already been registered to another user. \nIf there is an issue, please contact an admin.`,
          ephemeral: true,
        });
      }
    } else if (
      commandName === 'proposal' &&
      this.interactionRoleChecker(membersRoles, adminRoleIds)
    ) {
      const reactions = options.getString('reactions');
      const reactionList = reactions.toString().split(',');
      const proposal = new Embed(
        options.getString('title'),
        options.getString('description'),
        reactionList
      );
      const embeddedProposal = proposal.message;
      const message = await channel.send({
        embeds: [embeddedProposal],
      });

      reactionList.forEach((reaction) => {
        message.react(reaction);
      });

      const filter = (reaction, user) => {
        return (
          reactionList.includes(reaction.emoji.name) && clientId !== user.id
        );
      };

      const collector = message.createReactionCollector({ filter });

      collector.on('collect', async (reaction, user) => {
        const usersAddress = await this.db.get(user.id);
        if (usersAddress === undefined) {
          interaction.reply({
            content:
              'You have not registered an address.\nTo register please use the `/register` command.',
            ephemeral: true,
          });
        }

        const votersGrayBoyBalance = await this.contract.balanceOf(
          usersAddress
        );

        const cachedEmbed = message.embeds[0];
        const updatedFields = cachedEmbed.fields.map((x) =>
          x.name === `Option ${reaction.emoji.name}:`
            ? { ...x, value: (x.value += votersGrayBoyBalance) }
            : x
        );
        const newEmbed = new MessageEmbed(cachedEmbed).setFields(updatedFields);
        console.log({ cachedEmbed, updatedFields, newEmbed });

        message.edit({ embeds: [newEmbed] });
      });

      await interaction.reply('Proposal sent!');
    } else if (
      commandName === 'unregister' &&
      this.interactionRoleChecker(membersRoles, adminRoleIds)
    ) {
      const submittedAddress = options.getString('address');
      const submittedUserId = options.getString('user');

      try {
        if (submittedUserId) {
          const address = await this.db.get(submittedUserId);
          await this.db.delete(submittedUserId);
          await this.db.delete(address);
          await interaction.reply({
            content: `${submittedUserId} has been unregistered.`,
            ephemeral: true,
          });
        } else if (submittedAddress) {
          const userId = await this.db.get(submittedAddress);
          await this.db.delete(submittedAddress);
          await this.db.delete(userId);
          await interaction.reply({
            content: `${submittedAddress} has been unregistered.`,
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Something went wrong, please try again.',
          ephemeral: true,
        });
      }
    } else if (
      (commandName === 'get-address-by-user') |
        (commandName === 'get-user-by-address') &&
      this.interactionRoleChecker(membersRoles, adminRoleIds)
    ) {
      const submittedUserId = options.getString('user');
      const submittedAddress = options.getString('address');
      console.log({ submittedUserId, submittedAddress });

      if (submittedUserId !== null) {
        const address = await this.db.get(submittedUserId);
        return await interaction.reply({
          content: address
            ? `${submittedUserId}'s address is: ${address}`
            : `${submittedUserId} has not registered an address.`,
          ephemeral: true,
        });
      }

      if (submittedAddress !== null) {
        const userId = await this.db.get(submittedAddress);
        return await interaction.reply({
          content: userId
            ? `${submittedAddress} is registered to: ${userId}`
            : `${submittedAddress} is not registered.`,
          ephemeral: true,
        });
      }
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
      });

      // starts the application client
      await this.client.login(this.token);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = DaoApp;
