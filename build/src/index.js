"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./discord/bot");
const express_1 = __importDefault(require("express"));
const MessagingResponse_1 = __importDefault(require("twilio/lib/twiml/MessagingResponse"));
const knex_1 = __importDefault(require("./db/knex"));
const validateNumberE164_1 = __importDefault(require("./utils/validateNumberE164"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.post('/sms', async function (req, res) {
    const incomingNumber = req.body.From;
    const members = (0, knex_1.default)('members');
    if (!(0, validateNumberE164_1.default)(incomingNumber)) {
        return res.status(400).send('Number is not valid');
    }
    const twiml = new MessagingResponse_1.default();
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
app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
