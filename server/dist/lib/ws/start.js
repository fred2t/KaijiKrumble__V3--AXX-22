"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConnection = void 0;
const generalHelpers_1 = require("../utils/methods/generalHelpers");
function startConnection(ws) {
    /**
     * Things to do on intial connection.
     */
    // initialize my custom websocket members
    ws.id = (0, generalHelpers_1.simpleUUID)(10);
    ws.kaijiGame = {
        searchingForOpponent: false,
        roomId: null,
        opponentId: null,
    };
}
exports.startConnection = startConnection;
