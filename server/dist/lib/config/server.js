"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializedServer = void 0;
const http_1 = __importDefault(require("http"));
function initializedServer(options, application) {
    const httpServer = http_1.default.createServer(options, application);
    return httpServer;
}
exports.initializedServer = initializedServer;
