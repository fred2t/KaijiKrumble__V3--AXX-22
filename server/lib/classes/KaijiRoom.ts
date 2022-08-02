import WebSocket from "ws";

import { appConsoleLog } from "../../.app/serverInstances";
import { WS } from "../utils/namespaces";
import { appWSSend } from "../utils/namespaces/WS";

import AppRoom from "./abstract/AppRoom";

class KaijiRoom extends AppRoom<WebSocket.WebSocket> {
    public friendOnly: boolean;

    constructor({
        users,
        openToJoin,
        friendOnly,
    }: {
        users: WebSocket.WebSocket[];
        openToJoin: boolean;
        friendOnly: boolean;
    }) {
        super({ users, openToJoin });
        this.friendOnly = friendOnly;
    }

    notifyUserQuitGame(leaverId: string): void {
        this.users.forEach((userSocket) => {
            if (userSocket.readyState !== WebSocket.OPEN) return appConsoleLog("not ready");
            if (userSocket.id === leaverId) return;

            appWSSend<null>(userSocket, WS.EventNames.EndOpponentQuitGame, null);
        });
    }

    getUser(id: string): WebSocket.WebSocket | undefined {
        return this.users.find((user) => user.id === id);
    }

    addUser(user: WebSocket.WebSocket): void {
        this.users.push(user);
    }

    closeToNewcomers(): void {
        this.openToJoin = false;
    }

    removeUser(socket: WebSocket.WebSocket): void {
        if (!socket.kaijiGame.roomId) return appConsoleLog("is not in game");

        this.users = this.users.filter((userSocket) => userSocket.id !== socket.id);
    }
}

export default KaijiRoom;
