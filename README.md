# Discord Proposal Bot

This bot is used to create and manage proposals that guild members can vote on.

Votes are weighted by the balance of the account registered by the user. The more ERC-20/ERC-721 tokens the user has, the more weight they have.

Admin tools are available to manage the proposals and users registered to vote.

## Features

- Create proposals
- Vote on proposals
- Manage accounts registered by users

## Configuration

Edit `sample.config.json` to `config.json`.
All following configs are required.

1. "token" - Bot token can be found via [discord](https://discord.com/developers/applications) in applications bot tab.
2. "clientId" - Application ID for bot account can be found via [discord](https://discord.com/developers/applications).
3. "guildId" - Server ID that the bot will run on.
4. "permissionedRolesIds" - Ids of roles with voting privalges, should include admin roles if they also plan to vote. (Must be array type)
5. "adminRoleIds" - (Must be a array type)
6. "channelId" - Channel ID the bot will post proposals too.
7. "proposalChannelId" - Channel ID of the channel where the bot will post proposals.
8. "imageUrl" - URL of the image that will be used for the proposals UI.
9. "infuraUrl"
10. "contractAddress"

## Installation & Usage

_install_ (only need to once) - `node commands/deploy-commands.js` <br>
_start_ - `node index.js`

## Commands

All commands are slash commands. For example: `/command`.

Commands permissioned for voting roles:

- `/register`<br>
  - _input_ `address` - Registers address for retrieving token balance.

Admin commands:

- `/proposals` <br>

  - _input_ `title` - Title used for proposal. <br>
  - _input_ `description` - Description of proposal. <br>
  - _input_ `reactions` - Reactions used for proposal, given in order that will be displayed. (seperated by commas, no spaces after commas)<br>

- `/unregister` <br>

  - _input_ `address` - Unregisters address to user. <br>
  - _input_ `user` - Unregisters userID. <br>

- `/get-address-by-user` <br>

  - _input_ `user` - Retrieves the address registered to user. <br>

- `/get-user-by-address` <br>
  - _input_ `address` - Retrieves the userID registered to address. <br>

### Disclaimer

Whitout signature verification, this bot relys on the good faith of the community to register their actual accounts. Address checks are in place so that one address can only be registered once. Admins are given the `/unregister` command to remove accounts from voting if users are acting in bad faith and/or are abusing the bot.
