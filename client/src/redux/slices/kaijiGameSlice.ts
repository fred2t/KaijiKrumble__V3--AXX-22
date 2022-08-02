import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";

import { appConsoleLog } from "../../../settings/clientInstances";
import { GameParticipant } from "../../utils/enums";
import { postPlayGameState } from "../../utils/methods/kaijiHelpers";
import { Kaiji, WS } from "../../utils/namespaces";

interface State {
    gameLoadedOnce: boolean;
    searchingForGame: boolean;
    roomAlive: boolean;
    gameOngoing: boolean;
    privateRoomId: string | null;
    privateRoomExists: boolean;
    clientGoesFirst: boolean | null;
    startRoundWithEmperor: boolean | null;
    isMyTurn: boolean | null;
    clientPlay: Kaiji.Cards | null;
    opponentPlay: Kaiji.Cards | null;
    currentRound: number;
    secondsToMakeMove: number;
    turnFinished: boolean;

    emotingStatus: boolean;
    clientEmote: string | null;
    opponentEmote: string | null;

    clientHand: Kaiji.MappableCard[];
    // placeholder data to map over for client visual purposes
    // the server will send the plays to the client so the opponent's cards aren't tracked
    opponentHand: string[];
    clientPoints: number;
    opponentPoints: number;
    clientWonRound: boolean;
    gameEndMessage: string | null;
    turnCountdownInterval: NodeJS.Timer | null;
    automaticPlayCountdown: NodeJS.Timeout | null;
    messages: Kaiji.MappableMessage[];
}

const initialState: State = {
    gameLoadedOnce: false,
    searchingForGame: false,
    gameOngoing: false,
    gameEndMessage: null,
    privateRoomId: null,
    clientPlay: null,
    opponentPlay: null,
    turnFinished: false,
    emotingStatus: false,
    clientEmote: null,
    opponentEmote: null,
    roomAlive: false,

    // assume the link the user was given is still valid
    // when this is false, the user has already left the room
    // and the state will be used to detect that and notify the
    // llink recipient that the room is no longer valid
    privateRoomExists: true,
    secondsToMakeMove: 10,
    currentRound: 1,
    startRoundWithEmperor: null,
    clientGoesFirst: null,
    isMyTurn: null,
    messages: [],
    clientHand: Kaiji.DEFAULT_CLIENT_HAND,
    opponentHand: Kaiji.DEFAULT_OPPONENT_HAND,
    clientPoints: 0,
    opponentPoints: 0,
    clientWonRound: false,

    // the clocks to limit players' turn lengths will be set in a useEffect
    // these will store them so they can be turned off with the other state
    // whenever an action is dispatched that calls for changes
    turnCountdownInterval: null,
    automaticPlayCountdown: null,
};

