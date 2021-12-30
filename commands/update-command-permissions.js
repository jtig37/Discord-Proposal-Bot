const {
  permissionedRoleIds,
  adminRoleIds,
  guildId,
} = require('../config.json');

async function updateCommandPermissions(client) {
  const commands = await client.guilds.cache.get(guildId)?.commands.fetch();

  await commands.each(async (command) => {
    // console.log({ command: command.permissions.set() });
    if (command.name === 'register') {
      //   console.log({ command });
      const permissions = permissionedRoleIds.map((roleId) => ({
        id: roleId,
        type: 'ROLE',
        permission: true,
      }));
      //   console.log({ perm: command.permissions });
      await command.permissions.add({ permissions });
    } else {
      const permissions = adminRoleIds.map((roleId) => ({
        id: roleId,
        type: 'ROLE',
        permission: true,
      }));
      await command.permissions.add({ permissions });
    }
  });
}

module.exports = updateCommandPermissions;
