"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
// Lazy load config only at runtime, not during TypeScript compilation
let dbInstance = null;
function getDb() {
    if (!dbInstance) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const config = require('../../knexfile');
        const environment = process.env.NODE_ENV || 'development';
        const dbConfig = config[environment];
        dbInstance = (0, knex_1.default)(dbConfig);
    }
    return dbInstance;
}
// Use a proxy to lazily initialize the database
exports.db = new Proxy({}, {
    get: (target, prop) => {
        return getDb()[prop];
    }
});
exports.default = exports.db;
//# sourceMappingURL=connection.js.map