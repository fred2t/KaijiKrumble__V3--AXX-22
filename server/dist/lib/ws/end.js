"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveGame = exports.quitGame = void 0;
const serverInstances_1 = require("../../.app/serverInstances");
const serverRoom_1 = require("../config/serverRoom");
function quitGame(playerSocket) {
    if (playerSocket.kaijiGame.roomId == null)
        return (0, serverInstances_1.appConsoleLog)("User is not in a room.");
    const room = serverRoom_1.kaijiController.getRoom(playerSocket.kaijiGame.roomId);
    if (room == null)
        return (0, serverInstances_1.appConsoleLog)("Room does not exist.");
    room.notifyUserQuitGame(playerSocket.id);
}
exports.quitGame = quitGame;
function leaveGame(playerSocket) {
    if (playerSocket.kaijiGame.roomId === null)
        return (0, serverInstances_1.appConsoleLog)("leaveGame: not in game");
    serverRoom_1.kaijiController.removeUser(playerSocket);
}
exports.leaveGame = leaveGame;
