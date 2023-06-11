export default function validatePhoneForE164(phoneNumber: string) {
  const regEx = /^\+[1-9]\d{10,14}$/;

  return regEx.test(phoneNumber);
}
