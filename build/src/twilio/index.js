"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const twilio_1 = require("twilio");
const accountSid = config_1.default.TWILIO_ACCOUNT_SID;
const authToken = config_1.default.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio_1.Twilio(accountSid, authToken);
exports.default = twilioClient;
