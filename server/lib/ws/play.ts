import WebSocket from "ws";

import KaijiRoom from "../classes/KaijiRoom";
import { WS } from "../utils/namespaces";
import { coinFlip } from "../utils/methods/generalHelpers";
import { kaijiController } from "../config/serverRoom";
import { appConsoleLog } from "../../.app/serverInstances";

function _setupGame(
    playerSocket: WebSocket.WebSocket,
    opponentSocket: WebSocket.WebSocket,
    roomId: string
) {
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
    const startRoundWithEmperor = coinFlip();
    const clientGoesFirst = coinFlip();
    WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayStartGame]>(
        playerSocket,
        WS.EventNames.PlayStartGame,
        {
            startRoundWithEmperor,
            clientGoesFirst,
        }
    );

    WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayStartGame]>(
        opponentSocket,
        WS.EventNames.PlayStartGame,
        {
            startRoundWithEmperor: !startRoundWithEmperor,
            clientGoesFirst: !clientGoesFirst,
        }
    );
}

export function startGame(playerSocket: WebSocket.WebSocket): void {
    /**
     * If a game is found, add the user to it  and send back information
     * to start the game.
     */

    // don't let players start a new game if they're already in one
    if (playerSocket.kaijiGame.searchingForOpponent)
        return appConsoleLog("already searching for opponent");

    if (playerSocket.kaijiGame.roomId != null) {
        // remove them from the room if they're already in one
        // this happens if they finish a game and start a new one
        // since they'll be connected until one player starts searching
        // for a new game. this is also a soft prevention for clients editing
        // source code
        // should be guarded on the front end but here as a backup in case
        // the client changes source code deletes the guard for this

        kaijiController.removeUser(playerSocket);
    }

    const potentialGame = kaijiController.getOpenToJoinRoom();
    if (potentialGame == undefined || !potentialGame.openToJoin || potentialGame.friendOnly) {
        /**
         * When a game isn't found, create a new one and add them to the queue.
         * They will be waiting, but the next player to request this event
         * will be the one to start the game for both users. So, players
         * who can't find a game right away will never be left hanging.
         */

        const newRoom = new KaijiRoom({
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

        kaijiController.addRoom(newRoom);
    } else {
        /**
         * Send the game starting data to both users.
         */

        // get the user's opponent

        const opponentSocket = potentialGame.users.find((socket) => socket.id !== playerSocket.id);
        if (opponentSocket == undefined) return appConsoleLog("opponent socket not found");

        // match user with opponent and configure room
        potentialGame.addUser(playerSocket);
        potentialGame.closeToNewcomers();

        // start game
        _setupGame(playerSocket, opponentSocket, potentialGame.id);
    }
}

export function getPrivateRoom(playerSocket: WebSocket.WebSocket): void {
    /**
     * Setup private room for the user and their friend.
     */

    if (playerSocket.kaijiGame.roomId != null) return appConsoleLog("already in game");

    const newRoom = new KaijiRoom({
        users: [playerSocket],
        openToJoin: true,
        friendOnly: true,
    });
    kaijiController.addRoom(newRoom);

    // update user game details
    playerSocket.kaijiGame = {
        searchingForOpponent: false,
        roomId: newRoom.id,
        opponentId: null,
    };

    // send room id to user
    WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayGetPrivateRoom]>(
        playerSocket,
        WS.EventNames.PlayGetPrivateRoom,
        { roomId: newRoom.id }
    );
}

export function joinPrivateRoom(
    playerSocket: WebSocket.WebSocket,
    data: WS.IncomingData[WS.EventNames.PlayJoinPrivateRoom]
) {
    /**
     * If the game the link visitor was sent to doesn't exist, the link
     * provider left their game and notify this to the link visitor and
     * don't start the game.
     *
     * Otherwise, if the game exists, start the game using the PlayStartGame
     * event already defined. (extracted by _setupGame)
     */

    const room = kaijiController.getRoom(data.roomId);
    if (room == undefined) {
        // if a room isn't found, tell the user that the game
        // they were sent to does not exist anymore

        WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayJoinPrivateRoom]>(
            playerSocket,
            WS.EventNames.PlayJoinPrivateRoom,
            { gameFound: false }
        );

        appConsoleLog("room not found");
        return;
    }
    if (!room.openToJoin) return appConsoleLog("room not open, shouldn't ever happen btw");

    // can't use kaijiGame.opponentId since this is a new socket that is joining
    // an existing game so it doesn't know the opponent's id yet
    const opponent = room.users.find((socket) => socket.id !== playerSocket.id);
    if (opponent == undefined) return appConsoleLog("opponent not found");

    // configure room
    room.addUser(playerSocket);
    room.closeToNewcomers();

    // start game
    _setupGame(playerSocket, opponent, data.roomId);
}

export function makeMove(
    playerSocket: WebSocket.WebSocket,
    data: WS.IncomingData[WS.EventNames.PlayMakeMove]
) {
    /**
     * Send the move made by a player to the opponent.
     */

    if (playerSocket.kaijiGame.roomId === null) return appConsoleLog("not in room");

    const opponentSocket = kaijiController.getUser(playerSocket.kaijiGame);
    if (opponentSocket == undefined) return appConsoleLog("opponent not found");

    // send move to opponent
    WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayGetOpponentMove]>(
        opponentSocket,
        WS.EventNames.PlayGetOpponentMove,
        { opponentPlay: data.cardPlayed }
    );
}

export function sendEmote(
    playerSocket: WebSocket.WebSocket,
    data: WS.IncomingData[WS.EventNames.PlaySendEmote]
) {
    if (playerSocket.kaijiGame.roomId === null) return appConsoleLog("not in room");

    const opponentSocket = kaijiController.getUser(playerSocket.kaijiGame);
    if (opponentSocket == undefined) return appConsoleLog("opponent not found");

    WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayGetOpponentEmote]>(
        opponentSocket,
        WS.EventNames.PlayGetOpponentEmote,
        { opponentEmote: data.emote }
    );
}

export function sendMessage(
    playerSocket: WebSocket.WebSocket,
    data: WS.IncomingData[WS.EventNames.PlaySendMessage]
) {
    if (playerSocket.kaijiGame.roomId === null) return appConsoleLog("not in room");

    const opponentSocket = kaijiController.getUser(playerSocket.kaijiGame);
    if (opponentSocket == undefined) return appConsoleLog("opponent not found");

    WS.appWSSend<WS.OutgoingData[WS.EventNames.PlayGetOpponentMessage]>(
        opponentSocket,
        WS.EventNames.PlayGetOpponentMessage,
        { opponentMessage: data.message }
    );
}
