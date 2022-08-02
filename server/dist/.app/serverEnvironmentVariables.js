"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const serverDebugging_1 = require("../lib/serverDebugging");
dotenv_1.default.config();
const { PORT, CLIENT_URL, } = process.env;
const ENVS = {
    // Number(PORT) -> P or 0 -> P: P, 0: 3001, where P=port
    PORT: Number(PORT) || 3001,
    CLIENT_URL: CLIENT_URL,
};
exports.ENVS = ENVS;
(0, serverDebugging_1.notValueNestedCheck)(ENVS, undefined);
