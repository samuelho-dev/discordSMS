import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Guild, Member } from 'knex/types/tables';
import db from '../db/knex';
import validatePhoneForE164 from '../utils/validateNumberE164';

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
  const E164Number = `+1${number}`;
  if (typeof number !== 'string') return;
  if (!interaction.guild || !interaction.guild.id) return;

  const guilds = db<Guild>('guilds');

  // ALLOWED GUILDS ONLY
  try {
    const data = await guilds.where({ guild_id: interaction.guild.id });
    if (data.length === 0) {
      throw new Error('Guild not registered. ❌');
    }
  } catch (err) {
    console.error(err);
    return void interaction.reply('Guild is not registered. ❌');
  }

  // VALIDATE PHONE NUMBER
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
      .insert({
        guild_id: interaction.guild.id,
        phone_number: E164Number,
        active: true,
      })
      .onConflict(['guild_id', 'phone_number'])
      .merge({ active: true });
  } catch (err) {
    console.error(err);
    return void interaction.reply('An error occured during insert. ❌');
  }

  return void interaction.reply('You are now subscribed! 📬');
}
