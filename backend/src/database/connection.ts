import knex from 'knex';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

export const db = knex(dbConfig);

export default db;






