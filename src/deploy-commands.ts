import * as commandModules from './commands';
import { REST, Routes } from 'discord.js';
import config from './config';
const { DISCORD_TOKEN, DISCORD_GUILD_ID, DISCORD_CLIENT_ID } = config;

type Command = { data: unknown };
const commands = [];

for (const module of Object.values<Command>(commandModules)) {
  commands.push(module.data);
}
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN!);

rest
  .put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID!, DISCORD_GUILD_ID!), {
    body: commands,
  })
  .then(() => console.log('Added Commands! 🔥'))
  .catch(console.error);
