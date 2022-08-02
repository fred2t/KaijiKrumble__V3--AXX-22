"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalBroadcast = exports.appWSSend = exports.EventNames = void 0;
const ws_1 = __importDefault(require("ws"));
const generalHelpers_1 = require("../methods/generalHelpers");
var EventNames;
(function (EventNames) {
    EventNames["PlayStartGame"] = "/ws/play/start-game";
    EventNames["PlayGetPrivateRoom"] = "/ws/play/request-private-room";
    EventNames["PlayJoinPrivateRoom"] = "/ws/play/private-room-status";
    EventNames["PlayMakeMove"] = "/ws/play/make-move";
    EventNames["PlayGetOpponentMove"] = "/ws/play/receive-opponent-move";
    EventNames["PlaySendEmote"] = "/ws/play/send-emote";
    EventNames["PlayGetOpponentEmote"] = "/ws/play/see-emote";
    EventNames["PlaySendMessage"] = "/ws/chat/send-message";
    EventNames["PlayGetOpponentMessage"] = "/ws/chat/receive-message";
    EventNames["EndQuitGame"] = "/ws/end/quit-game";
    EventNames["EndOpponentQuitGame"] = "/ws/end/opponent-quit-game";
    EventNames["EndLeaveRoom"] = "/ws/end/leave-game";
    EventNames["EndOpponentLeaveRoom"] = "/ws/end/opponent-left-game";
})(EventNames = exports.EventNames || (exports.EventNames = {}));
// helper methods
function appWSSend(socket, eventType, eventData) {
    socket === null || socket === void 0 ? void 0 : socket.send((0, generalHelpers_1.appJSONStringify)({ eventType, eventData }));
}
exports.appWSSend = appWSSend;
function globalBroadcast(wss, data) {
    wss.clients.forEach((client) => {
        if (client.readyState !== ws_1.default.OPEN)
            return;
        client.send(data);
    });
}
exports.globalBroadcast = globalBroadcast;
