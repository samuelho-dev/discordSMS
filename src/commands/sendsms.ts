import {
  Client,
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { Member, Message } from 'knex/types/tables';
import db from '../db/knex';
import twilioClient from '../twilio';
import config from '../config';
import validatePhoneForE164 from '../utils/validateNumberE164';

export const data = new SlashCommandBuilder()
  .setName('sendsms')
  .setDescription('Send an SMS to your group.')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('Enter your message.')
      .setRequired(true)
      .setMaxLength(2000),
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

  const members = db<Member>('members');
  const messages = db<Message>('messages');

  // GET ALL PHONE NUMBERS
  const phoneNumbers = await members
    .where('guild_id', interaction.guild.id)
    .where('active', true)
    .select('phone_number');

  if (phoneNumbers.length === 0) {
    return void interaction.reply('There are no subscribers to this guild.');
  }

  // SEND MESSAGE TO NUMBERS - PUSH FAILED NUMBERS TO ARR
  const failedNumbers = [];

  const message = interaction.options.get('message')?.value;
  if (typeof message !== 'string') return;
  for (const number of phoneNumbers) {
    const E164Number = number.phone_number;
    const validatedNumber = validatePhoneForE164(E164Number);

    if (validatedNumber) {
      await twilioClient.messages
        .create({
          from: config.TWILIO_PHONE_NUMBER,
          to: E164Number,
          body: message,
        })
        .catch((err) => {
          console.error(err);
          void interaction.reply(
            `Error occured : ${JSON.stringify(err.message)}`,
          );
          failedNumbers.push(number);
        });
    } else {
      failedNumbers.push(number);
    }
  }

  // ADD THE MESSAGE TO DB
  try {
    await messages.insert({
      guild_id: interaction.guild.id,
      message: message,
    });
  } catch (err) {
    console.error(err);
    return void interaction.reply(
      `An error occured during message upload. ${
        failedNumbers.length !== 0
          ? `❌ Numbers that failed to send: ${JSON.stringify(failedNumbers)}`
          : '🧳'
      }`,
    );
  }

  // IF ALL NUMBERS FAILED TO SEND
  if (phoneNumbers.length === failedNumbers.length) {
    return void interaction.reply(
      `An error occured during message delivery. ${
        failedNumbers.length !== 0
          ? `❌ Numbers that failed to send: ${JSON.stringify(failedNumbers)}`
          : '🧳'
      }`,
    );
  }

  return void interaction.reply(
    `Messages have been sent. ${
      failedNumbers.length !== 0
        ? `❌ Numbers that failed to send: ${JSON.stringify(failedNumbers)}`
        : '🧳'
    }`,
  );
}
