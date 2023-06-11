import config from '../config';
import { Twilio } from 'twilio';

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const twilioClient = new Twilio(accountSid, authToken);

export default twilioClient;
