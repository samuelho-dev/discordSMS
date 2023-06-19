import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Guild } from 'knex/types/tables';
import db from '../db/knex';

export const data = new SlashCommandBuilder()
  .setName('updatePhoneNumber')
  .setDescription('Send an SMS to your group.')
  .addStringOption((option) =>
    option
      .setName('TWILIO_PHONE_NUMBER')
      .setDescription('Enter your TWILIO_PHONE_NUMBER.')
      .setRequired(true)
      .setMaxLength(10),
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.guild || !interaction.guild.id) return;

  const TWILIO_PHONE_NUMBER = interaction.options.get('TWILIO_PHONE_NUMBER');
  if (
    !TWILIO_PHONE_NUMBER ||
    !TWILIO_PHONE_NUMBER.value ||
    typeof TWILIO_PHONE_NUMBER.value !== 'string'
  ) {
    return interaction.reply('Please input your TWILIO_PHONE_NUMBER.');
  }

  const guild = db<Guild>('guild');

  try {
    await guild
      .where({
        guild_id: interaction.guild.id,
      })
      .insert({
        phone_number: TWILIO_PHONE_NUMBER.value,
      })
      .onConflict(['TWILIO_PHONE_NUMBER'])
      .merge({
        phone_number: TWILIO_PHONE_NUMBER.value,
      });
  } catch (err) {
    console.error(err);
    return interaction.reply(
      'An error occured while updating your phone number, please check your credentials.',
    );
  }

  return void interaction.reply(`Messages have been sent.`);
}
