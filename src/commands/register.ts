import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Guild } from 'knex/types/tables';
import db from '../db/knex';

export const data = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register your guild.')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('Enter the name of your group.')
      .setRequired(true)
      .setMaxLength(10),
  )
  .addStringOption((option) =>
    option
      .setName('sms_tag')
      .setDescription(
        'Enter the keyword you would like users to subscribe with Ex: Text "{sms_tag}" to subscribe for updates.',
      )
      .setRequired(true)
      .setMaxLength(10),
  )
  .addStringOption((option) =>
    option
      .setName('tagline')
      .setDescription(
        'Enter the tagline to subscribe. Ex: {tagline} Text "{sms_tag}" to subscribe for updates. Text "STOP" to unsubscribe.',
      )
      .setRequired(true)
      .setMaxLength(200),
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.guild || !interaction.guild.id) return;

  // MEMBER MUST BE AN ADMIN
  const member = interaction.member as GuildMember;
  if (!member.permissions.has('Administrator')) {
    return interaction.reply(
      'You do not have the required permissions to use this command. ❌',
    );
  }

  const name = interaction.options.get('name');

  if (!name || !name.value || typeof name.value !== 'string') {
    return interaction.reply('Please input your name.');
  }

  const sms_tag = interaction.options.get('name');
  if (!sms_tag || !sms_tag.value || typeof sms_tag.value !== 'string') {
    return interaction.reply(
      'Please input the tag you would like your subscribers to message.',
    );
  }

  const tagline = interaction.options.get('tagline');
  if (!tagline || !tagline.value || typeof tagline.value !== 'string') {
    return interaction.reply(
      'Please input your tagline to send to your subscribers.',
    );
  }

  const guilds = db<Guild>('guild');
  const guild = guilds.where({ guild_id: interaction.guild.id });

  try {
    await guild
      .insert({
        guild_id: interaction.guild.id,
        guild_name: name.value,
        sms_tag: sms_tag.value,
        tagline: tagline.value,
      })
      .onConflict(['guild_id'])
      .merge({
        guild_name: name.value,
        sms_tag: sms_tag.value,
        tagline: tagline.value,
      });
  } catch (err) {
    console.error(err);
    return interaction.reply(
      'An error occured while registration, please check your credentials.',
    );
  }

  return void interaction.reply(`Messages have been sent.`);
}
