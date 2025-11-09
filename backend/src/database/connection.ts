import knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../knexfile');
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

console.log('Database Configuration:', {
  client: dbConfig.client,
  environment,
  hasConnectionString: !!process.env.DATABASE_URL
});

export const db: knex.Knex = knex(dbConfig);

// Test the connection
db.raw('SELECT NOW()').catch((error: any) => {
  console.error('Database connection error:', {
    message: error?.message,
    code: error?.code,
    errno: error?.errno
  });
});

export default db;






