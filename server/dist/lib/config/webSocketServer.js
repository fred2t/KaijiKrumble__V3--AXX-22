"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializedWebSocketServer = void 0;
const ws_1 = __importDefault(require("ws"));
const namespaces_1 = require("../utils/namespaces");
const generalHelpers_1 = require("../utils/methods/generalHelpers");
const play_1 = require("../ws/play");
const start_1 = require("../ws/start");
const end_1 = require("../ws/end");
const serverInstances_1 = require("../../.app/serverInstances");
const serverRoom_1 = require("./serverRoom");
function initializedWebSocketServer(options, callback) {
    const wss = new ws_1.default.Server(options, callback);
    wss.on("connection", (ws) => __awaiter(this, void 0, void 0, function* () {
        console.log("connected");
        (0, start_1.startConnection)(ws);
        ws.onmessage = function (event) {
            // prettier-ignore
            const socketRequest = (0, generalHelpers_1.JSONParsedOrReturn)(event.data.toString());
            // prettier-ignore
            if (typeof socketRequest === "string")
                return (0, serverInstances_1.appConsoleLog)(socketRequest);
            // prettier-ignore
            if (socketRequest.type === "test")
                ws.send(JSON.stringify({ type: "testR" }));
            // prettier-ignore
            const { eventType, eventData } = socketRequest;
            (0, serverInstances_1.appConsoleLog)(socketRequest);
            switch (eventType) {
                case namespaces_1.WS.EventNames.PlayStartGame:
                    (0, play_1.startGame)(ws);
                    break;
                case namespaces_1.WS.EventNames.PlayGetPrivateRoom:
                    // remove them if they're already in a room
                    if (ws.kaijiGame.roomId !== null)
                        (0, end_1.leaveGame)(ws);
                    (0, play_1.getPrivateRoom)(ws);
                    break;
                case namespaces_1.WS.EventNames.PlayJoinPrivateRoom:
                    (0, play_1.joinPrivateRoom)(ws, eventData);
                    break;
                case namespaces_1.WS.EventNames.PlayMakeMove:
                    (0, play_1.makeMove)(ws, eventData);
                    break;
                case namespaces_1.WS.EventNames.PlaySendEmote:
                    (0, play_1.sendEmote)(ws, eventData);
                    break;
                case namespaces_1.WS.EventNames.PlaySendMessage:
                    (0, play_1.sendMessage)(ws, eventData);
                    break;
                case namespaces_1.WS.EventNames.EndQuitGame:
                    (0, end_1.quitGame)(ws);
                    break;
                case namespaces_1.WS.EventNames.EndLeaveRoom:
                    (0, end_1.leaveGame)(ws);
                    break;
                // debugger;
                case "ShowSock":
                    // console.log(ws.id, ws.kaijiGame);
                    serverRoom_1.kaijiController.testingGet();
                    break;
                default:
                    console.log(`unknown event type ${eventType}`);
            }
        };
        ws.onclose = function () {
            (0, end_1.leaveGame)(ws);
        };
    }));
    return wss;
}
exports.initializedWebSocketServer = initializedWebSocketServer;
