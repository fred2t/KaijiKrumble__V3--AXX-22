import WebSocket from "ws";

import { appJSONStringify } from "../methods/generalHelpers";

import { Kaiji } from ".";

export enum EventNames {
    PlayStartGame = "/ws/play/start-game",

    PlayGetPrivateRoom = "/ws/play/request-private-room",
    PlayJoinPrivateRoom = "/ws/play/private-room-status",

    PlayMakeMove = "/ws/play/make-move",
    PlayGetOpponentMove = "/ws/play/receive-opponent-move",

    PlaySendEmote = "/ws/play/send-emote",
    PlayGetOpponentEmote = "/ws/play/see-emote",

    PlaySendMessage = "/ws/chat/send-message",
    PlayGetOpponentMessage = "/ws/chat/receive-message",

    EndQuitGame = "/ws/end/quit-game",
    EndOpponentQuitGame = "/ws/end/opponent-quit-game",

    EndLeaveRoom = "/ws/end/leave-game",
    EndOpponentLeaveRoom = "/ws/end/opponent-left-game",
}

export interface IncomingData {
    [EventNames.PlayJoinPrivateRoom]: { roomId: string };
    [EventNames.PlayMakeMove]: { cardPlayed: Kaiji.Cards };
    [EventNames.PlaySendEmote]: { emote: Kaiji.Emotes };
    [EventNames.PlaySendMessage]: { message: string };
}

export interface OutgoingData {
    [EventNames.PlayStartGame]: GameStartingInformation;
    [EventNames.PlayGetPrivateRoom]: { roomId: string };
    [EventNames.PlayJoinPrivateRoom]: { gameFound: false } | GameStartingInformation;
    [EventNames.PlayGetOpponentMove]: { opponentPlay: Kaiji.Cards };
    [EventNames.PlayGetOpponentEmote]: { opponentEmote: Kaiji.Emotes };
    [EventNames.PlayGetOpponentMessage]: { opponentMessage: string };
}

declare module "ws" {
    class _WS extends WebSocket {}
    interface WebSocket extends _WS {
        id: string;
        kaijiGame: Kaiji.SocketUserData;
    }
}

export interface Message {
    eventType: EventNames;
    eventData?: unknown;
}

export interface GameStartingInformation {
    startRoundWithEmperor: boolean;
    clientGoesFirst: boolean;
}

// helper methods
export function appWSSend<T>(
    socket: WebSocket.WebSocket | null,
    eventType: EventNames,
    eventData: T
) {
    socket?.send(appJSONStringify<Message>({ eventType, eventData }));
}

export function globalBroadcast(wss: WebSocket.Server, data: string) {
    wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;

        client.send(data);
    });
}
