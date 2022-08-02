"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const serverInstances_1 = require("../../.app/serverInstances");
const namespaces_1 = require("../utils/namespaces");
class KaijiController {
    constructor({ rooms }) {
        this.rooms = rooms;
    }
    testingGet() {
        (0, serverInstances_1.appConsoleLog)(this.rooms);
    }
    broadcast(data) {
        /**
         * Broadcast to all users of each room.
         * This is different from a broadcast to all users connected
         * to the web socket server since this will only target
         * those in the vicinity of the kaiji game.
         */
        this.rooms.forEach((room) => {
            room.users.forEach((userSocket) => {
                if (userSocket.readyState !== ws_1.default.OPEN)
                    return;
                userSocket.send(data);
            });
        });
    }
    getOpenToJoinRoom() {
        /**
         * Gets the first room that is open to join.
         */
        return this.rooms.find((room) => room.openToJoin);
    }
    getRoom(roomId) {
        return this.rooms.find((room) => room.id === roomId);
    }
    addRoom(room) {
        this.rooms.push(room);
    }
    getUser(socketUserData) {
        /**
         * Get the user from the room. Also adds guards in case the client
         * edits source code and sends invalid data. Doing it here will
         * mean I don't have to do it every time I need the user's opponent
         * socket.
         *
         * @NOTE This method hopes the user is in a game playing an opponent.
         *
         * @param socketUserData
         * @returns {Kaiji.User | undefined}
         * @memberof KaijiController
         * @private
         */
        if (socketUserData.roomId == null)
            return (0, serverInstances_1.appConsoleLog)("not in room");
        const room = this.getRoom(socketUserData.roomId);
        if (room == undefined)
            return (0, serverInstances_1.appConsoleLog)("room not found");
        if (socketUserData.opponentId == null)
            return (0, serverInstances_1.appConsoleLog)("opponent id not found");
        return room.getUser(socketUserData.opponentId);
    }
    removeUser(socket) {
        /**
         * Remove a user from the room they're in and message all
         * other users in the room that the user has left.
         *
         *  Will also remove the room since the game cannot go on.
         */
        if (socket.kaijiGame.roomId === null)
            return (0, serverInstances_1.appConsoleLog)("control removeUser: not in game");
        this.rooms = this.rooms.filter((room) => {
            // keep the room if it doesn't have the user that disconnected
            if (room.id !== socket.kaijiGame.roomId)
                return true;
            room.removeUser(socket);
            const defaultWSKaiji = {
                inRoom: false,
                opponentId: null,
                roomId: null,
                searchingForOpponent: false,
            };
            socket.kaijiGame = Object.assign({}, defaultWSKaiji);
            // tell all room members of a player leaving
            room.users.forEach((participantSocket) => {
                if (participantSocket.readyState !== ws_1.default.OPEN)
                    return (0, serverInstances_1.appConsoleLog)("person socket not open");
                participantSocket.kaijiGame = Object.assign({}, defaultWSKaiji);
                namespaces_1.WS.appWSSend(participantSocket, namespaces_1.WS.EventNames.EndOpponentLeaveRoom, null);
            });
            // remove the room since a player left
            return false;
        });
    }
}
exports.default = KaijiController;
