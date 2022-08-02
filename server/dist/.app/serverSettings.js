"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_SETTINGS = exports.SERVER_BUILD_ENVIRONMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const enums_1 = require("../lib/utils/enums");
dotenv_1.default.config();
const { SERVER_BUILD_ENVIRONMENT } = process.env;
exports.SERVER_BUILD_ENVIRONMENT = SERVER_BUILD_ENVIRONMENT;
// check if environment is valid
if (Object.values(enums_1.NodeEnvironments).includes(SERVER_BUILD_ENVIRONMENT) === false) {
    throw new Error(`Invalid environment type: ${SERVER_BUILD_ENVIRONMENT}`);
}
exports.CORS_SETTINGS = { origin: "http://localhost:3000" };
