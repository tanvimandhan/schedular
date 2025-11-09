"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../knexfile');
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];
console.log('Database Configuration:', {
    client: dbConfig.client,
    environment,
    hasConnectionString: !!process.env.DATABASE_URL
});
exports.db = (0, knex_1.default)(dbConfig);
// Test the connection
exports.db.raw('SELECT NOW()').catch((error) => {
    console.error('Database connection error:', {
        message: error?.message,
        code: error?.code,
        errno: error?.errno
    });
});
exports.default = exports.db;
//# sourceMappingURL=connection.js.map