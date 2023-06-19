import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Member } from 'knex/types/tables';
import db from '../db/knex';
import validatePhoneForE164 from '../utils/validateNumberE164';

export const data = new SlashCommandBuilder()
  .setName('unsubscribe')
  .setDescription('Unsubscribe from the SMS messaging list.')
  .addStringOption((option) =>
    option
      .setName('phone_number')
      .setDescription(
        'Enter your phone number with the area code and no spaces. Ex.8183334200',
      )
      .setRequired(true)
      .setMaxLength(10),
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.guild || !interaction.guild.id) return;

  // VALIDATE PHONE NUMBER
  const number = interaction.options.get('phone_number')?.value;
  if (typeof number !== 'string') return;
  const E164Number = `+1${number}`;
  const validatedNumber = validatePhoneForE164(E164Number);
  if (!validatedNumber) {
    return void interaction.reply(
      'Number is not in valid format (10 digits with area code, no spaces). Ex.8183334200',
    );
  }

  const members = db<Member>('members');

  // INSERT INTO DB
  try {
    await members
      .where({
        guild_id: interaction.guild.id,
        phone_number: E164Number,
      })
      .update({
        active: false,
        updated_at: new Date(),
      });
  } catch (err) {
    console.error(err);
    return void interaction.reply(
      'An error occured during unsubscribing, try again in a second. ❌',
    );
  }

  return void interaction.reply('You are now unsubscribed. 👋');
}
