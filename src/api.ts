import express from 'express';
import slowDown from 'express-slow-down';
import { Client } from 'discord.js';
import { Member } from 'knex/types/tables';
import validatePhoneForE164 from './utils/validateNumberE164';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import db from './db/knex';

export function createRestApi(client: Client) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // SLOW DOWN IMPLEMENT
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100
  });
  app.use(speedLimiter);

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
      // IF ALREADY A MEMBER THEN EXIT
      const existingMember = await members.where({
        phone_number: incomingNumber,
      });
      if (existingMember.length !== 0) res.end();

      await members.insert({
        guild_id: `1105562164602880021`,
        phone_number: incomingNumber,
      });

      twiml.message(
        'You are now subscribed to Hi-Pass events! 🌊 to opt out, reply "STOP" ',
      );
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    }
  });

  app.post('/smsStatus', async function (req, res) {
    const { Payload } = req.body;
    const data = JSON.parse(Payload);
    // Change member to inactive from Stop word
    // https://static1.twilio.com/docs/api/errors/80901
    console.log({ data });
    if (data.error_code === '80901') {
      const member = db<Member>('members');
      try {
        await member.where({ phone_number: data.From }).update({
          active: false,
        });
      } catch (err) {
        console.error(err);
      }
      res.sendStatus(200);
    }
  });
  return app;
}
