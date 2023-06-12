"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const knex_1 = __importDefault(require("../db/knex"));
const twilio_1 = __importDefault(require("../twilio"));
const config_1 = __importDefault(require("../config"));
const validateNumberE164_1 = __importDefault(require("../utils/validateNumberE164"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('sendsms')
    .setDescription('Send an SMS to your group.')
    .addStringOption((option) => option
    .setName('message')
    .setDescription('Enter your message.')
    .setRequired(true)
    .setMaxLength(2000));
async function execute(interaction, client) {
    var _a;
    const member = interaction.member;
    // IF THE MESSAGE ISNT A STRING
    const message = (_a = interaction.options.get('message')) === null || _a === void 0 ? void 0 : _a.value;
    if (typeof message !== 'string')
        return;
    if (!interaction.guild || !interaction.guild.id)
        return;
    // MEMBER MUST BE AN ADMIN
    if (!member.permissions.has('Administrator')) {
        return interaction.reply('You do not have the required permissions to use this command.');
    }
    const members = (0, knex_1.default)('members');
    const messages = (0, knex_1.default)('messages');
    // GET ALL PHONE NUMBERS
    const phoneNumbers = await members
        .where('guild_id', interaction.guild.id)
        .where('active', true)
        .select('phone_number');
    if (phoneNumbers.length === 0) {
        return void interaction.reply('There are no subscribers to this guild.');
    }
    const failedNumbers = [];
    // SEND MESSAGE TO NUMBERS - PUSH FAILED NUMBERS TO ARR
    for (const number of phoneNumbers) {
        const E164Number = number.phone_number;
        const validatedNumber = (0, validateNumberE164_1.default)(E164Number);
        if (validatedNumber) {
            await twilio_1.default.messages
                .create({
                from: config_1.default.TWILIO_PHONE_NUMBER,
                to: E164Number,
                body: message,
            })
                .catch((err) => {
                console.error(err);
                failedNumbers.push(number);
            });
        }
        else {
            failedNumbers.push(number);
        }
    }
    // ADD THE MESSAGE TO DB
    try {
        await messages.insert({
            guild_id: interaction.guild.id,
            message: message,
        });
    }
    catch (err) {
        console.error(err);
        return void interaction.reply(`An error occured during message upload. ${failedNumbers.length !== 0
            ? `❌ Numbers that failed to send: ${JSON.stringify(failedNumbers)}`
            : '🧳'}`);
    }
    // IF ALL NUMBERS FAILED TO SEND
    if (phoneNumbers.length === failedNumbers.length) {
        return void interaction.reply(`An error occured during message delivery. ${failedNumbers.length !== 0
            ? `❌ Numbers that failed to send: ${JSON.stringify(failedNumbers)}`
            : '🧳'}`);
    }
    return void interaction.reply(`Messages have been sent. ${failedNumbers.length !== 0
        ? `❌ Numbers that failed to send: ${JSON.stringify(failedNumbers)}`
        : '🧳'}`);
}
exports.execute = execute;
