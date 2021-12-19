const { Client, Intents } = require('discord.js');
const { token, channelId, permissionedRoleId } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const Dao = new DaoApp(token, client, channelId, permissionedRoleId);

Dao.start();
