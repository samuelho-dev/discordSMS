import './config';
import './discord/bot';
import express from 'express';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import db from './db/knex';
import { Member } from 'knex/types/tables';

const app = express();
const PORT = 3000;

app.post('/interactions', async function (req, res) {});

app.post('/sms', async function (req, res) {
  const incomingNumber = req.body.From;
  const members = db<Member>('members');

  if (!validatePhoneForE164(incomingNumber)) {
    return res.status(400).send('Number is not valid');
  }

  const twiml = new MessagingResponse();
  const smsBody = req.body.Body.toUpperCase();

  if (smsBody === 'SUBSCRIBE') {
    await members.insert({ phone_number: incomingNumber });
    twiml.message('You are now subscribed!');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } else if (smsBody === 'STOP') {
    twiml.message('You are now unsubscribed.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
