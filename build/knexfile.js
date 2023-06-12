"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
// Update with your config settings.
const config = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
    },
    staging: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
module.exports = config;
