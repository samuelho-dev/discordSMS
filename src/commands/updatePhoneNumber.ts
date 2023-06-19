import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Guild } from 'knex/types/tables';
import db from '../db/knex';
import validatePhoneForE164 from '../utils/validateNumberE164';

export const data = new SlashCommandBuilder()
  .setName('update_phone_number')
  .setDescription('Send an SMS to your group.')
  .addStringOption((option) =>
    option
      .setName('phone_number')
      .setDescription('Enter your Twilio Phone Number. Ex. 3138884444')
      .setRequired(true)
      .setMaxLength(10),
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.guild || !interaction.guild.id) return;

  const phone_number = interaction.options.get('phone_number');
  if (
    !phone_number ||
    !phone_number.value ||
    typeof phone_number.value !== 'string'
  ) {
    return interaction.reply('Please input your phone_number.');
  }

  if (!validatePhoneForE164(phone_number.value)) {
    return interaction.reply('Invalid format. Ex. 3138884444');
  }
  const guild = db<Guild>('guild');

  try {
    await guild
      .where({
        guild_id: interaction.guild.id,
      })
      .insert({
        phone_number: phone_number.value,
      })
      .onConflict(['phone_number'])
      .merge({
        phone_number: phone_number.value,
      });
  } catch (err) {
    console.error(err);
    return interaction.reply(
      'An error occured while updating your phone number, please check your credentials.',
    );
  }

  return void interaction.reply(`Messages have been sent.`);
}
