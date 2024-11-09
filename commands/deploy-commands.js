const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers a Solana address')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('Solana address (44-character base58 format)')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('proposal')
    .setDescription('Creates a voting event')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option.setName('title').setDescription('Proposal title').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Description of proposal (max 4000 characters)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reactions')
        .setDescription(
          'List reactions in the order they will be displayed, separated by commas. (e.g. :one:,:two:,:three:)'
        )
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('unregister')
    .setDescription(
      'Unregisters user or Solana address (either option will properly remove from database)'
    )
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName('user')
        .setDescription('Input user ID to unregister')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('Input Solana address to unregister')
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('get-address')
    .setDescription('Gets address by user ID')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option.setName('user').setDescription('Input user ID').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('get-user')
    .setDescription('Gets user ID by Solana address')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('Input Solana address')
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
