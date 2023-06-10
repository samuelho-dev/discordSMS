require('dotenv').config();
import express from 'express';
import { VerifyDiscordRequest } from './utils';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { db } from './knex';
import { REST, Routes } from 'discord.js';
const app = express();
const PORT = process.env.PORT || 3000;

// DATABASE
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);

// TWILIO
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const rest = new REST({ version: '10' }).setToken(
  process.env.DISCORD_APPLICATION_ID,
);

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
  const { type, id, data } = req.body;
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    if (name === 'createsms' && id) {
      const smsMessage = options[0].value;

      // Fetch all phone numbers from the database
      let phoneNumbers = await db('subscribers').select('phoneNumber');

      // Send an SMS to each phone number
      for (let subscriber of phoneNumbers) {
        twilioClient.messages
          .create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
            to: subscriber.phoneNumber, // your subscriber's phone number
          })
          .then((message) =>
            console.log(`Message sent to ${subscriber.phoneNumber}`),
          )
          .catch((error) =>
            console.error(
              `Failed to send SMS to ${subscriber.phoneNumber}: ${error.message}`,
            ),
          );
      }
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Done',
        },
      });
    }
  }
});

app.post('sms', async function (req, res) {
  const incomingNumber = req.body.From;
  const smsBody = req.body.Body;

  // If the SMS body is "STOP", you could look up the incoming phone number
  // in your Knex-managed database and remove it
  if (smsBody === 'STOP') {
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
