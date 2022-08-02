"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.sendEmote = exports.makeMove = exports.joinPrivateRoom = exports.getPrivateRoom = exports.startGame = void 0;
const KaijiRoom_1 = __importDefault(require("../classes/KaijiRoom"));
const namespaces_1 = require("../utils/namespaces");
const generalHelpers_1 = require("../utils/methods/generalHelpers");
const serverRoom_1 = require("../config/serverRoom");
const serverInstances_1 = require("../../.app/serverInstances");
function _setupGame(playerSocket, opponentSocket, roomId) {
    /**
     * Helper function used after the room is created (by parent functions) to
     * create the initial variables and notify both players of the game.
     */
    // update player details for use later
    playerSocket.kaijiGame = {
        searchingForOpponent: false,
        roomId,
        opponentId: opponentSocket.id,
    };
    opponentSocket.kaijiGame = {
        searchingForOpponent: false,
        roomId,
        opponentId: playerSocket.id,
    };
    // send information to start the game
    const startRoundWithEmperor = (0, generalHelpers_1.coinFlip)();
    const clientGoesFirst = (0, generalHelpers_1.coinFlip)();
    namespaces_1.WS.appWSSend(playerSocket, namespaces_1.WS.EventNames.PlayStartGame, {
        startRoundWithEmperor,
        clientGoesFirst,
    });
    namespaces_1.WS.appWSSend(opponentSocket, namespaces_1.WS.EventNames.PlayStartGame, {
        startRoundWithEmperor: !startRoundWithEmperor,
        clientGoesFirst: !clientGoesFirst,
    });
}
function startGame(playerSocket) {
    /**
     * If a game is found, add the user to it  and send back information
     * to start the game.
     */
    // don't let players start a new game if they're already in one
    if (playerSocket.kaijiGame.searchingForOpponent)
        return (0, serverInstances_1.appConsoleLog)("already searching for opponent");
    if (playerSocket.kaijiGame.roomId != null) {
        // remove them from the room if they're already in one
        // this happens if they finish a game and start a new one
        // since they'll be connected until one player starts searching
        // for a new game. this is also a soft prevention for clients editing
        // source code
        // should be guarded on the front end but here as a backup in case
        // the client changes source code deletes the guard for this
        serverRoom_1.kaijiController.removeUser(playerSocket);
    }
    const potentialGame = serverRoom_1.kaijiController.getOpenToJoinRoom();
    if (potentialGame == undefined || !potentialGame.openToJoin || potentialGame.friendOnly) {
        /**
         * When a game isn't found, create a new one and add them to the queue.
         * They will be waiting, but the next player to request this event
         * will be the one to start the game for both users. So, players
         * who can't find a game right away will never be left hanging.
         */
        const newRoom = new KaijiRoom_1.default({
            users: [playerSocket],
            openToJoin: true,
            friendOnly: false,
        });
        // update user details
        playerSocket.kaijiGame = {
            searchingForOpponent: true,
            roomId: newRoom.id,
            opponentId: null,
        };
        serverRoom_1.kaijiController.addRoom(newRoom);
    }
    else {
        /**
         * Send the game starting data to both users.
         */
        // get the user's opponent
        const opponentSocket = potentialGame.users.find((socket) => socket.id !== playerSocket.id);
        if (opponentSocket == undefined)
            return (0, serverInstances_1.appConsoleLog)("opponent socket not found");
        // match user with opponent and configure room
        potentialGame.addUser(playerSocket);
        potentialGame.closeToNewcomers();
        // start game
        _setupGame(playerSocket, opponentSocket, potentialGame.id);
    }
}
exports.startGame = startGame;
function getPrivateRoom(playerSocket) {
    /**
     * Setup private room for the user and their friend.
     */
    if (playerSocket.kaijiGame.roomId != null)
        return (0, serverInstances_1.appConsoleLog)("already in game");
    const newRoom = new KaijiRoom_1.default({
        users: [playerSocket],
        openToJoin: true,
        friendOnly: true,
    });
    serverRoom_1.kaijiController.addRoom(newRoom);
    // update user game details
    playerSocket.kaijiGame = {
        searchingForOpponent: false,
        roomId: newRoom.id,
        opponentId: null,
    };
    // send room id to user
    namespaces_1.WS.appWSSend(playerSocket, namespaces_1.WS.EventNames.PlayGetPrivateRoom, { roomId: newRoom.id });
}
exports.getPrivateRoom = getPrivateRoom;
function joinPrivateRoom(playerSocket, data) {
    /**
     * If the game the link visitor was sent to doesn't exist, the link
     * provider left their game and notify this to the link visitor and
     * don't start the game.
     *
     * Otherwise, if the game exists, start the game using the PlayStartGame
     * event already defined. (extracted by _setupGame)
     */
    const room = serverRoom_1.kaijiController.getRoom(data.roomId);
    if (room == undefined) {
        // if a room isn't found, tell the user that the game
        // they were sent to does not exist anymore
        namespaces_1.WS.appWSSend(playerSocket, namespaces_1.WS.EventNames.PlayJoinPrivateRoom, { gameFound: false });
        (0, serverInstances_1.appConsoleLog)("room not found");
        return;
    }
    if (!room.openToJoin)
        return (0, serverInstances_1.appConsoleLog)("room not open, shouldn't ever happen btw");
    // can't use kaijiGame.opponentId since this is a new socket that is joining
    // an existing game so it doesn't know the opponent's id yet
    const opponent = room.users.find((socket) => socket.id !== playerSocket.id);
    if (opponent == undefined)
        return (0, serverInstances_1.appConsoleLog)("opponent not found");
    // configure room
    room.addUser(playerSocket);
    room.closeToNewcomers();
    // start game
    _setupGame(playerSocket, opponent, data.roomId);
}
exports.joinPrivateRoom = joinPrivateRoom;
function makeMove(playerSocket, data) {
    /**
     * Send the move made by a player to the opponent.
     */
    if (playerSocket.kaijiGame.roomId === null)
        return (0, serverInstances_1.appConsoleLog)("not in room");
    const opponentSocket = serverRoom_1.kaijiController.getUser(playerSocket.kaijiGame);
    if (opponentSocket == undefined)
        return (0, serverInstances_1.appConsoleLog)("opponent not found");
    // send move to opponent
    namespaces_1.WS.appWSSend(opponentSocket, namespaces_1.WS.EventNames.PlayGetOpponentMove, { opponentPlay: data.cardPlayed });
}
exports.makeMove = makeMove;
function sendEmote(playerSocket, data) {
    if (playerSocket.kaijiGame.roomId === null)
        return (0, serverInstances_1.appConsoleLog)("not in room");
    const opponentSocket = serverRoom_1.kaijiController.getUser(playerSocket.kaijiGame);
    if (opponentSocket == undefined)
        return (0, serverInstances_1.appConsoleLog)("opponent not found");
    namespaces_1.WS.appWSSend(opponentSocket, namespaces_1.WS.EventNames.PlayGetOpponentEmote, { opponentEmote: data.emote });
}
exports.sendEmote = sendEmote;
function sendMessage(playerSocket, data) {
    if (playerSocket.kaijiGame.roomId === null)
        return (0, serverInstances_1.appConsoleLog)("not in room");
    const opponentSocket = serverRoom_1.kaijiController.getUser(playerSocket.kaijiGame);
    if (opponentSocket == undefined)
        return (0, serverInstances_1.appConsoleLog)("opponent not found");
    namespaces_1.WS.appWSSend(opponentSocket, namespaces_1.WS.EventNames.PlayGetOpponentMessage, { opponentMessage: data.message });
}
exports.sendMessage = sendMessage;
