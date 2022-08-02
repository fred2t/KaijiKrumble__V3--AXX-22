import WebSocket from "ws";

import { appConsoleLog } from "../../.app/serverInstances";
import { kaijiController } from "../config/serverRoom";

export function quitGame(playerSocket: WebSocket.WebSocket) {
    if (playerSocket.kaijiGame.roomId == null) return appConsoleLog("User is not in a room.");

    const room = kaijiController.getRoom(playerSocket.kaijiGame.roomId);
    if (room == null) return appConsoleLog("Room does not exist.");

    room.notifyUserQuitGame(playerSocket.id);
}

export function leaveGame(playerSocket: WebSocket.WebSocket) {
    if (playerSocket.kaijiGame.roomId === null) return appConsoleLog("leaveGame: not in game");

    kaijiController.removeUser(playerSocket);
}
