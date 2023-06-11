import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Member } from 'knex/types/tables';
import db from '../knex';
import twilioClient from '../twilio';
import config from '../config';

export const data = new SlashCommandBuilder()
  .setName('sendsms')
  .setDescription('Send a SMS to a group.')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('Enter your message.')
      .setRequired(true)
      .setMaxLength(2000),
  );

export async function execute(interaction: CommandInteraction, client: Client) {
  const member = interaction.member as GuildMember;

  if (!member.permissions.has('Administrator')) {
    return interaction.reply(
      'You do not have the required permissions to use this command.',
    );
  }
  const members = db<Member>('members');
  const phoneNumbers = await members
    .where('guild_id', interaction.guild?.id)
    .where('active', true)
    .select('phone_number');

  for (const number of phoneNumbers) {
    const validatedNumber = validatePhoneForE164(`+1${number}`);

    if (validatedNumber) {
      twilioClient.messages.create({
        from: config.TWILIO_PHONE_NUMBER,
        to: `+1${number}`,
      });
    }
  }
  return void interaction.reply('Pong!');
}
