import { Client } from 'discord.js';
import express from 'express';
import { Member } from 'knex/types/tables';
import validatePhoneForE164 from './utils/validateNumberE164';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import db from './db/knex';

export function createRestApi(client: Client) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post('/sms', async function (req, res) {
    const incomingNumber = req.body.From;
    const members = db<Member>('members');

    if (!validatePhoneForE164(incomingNumber)) {
      return res.status(400).send('Number is not valid');
    }

    const twiml = new MessagingResponse();
    const smsBody = req.body.Body.toUpperCase();

    // SUBSCRIBE TO LA BEATMAKERS
    if (smsBody === 'BEATS') {
      await members.insert({
        guild_id: `1105562164602880021`,
        phone_number: incomingNumber,
      });

      twiml.message('You are now subscribed! 🎸');
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    }

    // UNSUBSCRIBE
    if (smsBody === 'STOP') {
      await members
        .where({ phone_number: incomingNumber })
        .update({ active: true, updated_at: new Date() });
      twiml.message('You are now unsubscribed. 😔');
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    }
  });

  return app;
}
