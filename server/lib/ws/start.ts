import WebSocket from "ws";

import { simpleUUID } from "../utils/methods/generalHelpers";

function startConnection(ws: WebSocket.WebSocket) {
    /**
     * Things to do on intial connection.
     */

    // initialize my custom websocket members
    ws.id = simpleUUID(10);
    ws.kaijiGame = {
        searchingForOpponent: false,
        roomId: null,
        opponentId: null,
    };
}

export { startConnection };
