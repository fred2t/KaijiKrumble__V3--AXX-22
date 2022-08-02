"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const serverEnvironmentVariables_1 = require("../../.app/serverEnvironmentVariables");
const DBPool = promise_1.default.createPool(Object.assign(Object.assign({}, serverEnvironmentVariables_1.ENVS.DB_CONFIG), { namedPlaceholders: true }));
exports.DBPool = DBPool;
DBPool.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        
        PRIMARY KEY (id)
    );
`);
DBPool.execute(`
    CREATE TABLE IF NOT EXISTS past_opponent_reactions (
        id INT NOT NULL AUTO_INCREMENT,
        reaction VARCHAR(80),
        
        PRIMARY KEY (id)
    );
`);
