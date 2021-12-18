require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  let guild;
  if (msg.content === 'ping') {
    msg.reply('pong').catch((res) => {
      console.log(res);
    });

    client.guilds(msg.guild.id).then((res) => (guild = res));
    console.log(guild.name);
  }
});

client.login(process.env.TOKEN);
