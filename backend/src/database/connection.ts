import knex from 'knex';

// Lazy load config only at runtime, not during TypeScript compilation
let dbInstance: knex.Knex | null = null;

function getDb(): knex.Knex {
  if (!dbInstance) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require('../../knexfile');
    const environment = process.env.NODE_ENV || 'development';
    const dbConfig = config[environment as keyof typeof config];
    dbInstance = knex(dbConfig);
  }
  return dbInstance;
}

// Use a proxy to lazily initialize the database
export const db = new Proxy({} as knex.Knex, {
  get: (target, prop) => {
    return getDb()[prop as keyof knex.Knex];
  }
});

export default db;






