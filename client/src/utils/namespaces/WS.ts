import { Kaiji } from ".";

// enums
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

// types
export interface IncomingData {
    [EventNames.PlayStartGame]: GameStartingInformation;

    [EventNames.PlayGetPrivateRoom]: { roomId: string };

    // this will notify the link visitor if a game isn't found if it is,
    // the game will start using the PlayStartGame event that's already defined
    [EventNames.PlayJoinPrivateRoom]: { gameFound: false };
    [EventNames.PlayGetOpponentMove]: { opponentPlay: Kaiji.Cards };
    [EventNames.PlayGetOpponentEmote]: { opponentEmote: Kaiji.Emotes };
    [EventNames.PlayGetOpponentMessage]: { opponentMessage: string };
}

export interface OutgoingData {
    [EventNames.PlayJoinPrivateRoom]: { roomId: string };

    // sends user move to opponent
    [EventNames.PlayMakeMove]: { cardPlayed: Kaiji.Cards };
    [EventNames.PlaySendEmote]: { emote: Kaiji.Emotes };
    [EventNames.PlaySendMessage]: { message: string };
}

export interface Message {
    eventType: EventNames;
    eventData: any;
}

export interface GameStartingInformation {
    startRoundWithEmperor: boolean;
    clientGoesFirst: boolean;
}
