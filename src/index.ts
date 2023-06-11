require('dotenv').config();
import express from 'express';

import { GatewayIntentBits, REST, Routes, WebSocketManager } from 'discord.js';
import db from './knex';

const app = express();
const PORT = process.env.PORT || 3000;

// TWILIO
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const rest = new REST({ version: '10' }).setToken(
  process.env.DISCORD_APPLICATION_ID,
);

app.post('/interactions', async function (req, res) {
  const { type, id, data } = req.body;

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
          from: process.env.TWILIO_PHONE_NUMBER,
          to: subscriber.phoneNumber,
        })
        .then((message) =>
          console.log(`Message sent to ${subscriber.phoneNumber}`),
        )
        .catch((err) =>
          console.error(
            `Failed to send SMS to ${subscriber.phoneNumber}: ${err.message}`,
          ),
        );
    }
    return res.send({
      type: '',
      data: {
        content: 'Done',
      },
    });
  }
});

app.post('subscribe', async function (req, res) {
  const incomingNumber = req.body.From;
  const smsBody = req.body.Body;

  if (smsBody === 'SUBSCRIBE') {
  }
});

app.post('unsubscribe', async function (req, res) {
  const incomingNumber = req.body.From;
  const smsBody = req.body.Body;

  if (smsBody === 'STOP') {
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
