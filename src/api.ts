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

// EXAMPLE ERROR OBJECT

// const ErrorObj = {
// ﻿ParentAccountSid: '',
// ﻿Payload: '{"resource_sid":"SMf14f53d739369e083ca0527f2cab37f4","service_sid":"SMf14f53d739369e083ca0527f2cab37f4","error_code":"11200","more_info":{"Msg":"Bad Gateway","sourceComponent":"14100","ErrorCode":"11200","EmailNotification":"false","httpResponse":"502","LogLevel":"ERROR","url":"https://discordsms.up.railway.app/sms";},"webhook":{"type":"application/json","request":{"url":"https://discordsms.up.railway.app/sms","method":"POST","headers";:{},"parameters":{"ApiVersion":"2010-04-01","SmsSid":"SMf14f53d739369e083ca0527f2cab37f4","SmsStatus":"received","SmsMessageSid":"SMf14f53d739369e083ca0527f2cab37f4","NumSegments":"1","From":"+16262837110","ToState":"","MessageSid":"SMf14f53d739369e083ca0527f2cab37f4","AccountSid":"ACa4d7494bb9cba8effc4aa12d021b6fa4","ToZip":"","FromCountry":"US","ToCity":"","FromCity":"ALHAMBRA","To":"+18777193978","FromZip":"91803","Body":"Stop","ToCountry":"US","FromState":"CA","NumMedia":"0"}},"response":{"status_code":null,"headers":{"content-length":"430","X-Twilio-WebhookError":"11203 HTTP communication total time out triggered","X-Twilio-WebhookAttempt":"1","connection":"close","content-type":"text/html"},"body":"Twilio was unable to fetch content from: http://discordsms.up.railway.app/sms\\nError: Total timeout is triggered. Configured tt is 15000ms and we attempted 1 time(s)\\nAccount SID: ACa4d7494bb9cba8effc4aa12d021b6fa4\\nSID: SMf14f53d739369e083ca0527f2cab37f4\\nRequest ID: 33412e1f-e611-4704-ae04-74d6eb77b844\\nRemote Host: discordsms.up.railway.app\\nRequest Method: POST\\nRequest URI: http://discordsms.up.railway.app/sms\\nURL Fragment: true"}}}',
// ﻿Level: 'ERROR',
// ﻿Timestamp: '2023-06-12T18:44:24.368Z',
// ﻿PayloadType: 'application/json',
// ﻿AccountSid: 'ACa4d7494bb9cba8effc4aa12d021b6fa4',
// ﻿Sid: 'NO42c4762959e63d990f1ec746b8d6a67e'
// ﻿}
