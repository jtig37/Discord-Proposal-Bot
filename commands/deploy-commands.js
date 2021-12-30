const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('registers ethereum address')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('Ethereum address starting in 0x...')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('proposal')
    .setDescription('creates a voting event')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option.setName('title').setDescription('proposal title').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('description of proposal (max 4000 char.)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reactions')
        .setDescription(
          'List reactions in the order that will be displayed, seperated by commas. (e.g. :one:,:two:,:three:)'
        )
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('unregister')
    .setDescription(
      'unregisters user or address (either option will properly remove from db)'
    )
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        // There is a error with zod lib here where regex won't accept "userId" as the name
        .setName('user')
        .setDescription('input users id to unregister')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('input address to unregister')
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('get-address')
    .setDescription('gets address by user id')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option.setName('user').setDescription('input users id').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('get-user')
    .setDescription('gets user id by address')
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('input address')
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
