import { Client, GuildMember } from 'discord.js';
import config from '../config';
import * as commandModules from '../commands';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

const commands = Object(commandModules);

client.once('ready', () => {
  console.log('🤖 Bot is ready.');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  // MEMBER MUST BE AN ADMIN
  const member = interaction.member as GuildMember;
  if (!member.permissions.has('Administrator')) {
    return void interaction.reply(
      'You do not have the required permissions to use this command. ❌',
    );
  }

  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.DISCORD_TOKEN);
