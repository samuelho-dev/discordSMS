"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validatePhoneForE164(phoneNumber) {
    const regEx = /^\+[1-9]\d{10,14}$/;
    return regEx.test(phoneNumber);
}
exports.default = validatePhoneForE164;
