"use strict";
/**
 * Server and state management outside of index.ts to avoid circular importing.
 *
 * There will be methods to manage the rooms that index.ts may import in the
 * future.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kaijiController = exports.wss = exports.server = exports.application = void 0;
const KaijiController_1 = __importDefault(require("../classes/KaijiController"));
const application_1 = require("./application");
const server_1 = require("./server");
const webSocketServer_1 = require("./webSocketServer");
exports.application = (0, application_1.initializedApplication)();
exports.server = (0, server_1.initializedServer)({}, exports.application);
exports.wss = (0, webSocketServer_1.initializedWebSocketServer)({ server: exports.server });
// state
exports.kaijiController = new KaijiController_1.default({ rooms: [] });
