const { Client, Intents } = require('discord.js');
const DaoApp = require('./bot.js');
const { token, channelId, permissionedRolesId } = require('./config.json');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const Dao = new DaoApp(token, client, channelId, permissionedRolesId);

Dao.start();
