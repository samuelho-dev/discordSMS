/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('guilds', (table) => {
    table.string('admin_id');
    table.string('hash_TWILIO_ACCOUNT_SID').unique();
    table.string('hash_TWILIO_AUTH_TOKEN').unique();
    table.string('hash_TWILIO_PHONE_NUMBER').unique();
    table.dateTime('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('guilds', (table) => {
    table.dropColumns([
      'admin_id',
      'hash_TWILIO_ACCOUNT_SID',
      'hash_TWILIO_AUTH_TOKEN',
      'hash_TWILIO_PHONE_NUMBER',
      'updated_at',
    ]);
  });
};
