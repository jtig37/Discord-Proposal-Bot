const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('registers ethereum address')
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('Ethereum address starting in 0x...')
        .setRequired(true)
    ),
  // new SlashCommandBuilder()
  //   .setName('clear')
  //   .setDescription('votes for a proposal')
  //   .addStringOption((option) => {
  //     option
  //       .setName('user')
  //       .setDescription('guild members userId')
  //       .setRequired(true);
  //   }),
  new SlashCommandBuilder()
    .setName('proposal')
    .setDescription('creates a voting event')
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
        .setName('option1')
        .setDescription(
          'List reactions in the order that will be displayed, without spaces. (e.g. :smile::cry::angry::)'
        )
        .setRequired(false)
    ).
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
