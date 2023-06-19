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
        'Enter the keyword you would like users to subscribe with. Max 5 Characters.',
      )
      .setRequired(true)
      .setMaxLength(5),
  )
  .addStringOption((option) =>
    option
      .setName('tagline')
      .setDescription(
        'Enter the tagline that you will be sending your users. Max 200 Characters.',
      )
      .setRequired(true)
      .setMaxLength(200),
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.guild || !interaction.guild.id) return;

  const name = interaction.options.get('name');

  if (!name || !name.value || typeof name.value !== 'string') {
    return interaction.reply('Please input your name.');
  }

  const sms_tag = interaction.options.get('sms_tag');
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
        updated_at: new Date(),
      });
  } catch (err) {
    console.error(err);
    return interaction.reply(
      'An error occured while registration, please check your credentials.',
    );
  }

  return void interaction.reply(`Messages have been sent.`);
}
