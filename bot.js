class DaoApp {
  /**
   *
   * @param {Discord bot application token: string} token
   * @param {discord client api; Client Object} client
   * @param {snowflakes of channels; string[]} channel
   * @param {snowflakes of permissioned roles for bot interactions; string[]} permissionedRoles
   */
  constructor(token, client, channel, permissionedRoles) {
    this.token = token;
    this.client = client;
    this.channel = channel;
    this.permissionedRole = permissionedRoles;
  }

  /**
   *
   * @param {discord interaction object} interaction
   * @param {snowflake of discord permissioned | string} role
   * @returns {boolean}
   */
  async interactionRoleFilter(interaction, role) {
    const member = interaction.member;
    const roles = member.roles.cache;

    return roles.has(role);
  }

  async interactionHandler(interaction) {
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
  }

  async start() {
    try {
      await this.client.once('ready', () => {
        console.log('Ready!');
      });

      this.client.on('interactionCreate', async (interaction) => {
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

      // starts the application client
      await client.login(this.token);
    } catch (e) {
      console.error(e);
    }
  }
}
