import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Member } from 'knex/types/tables';
import db from '../db/knex';

export const data = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('Subscribe to the text messaging list.')
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
  const number = interaction.options.get('phone_number')?.value;
  if (typeof number !== 'string') return;
  if (!interaction.guild || !interaction.guild.id) return;

  // VALIDATE PHONE NUMBER
  const validatedNumber = validatePhoneForE164(number);
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
        phone_number: number,
      })
      .update({
        active: false,
        updated_at: new Date(),
      });
  } catch (err) {
    console.error(err);
    return void interaction.reply(
      'An error occured during unsubscribing, try again in a second.',
    );
  }

  return void interaction.reply('You are now unsubscribed. 📬');
}