export const slice = createSlice({
    name: "kaiji-game",
    initialState,
    reducers: {
        setPlayWithFriendLink: function (
            state,
            { payload }: PayloadAction<WS.IncomingData[WS.EventNames.PlayGetPrivateRoom]>
        ) {
            state.privateRoomId = payload.roomId;
            state.emotingStatus = false;
        },

        setPrivateRoomExists: function (
            state,
            { payload }: PayloadAction<WS.IncomingData[WS.EventNames.PlayJoinPrivateRoom]>
        ) {
            // if game is not found, tell the user their link supplier left the game
            state.privateRoomExists = payload.gameFound !== false;
        },

        setTurnCountdownInterval: function (state, { payload }: PayloadAction<NodeJS.Timer>) {
            state.turnCountdownInterval = payload;
        },

        setAutomaticPlayCountdown: function (state, { payload }: PayloadAction<NodeJS.Timeout>) {
            state.automaticPlayCountdown = payload;
        },

        changeEmotingStatus: function (state) {
            state.emotingStatus = !state.emotingStatus;
        },

        setClientEmote: function (state, { payload }: PayloadAction<Kaiji.Emotes>) {
            if (state.clientEmote !== null) return appConsoleLog("client emote already set");

            state.emotingStatus = false;
            state.clientEmote = payload;
        },

        clearClientEmote: function (state) {
            state.clientEmote = null;
        },

        receiveOpponentEmote: function (
            state,
            { payload }: PayloadAction<WS.IncomingData[WS.EventNames.PlayGetOpponentEmote]>
        ) {
            state.opponentEmote = payload.opponentEmote;
        },

        clearOpponentEmote: function (state) {
            state.opponentEmote = null;
        },

        sendMessage: function (state, { payload }: PayloadAction<string>) {
            state.messages = [
                { id: v4(), text: payload, identity: GameParticipant.Client },
                ...state.messages,
            ];
        },

        receiveOpponentMessage(
            state,
            { payload }: PayloadAction<WS.IncomingData[WS.EventNames.PlayGetOpponentMessage]>
        ) {
            state.messages = [
                { id: v4(), text: payload.opponentMessage, identity: GameParticipant.Opponent },
                ...state.messages,
            ];
        },

        searchForGame: function (state) {
            state.roomAlive = false;
            state.searchingForGame = true;
            state.emotingStatus = false;
            state.gameEndMessage = null;
            state.privateRoomId = null;
            state.messages = [];
        },

        cancelSearch: function (state) {
            state.searchingForGame = false;
            state.emotingStatus = false;
        },

        startGame: function (
            state,
            { payload }: PayloadAction<WS.IncomingData[WS.EventNames.PlayStartGame]>
        ) {
            // client state reset
            state.gameLoadedOnce = true;
            state.roomAlive = true;
            state.secondsToMakeMove = Kaiji.SECONDS_TO_MOVE;
            state.turnFinished = false; // useless actually but whatever
            state.gameOngoing = true;
            state.searchingForGame = false;
            state.messages = [];
            state.currentRound = 1;
            state.emotingStatus = false;
            state.clientEmote = null;
            state.opponentEmote = null;
            state.clientPlay = null;
            state.opponentPlay = null;
            state.clientPoints = 0;
            state.opponentPoints = 0;
            state.clientWonRound = false;
            state.clientHand = [
                ...Kaiji.DEFAULT_CLIENT_HAND.slice(0, 4),
                {
                    id: v4(),
                    type: payload.startRoundWithEmperor ? Kaiji.Cards.Emperor : Kaiji.Cards.Slave,
                },
            ];
            state.opponentHand = Kaiji.DEFAULT_OPPONENT_HAND;

            // from server
            state.isMyTurn = payload.clientGoesFirst;
            state.startRoundWithEmperor = payload.startRoundWithEmperor;
            state.clientGoesFirst = payload.clientGoesFirst;
        },

        decrementSecondsToMakeMove: function (state) {
            return { ...state, secondsToMakeMove: state.secondsToMakeMove - 1 };
        },

        playCard: function (state, { payload: clientPlay }: PayloadAction<Kaiji.MappableCard>) {
            if (clientPlay == null) {
                appConsoleLog("Tried to play a card that wasn't in the hand");
                return state;
            }

            // check if the turn's over
            // if client goes second, they will make the last play of any turn
            const turnFinished = state.clientGoesFirst === false;
            if (turnFinished && state.opponentPlay === null) {
                // opponent should have played a card by now since they went first
                // if they didn't, something went wrong
                // this is because going second would mean the opponent has already
                // played
                appConsoleLog("Turn ended and opponent had not played yet");
                return state;
            }

            const {
                clientWonRound,
                opponentWonRound,
                updatedClientPoints,
                updatedOpponentPoints,
                winner,
                gameOver,
            } = postPlayGameState({
                turnFinished,
                clientPlay: clientPlay.type,
                opponentPlay: state.opponentPlay,
                clientPoints: state.clientPoints,
                opponentPoints: state.opponentPoints,
                turnCountdownInterval: state.turnCountdownInterval,
                automaticPlayCountdown: state.automaticPlayCountdown,
            });

            const startingNewRound =
                /**
                 * The last condition checks if the turn is finished and the other player's
                 * hand is empty. If the turn is finished on a client play, that means there
                 * exists an opponent play which would mean the opponent has no cards.
                 */
                !gameOver &&
                (clientWonRound ||
                    opponentWonRound ||
                    (turnFinished && state.opponentHand.length === 0));

            // swap owners of emperors after each turn
            const startingNewRoundWithEmperor = startingNewRound
                ? !state.startRoundWithEmperor
                : // leave the state as it was before
                  state.startRoundWithEmperor;
            const newClientHand = startingNewRound
                ? // refill hand
                  [
                      // add 4 citizen cards
                      ...Kaiji.DEFAULT_CLIENT_HAND.slice(1),
                      startingNewRoundWithEmperor
                          ? Kaiji.CLIENT_EMPEROR_CARD
                          : Kaiji.CLIENT_SLAVE_CARD,
                  ]
                : // otherwise, remove the played card from the hand
                  state.clientHand.filter((card) => card.id !== clientPlay.id);

            const newOpponentHand = startingNewRound
                ? // refill hand
                  Kaiji.DEFAULT_OPPONENT_HAND
                : // leave value from before
                  state.opponentHand;

            // state changes
            state.gameOngoing = !gameOver;
            state.secondsToMakeMove = gameOver ? state.secondsToMakeMove : Kaiji.SECONDS_TO_MOVE;

            // increment the round by 1 or 0 depending on if a new round is starting
            state.currentRound = state.currentRound + Number(startingNewRound);
            state.isMyTurn = false;
            state.emotingStatus = false;

            // switch the player starting with the emperor if a new round starts
            state.startRoundWithEmperor = startingNewRoundWithEmperor;
            state.turnFinished = turnFinished;
            state.clientHand = newClientHand;
            state.opponentHand = newOpponentHand;

            // this state is called when player makes a move so if the opponent
            // made a move already, both players now have moved and the turn is over
            state.clientPlay = clientPlay.type;

            // clear opponent's play if my play is the first play of the turn
            state.opponentPlay = state.clientGoesFirst ? null : state.opponentPlay;
            state.clientWonRound = clientWonRound;
            state.clientPoints = updatedClientPoints;
            state.opponentPoints = updatedOpponentPoints;
            state.gameEndMessage = gameOver
                ? // if the game is over then there's a winner so non-null assertion
                  // is fine
                  Kaiji.PARTICIPANT_WIN_MESSAGE[winner!.identity]
                : state.gameEndMessage;
        },

        updateOpponentPlay: function (
            state,
            {
                payload: { opponentPlay },
            }: PayloadAction<WS.IncomingData[WS.EventNames.PlayGetOpponentMove]>
        ) {
            /**
             * See the documentation for the variables below at the playCard reducer
             * function. They follow identical reasoning.
             *
             * I have to do the same state checks and calculations for the opponent because
             * I won't know who's going first until the game has already started and
             * the reducer functions must be finalised.
             */

            const turnFinished = state.clientGoesFirst === true;
            const {
                clientWonRound,
                opponentWonRound,
                updatedClientPoints,
                updatedOpponentPoints,
                winner,
                gameOver,
            } = postPlayGameState({
                turnFinished,
                clientPlay: state.clientPlay,
                opponentPlay,
                clientPoints: state.clientPoints,
                opponentPoints: state.opponentPoints,
                turnCountdownInterval: state.turnCountdownInterval,
                automaticPlayCountdown: state.automaticPlayCountdown,
            });

            const startingNewRound =
                !gameOver &&
                (opponentWonRound ||
                    clientWonRound ||
                    (turnFinished && state.clientHand.length === 0));
            const startingNewRoundWithEmperor = startingNewRound
                ? !state.startRoundWithEmperor
                : state.startRoundWithEmperor;

            const newClientHand = startingNewRound
                ? [
                      ...Kaiji.DEFAULT_CLIENT_HAND.slice(1),
                      startingNewRoundWithEmperor
                          ? Kaiji.CLIENT_EMPEROR_CARD
                          : Kaiji.CLIENT_SLAVE_CARD,
                  ]
                : state.clientHand;
            const newOpponentHand = startingNewRound
                ? Kaiji.DEFAULT_OPPONENT_HAND
                : // remove 1 card from the opponent's hand
                  state.opponentHand.slice(1);

            // state changes
            state.gameOngoing = !gameOver;
            state.isMyTurn = true;
            state.secondsToMakeMove = gameOver ? state.secondsToMakeMove : Kaiji.SECONDS_TO_MOVE;
            state.turnFinished = turnFinished;
            state.startRoundWithEmperor = startingNewRoundWithEmperor;
            state.currentRound = state.currentRound + Number(startingNewRound);

            state.clientHand = newClientHand;
            state.opponentHand = newOpponentHand;
            state.clientPlay = state.clientGoesFirst ? state.clientPlay : null;
            state.opponentPlay = opponentPlay;
            state.clientWonRound = clientWonRound;
            state.clientPoints = updatedClientPoints;
            state.opponentPoints = updatedOpponentPoints;
            state.gameEndMessage = gameOver
                ? Kaiji.PARTICIPANT_WIN_MESSAGE[winner!.identity]
                : state.gameEndMessage;
        },

        quitGame: function (state) {
            state.gameOngoing = false;
            state.emotingStatus = false;
            state.gameEndMessage = "You quit";
        },

        notifyOpponentQuit: function (state) {
            clearInterval(state.turnCountdownInterval ?? undefined);
            clearTimeout(state.automaticPlayCountdown ?? undefined);

            state.gameOngoing = false;

            // the game ending will make the opponent leave the game
            // so the game end message will be set to "Opponent left",
            // even if the game ended in a win and the other player
            // didn't leave, so this will avoid the message being overwritten
            state.gameEndMessage = "Your opponent quit";
        },

        notifyOpponentLeaveRoom: function (state) {
            clearInterval(state.turnCountdownInterval ?? undefined);
            clearTimeout(state.automaticPlayCountdown ?? undefined);

            state.roomAlive = false;
            state.gameOngoing = false;
            state.gameEndMessage = "Your opponent left";
            state.messages = [
                { id: v4(), text: "Your opponent left the room", identity: GameParticipant.System },
                ...state.messages,
            ];
        },
    },
});

export const {
    sendMessage,
    startGame,
    searchForGame,
    notifyOpponentQuit,
    cancelSearch,
    setPlayWithFriendLink,
    setPrivateRoomExists,
    quitGame,
    playCard,
    updateOpponentPlay,
    decrementSecondsToMakeMove,
    setTurnCountdownInterval,
    setAutomaticPlayCountdown,
    changeEmotingStatus,
    setClientEmote,
    clearClientEmote,
    clearOpponentEmote,
    receiveOpponentEmote,
    receiveOpponentMessage,
    notifyOpponentLeaveRoom,
} = slice.actions;

export default slice.reducer;
