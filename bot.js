const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
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

client.login(token);
