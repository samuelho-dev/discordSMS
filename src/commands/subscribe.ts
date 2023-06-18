import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Guild, Member } from 'knex/types/tables';
import db from '../db/knex';
import validatePhoneForE164 from '../utils/validateNumberE164';
import twilioClient from '../twilio';
import config from '../config';

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
  if (!interaction.guild || !interaction.guild.id) return;

  // MEMBER MUST BE AN ADMIN
  const member = interaction.member as GuildMember;
  if (!member.permissions.has('Administrator')) {
    return interaction.reply(
      'You do not have the required permissions to use this command. ❌',
    );
  }

  const guilds = db<Guild>('guilds');

  const guild = await guilds.where({ guild_id: interaction.guild.id });

  if (!guild || guild.length === 0 || !guild[0] || !guild[0].tagline) {
    return void interaction.reply(
      'Guild is not registered. Please run the /register command. ❌ ',
    );
  }

  // VALIDATE PHONE NUMBER
  const num = interaction.options.get('phone_number');
  if (!num) {
    return void interaction.reply('Please input the twilio phone number.');
  }

  const number = num.value;
  const E164Number = `+1${number}`;
  if (typeof number !== 'string') return;
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

  try {
    await twilioClient.messages.create({
      from: config.TWILIO_PHONE_NUMBER,
      to: E164Number,
      body: guild[0].tagline,
    });
  } catch (err) {
    console.error(err);
    return void interaction.reply(
      'An error occured during message delivery. ❌',
    );
  }

  return void interaction.reply('The number is now subscribed! 📬');
}
