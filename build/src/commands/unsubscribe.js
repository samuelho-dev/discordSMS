"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const knex_1 = __importDefault(require("../db/knex"));
const validateNumberE164_1 = __importDefault(require("../utils/validateNumberE164"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('unsubscribe')
    .setDescription('Unsubscribe from the SMS messaging list.')
    .addStringOption((option) => option
    .setName('phone_number')
    .setDescription('Enter your phone number with the area code and no spaces. Ex.8183334200')
    .setRequired(true)
    .setMaxLength(10));
async function execute(interaction, client) {
    var _a;
    const number = (_a = interaction.options.get('phone_number')) === null || _a === void 0 ? void 0 : _a.value;
    if (typeof number !== 'string')
        return;
    if (!interaction.guild || !interaction.guild.id)
        return;
    const E164Number = `+1${number}`;
    // VALIDATE PHONE NUMBER
    const validatedNumber = (0, validateNumberE164_1.default)(E164Number);
    if (!validatedNumber) {
        return void interaction.reply('Number is not in valid format (10 digits with area code, no spaces). Ex.8183334200');
    }
    const members = (0, knex_1.default)('members');
    // INSERT INTO DB
    try {
        await members
            .where({
            guild_id: interaction.guild.id,
            phone_number: E164Number,
        })
            .update({
            active: false,
            updated_at: new Date(),
        });
    }
    catch (err) {
        console.error(err);
        return void interaction.reply('An error occured during unsubscribing, try again in a second. ❌');
    }
    return void interaction.reply('You are now unsubscribed. 👋');
}
exports.execute = execute;
