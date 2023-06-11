import './discord/bot';

// import express from 'express';
// import db from './knex';
// import config from './config';

// const app = express();
// const PORT = 3000;

// app.post('/interactions', async function (req, res) {
//   const { type, id, data } = req.body;

//   const { name, options } = data;

//   if (name === 'createsms' && id) {
//     const smsMessage = options[0].value;

//     // Fetch all phone numbers from the database
//     let phoneNumbers = await db('subscribers').select('phoneNumber');

//     // Send an SMS to each phone number
//     for (let subscriber of phoneNumbers) {
//       twilioClient.messages
//         .create({
//           body: smsMessage,
//           from: config.TWILIO_PHONE_NUMBER,
//           to: subscriber.phoneNumber,
//         })
//         .then((message) =>
//           console.log(`Message sent to ${subscriber.phoneNumber}`),
//         )
//         .catch((err) =>
//           console.error(
//             `Failed to send SMS to ${subscriber.phoneNumber}: ${err.message}`,
//           ),
//         );
//     }
//     return res.send({
//       type: '',
//       data: {
//         content: 'Done',
//       },
//     });
//   }
// });

// app.post('subscribe', async function (req, res) {
//   const incomingNumber = req.body.From;
//   const smsBody = req.body.Body;

//   if (smsBody === 'SUBSCRIBE') {
//   }
// });

// app.post('unsubscribe', async function (req, res) {
//   const incomingNumber = req.body.From;
//   const smsBody = req.body.Body;

//   if (smsBody === 'STOP') {
//   }
// });

// app.listen(PORT, () => {
//   console.log('Listening on port', PORT);
// });
