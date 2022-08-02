import WebSocket from "ws";

import { appConsoleLog } from "../../.app/serverInstances";
import { Kaiji, WS } from "../utils/namespaces";

import KaijiRoom from "./KaijiRoom";

class KaijiController {
    /**
     * Adds methods of the web socket server to this specific
     * game genre.
     */
    private rooms: KaijiRoom[];

    constructor({ rooms }: { rooms: KaijiRoom[] }) {
        this.rooms = rooms;
    }

    testingGet(): void {
        appConsoleLog(this.rooms);
    }

    broadcast(data: string): void {
        /**
         * Broadcast to all users of each room.
         * This is different from a broadcast to all users connected
         * to the web socket server since this will only target
         * those in the vicinity of the kaiji game.
         */

        this.rooms.forEach((room) => {
            room.users.forEach((userSocket) => {
                if (userSocket.readyState !== WebSocket.OPEN) return;

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

    getRoom(roomId: string): KaijiRoom | undefined {
        return this.rooms.find((room) => room.id === roomId);
    }

    addRoom(room: KaijiRoom): void {
        this.rooms.push(room);
    }

    getUser(socketUserData: Kaiji.SocketUserData) {
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

        if (socketUserData.roomId == null) return appConsoleLog("not in room");
        const room = this.getRoom(socketUserData.roomId);

        if (room == undefined) return appConsoleLog("room not found");
        if (socketUserData.opponentId == null) return appConsoleLog("opponent id not found");
        return room.getUser(socketUserData.opponentId);
    }

    removeUser(socket: WebSocket.WebSocket): void {
        /**
         * Remove a user from the room they're in and message all
         * other users in the room that the user has left.
         *
         *  Will also remove the room since the game cannot go on.
         */

        if (socket.kaijiGame.roomId === null)
            return appConsoleLog("control removeUser: not in game");

        this.rooms = this.rooms.filter((room) => {
            // keep the room if it doesn't have the user that disconnected
            if (room.id !== socket.kaijiGame.roomId) return true;

            room.removeUser(socket);
            const defaultWSKaiji = {
                inRoom: false,
                opponentId: null,
                roomId: null,
                searchingForOpponent: false,
            };
            socket.kaijiGame = { ...defaultWSKaiji };

            // tell all room members of a player leaving
            room.users.forEach((participantSocket) => {
                if (participantSocket.readyState !== WebSocket.OPEN)
                    return appConsoleLog("person socket not open");

                participantSocket.kaijiGame = { ...defaultWSKaiji };
                WS.appWSSend<null>(participantSocket, WS.EventNames.EndOpponentLeaveRoom, null);
            });

            // remove the room since a player left
            return false;
        });
    }
}

export default KaijiController;
