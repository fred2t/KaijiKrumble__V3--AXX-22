import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import cardBack from "../../public/images/card-back.png";
import Sidebar from "../components/layout/PlaySidebar";
import blankCard from "../../public/images/blank-card.png";
import userAvatar from "../../public/images/user-avatar.png";
import { Kaiji, Time, WS } from "../utils/namespaces";
import {
    cancelSearch,
    decrementSecondsToMakeMove,
    quitGame,
    playCard,
    searchForGame,
    setClientEmote,
    setTurnCountdownInterval,
    changeEmotingStatus,
    clearClientEmote,
    setAutomaticPlayCountdown,
} from "../redux/slices/kaijiGameSlice";
import { randomChoice } from "../utils/methods/generalHelpers";
import PlayFriendModal from "../components/Kaiji/PlayFriendModal";
import CircularProgressWithLabel from "../components/flexible/CircularProgressBar";
import { appConsoleLog, CONNECTION_TIMEOUT_SECONDS } from "../../settings/clientInstances";
import { EventNames } from "../utils/namespaces/WS";
import { appWSSend } from "../utils/methods/WSHelpers";
import KaijiGameChatSpace from "../components/Kaiji/KaijiGameChatSpace";
import { queuePausedMessage } from "../redux/slices/wsSlice";

interface Props {}

function Play({}: Props): JSX.Element {
    useEffect(() => {
        window.onbeforeunload = function (e) {
            return "Are you sure you want to leave?";
        };
    }, []);

    const [playFriendModalOpen, setPlayFriendModalOpen] = useState(false);

    const { socket, connectionTime } = useAppSelector((s) => s.ws);
    const {
        gameLoadedOnce,
        gameOngoing,
        opponentHand,
        clientHand,
        isMyTurn,
        searchingForGame,
        gameEndMessage,
        clientPlay,
        opponentPlay,
        secondsToMakeMove,
        currentRound,
        privateRoomId,
        turnFinished,
        clientPoints,
        opponentPoints,
        clientWonRound,
        emotingStatus,
        clientEmote,
        opponentEmote,
        roomAlive,
    } = useAppSelector((s) => s.kaijiGame);

    const dispatch = useAppDispatch();

    // handle game initialization states
    useEffect(() => {
        let countdown: NodeJS.Timer | undefined;
        if (!gameOngoing) {
            /**
             * If the game is not ongoing, don't start the turn countdown
             * interval.
             */
            return;
        } else {
            /**
             * When the game starts, start the turn countdown that will decrement
             * the seconds to make move for the entire game.
             */
            countdown = setInterval(() => {
                dispatch(decrementSecondsToMakeMove());
            }, 1000);
            dispatch(setTurnCountdownInterval(countdown));
        }

        return () => {
            appConsoleLog("cleaning up");
            clearInterval(countdown);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, gameOngoing]);

    // setup timer for automatic play to avoid infinitely long turns
    useEffect(() => {
        /**
         * When the opponent moves, reset the timer to represent
         * the client's turn countdown.
         *
         * Decrement the seconds to make move counter every second.
         * If the counter reaches 0, the player's turn is over and a
         * move is made automatically.
         */

        if (gameOngoing === false) return;
        if (isMyTurn === false) return;

        const playerPlayTimeframe = setTimeout(() => {
            if (!gameOngoing) return;

            onPlayCard(randomChoice(clientHand));
        }, Kaiji.SECONDS_TO_MOVE * 1000);
        dispatch(setAutomaticPlayCountdown(playerPlayTimeframe));

        return () => {
            clearTimeout(playerPlayTimeframe);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, gameOngoing, isMyTurn]);

    const onPlayStartGameSearch = () => {
        // shouldn't be needed but here in case the client edits source
        if (gameOngoing) return appConsoleLog("Game already in progress");

        // confirm if user wants to remove the private room they are in
        if (privateRoomId) {
            const confirmation = window.confirm(
                "You have a game with friend request pending. Close it and start a new game?"
            );

            // if the user cancels, do nothing
            if (!confirmation) return;
        }

        // since the game gameOngoing guard confirmed the user isn't in a game,
        // this will be ran if the user has completed a game on their session
        if (gameLoadedOnce) {
            /**
             * Since the room was not ended as soon as the game had a winner,
             * the client will have to leave the room then start a new game.
             */

            appWSSend<null>(socket, WS.EventNames.EndLeaveRoom, null);
        }

        // if the user is not searching for a game, start a new game
        dispatch(searchForGame());

        if (
            Time.isInEopchTimeRange(
                Number(connectionTime),
                Time.currentEpochTime() + Kaiji.MAXIMUM_GAME_SECONDS * 1000,
                CONNECTION_TIMEOUT_SECONDS * 1000
            ) &&
            socket?.readyState === WebSocket.OPEN
        ) {
            /**
             * If game will finish before timeout, start game now. Not very good
             * check because this doesn't account for the time to find a game.
             */

            appWSSend<null>(socket, WS.EventNames.PlayStartGame, null);
        } else {
            // reconnect the socket to refresh connection timeout and queue the
            // game when they reconnect

            socket?.close();
            dispatch(
                queuePausedMessage((newSocket) => {
                    appWSSend<null>(newSocket, WS.EventNames.PlayStartGame, null);
                })
            );
        }
    };

    const onCancelGameSearch = () => {
        dispatch(cancelSearch());

        // tell server to delete the room the user's in
        appWSSend<null>(socket, EventNames.EndLeaveRoom, null);
    };

    const onOpenPlayFriendModal = () => {
        if (gameOngoing) {
            alert("You can't invite a friend while a game is in progress");
            return;
        }

        // get the a private room
        if (socket?.readyState === WebSocket.OPEN) {
            appWSSend<null>(socket, WS.EventNames.PlayGetPrivateRoom, null);
        } else {
            dispatch(
                queuePausedMessage((newSocket) => {
                    appWSSend<null>(newSocket, WS.EventNames.PlayGetPrivateRoom, null);
                })
            );
        }

        // show the user how their friend can join
        setPlayFriendModalOpen(true);
    };

    const onClosePlayFriendModal = () => {
        setPlayFriendModalOpen(false);
    };

    const onPlayCard = (card: Kaiji.MappableCard) => {
        if (!gameOngoing || !isMyTurn) return;

        appWSSend<WS.OutgoingData[WS.EventNames.PlayMakeMove]>(socket, WS.EventNames.PlayMakeMove, {
            cardPlayed: Kaiji.Cards[card.type],
        });
        dispatch(playCard(card));
    };

    const onEmoting = () => {
        dispatch(changeEmotingStatus());
    };

    const onEmote = (emote: Kaiji.Emotes) => {
        if (clientEmote !== null) return appConsoleLog("Already emoting");

        dispatch(setClientEmote(emote));

        setTimeout(() => {
            dispatch(clearClientEmote());
        }, 3000);

        if (roomAlive === true) {
            appWSSend<WS.OutgoingData[WS.EventNames.PlaySendEmote]>(
                socket,
                WS.EventNames.PlaySendEmote,
                { emote }
            );
        }
    };

    const onQuitGame = () => {
        if (!gameOngoing) return appConsoleLog("Game not in progress");

        dispatch(quitGame());
        appWSSend<null>(socket, WS.EventNames.EndQuitGame, null);
    };

    return (
        <div className="game-container">
            <Sidebar />

            <div className={`game-space ${gameOngoing ? "" : "shade"}`}>
                {/* opponent's hand and cards */}
                <div
                    className={`player-side opponent-side ${
                        currentRound !== 1 && Kaiji.winnerClassAppend(!clientWonRound)
                    }`}
                >
                    <div className="avatar-container opponent-avatar-container">
                        {opponentEmote && (
                            <div className="emote opponent-emote">{opponentEmote}</div>
                        )}

                        <img
                            src={userAvatar.src}
                            className="avatar opponent-avatar"
                            alt="opponent user avatar"
                        />
                    </div>
                    <div className="hand opponent-hand">
                        {opponentHand.map((cardId) => (
                            <img
                                key={cardId}
                                className="card opponent-card"
                                src={cardBack.src}
                                alt="card facing away from client"
                            />
                        ))}
                    </div>
                </div>

                <div className="middle-game-container">
                    {!isMyTurn && (
                        <div className="move-clock opponent-move-clock">
                            Opponent move timer:{" "}
                            <span className={`${Kaiji.countdownTextClass(secondsToMakeMove)}`}>
                                {secondsToMakeMove}
                            </span>
                        </div>
                    )}
                    {isMyTurn && (
                        <div className="move-clock client-move-clock">
                            Your move timer:{" "}
                            <span className={`${Kaiji.countdownTextClass(secondsToMakeMove)}`}>
                                {secondsToMakeMove}
                            </span>
                        </div>
                    )}
                    <div className="round-counter">Round #{currentRound}</div>

                    <div className="points-tracker opponent-points">
                        <CircularProgressWithLabel
                            value={(opponentPoints / Kaiji.POINTS_TO_WIN) * 100}
                        />
                        <div>
                            Points: {opponentPoints}/{Kaiji.POINTS_TO_WIN}
                        </div>
                    </div>
                    <div className="points-tracker client-points">
                        <CircularProgressWithLabel
                            value={(clientPoints / Kaiji.POINTS_TO_WIN) * 100}
                        />
                        Points: {clientPoints}/{Kaiji.POINTS_TO_WIN}
                    </div>

                    {searchingForGame && <CircularProgress className="searching-game-animation" />}
                    {gameEndMessage && <div className="game-end-message">{gameEndMessage}</div>}
                    <div className="played-cards">
                        {opponentPlay && (
                            <img
                                src={
                                    turnFinished
                                        ? Kaiji.CARD_IMAGE_MAP[opponentPlay].src
                                        : cardBack.src
                                }
                                alt="card opponent played"
                                className="card"
                            />
                        )}
                        {clientPlay && (
                            <img
                                src={
                                    turnFinished
                                        ? Kaiji.CARD_IMAGE_MAP[clientPlay].src
                                        : cardBack.src
                                }
                                alt="card user played"
                                className="card"
                            />
                        )}
                    </div>
                </div>

                {/* client's hands and cards */}
                <div
                    className={`player-side client-side ${
                        currentRound !== 1 && Kaiji.winnerClassAppend(clientWonRound)
                    }`}
                >
                    <div className="hand client-hand">
                        {clientHand.map((card) => (
                            <img
                                key={card.id}
                                src={
                                    gameLoadedOnce
                                        ? Kaiji.CARD_IMAGE_MAP[card.type].src
                                        : blankCard.src
                                }
                                className={`card hover-enlarge client-card ${
                                    gameOngoing && isMyTurn ? "point" : ""
                                }`}
                                alt="client side card"
                                onClick={() => onPlayCard(card)}
                            />
                        ))}
                    </div>

                    <div className="avatar-container client-avatar-container">
                        {emotingStatus && (
                            <>
                                <div className="emote-list left">
                                    {[
                                        Kaiji.Emotes.PlayEmperor,
                                        Kaiji.Emotes.PlayCitizen,
                                        Kaiji.Emotes.PlaySlave,
                                        Kaiji.Emotes.Appreciation,
                                    ].map((emote) => (
                                        <Button
                                            variant="contained"
                                            key={emote}
                                            onClick={() => onEmote(emote)}
                                        >
                                            {emote}
                                        </Button>
                                    ))}
                                </div>
                                <div className="emote-list top">
                                    {[Kaiji.Emotes.WellPlayed].map((emote) => (
                                        <Button
                                            variant="contained"
                                            key={emote}
                                            onClick={() => onEmote(emote)}
                                        >
                                            {emote}
                                        </Button>
                                    ))}
                                </div>
                                <div className="emote-list right">
                                    {[
                                        Kaiji.Emotes.Greetings,
                                        Kaiji.Emotes.Mistake,
                                        Kaiji.Emotes.Surprise,
                                        Kaiji.Emotes.Celebration,
                                    ].map((emote) => (
                                        <Button
                                            variant="contained"
                                            key={emote}
                                            onClick={() => onEmote(emote)}
                                        >
                                            {emote}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )}

                        {clientEmote && <div className="emote client-emote">{clientEmote}</div>}

                        <img
                            className="avatar hover-enlarge client-avatar"
                            src={userAvatar.src}
                            alt="client's avatar"
                            onClick={onEmoting}
                        />
                    </div>
                </div>
            </div>

            {/* inline css to vertically center (flex-direction: column in css) only if not in game */}
            <div className="game-sidebar" style={!gameOngoing ? { justifyContent: "center" } : {}}>
                {!gameOngoing && !searchingForGame && (
                    <section className="pre-game-search-container">
                        <Button
                            variant={"contained"}
                            className="option-btn"
                            onClick={onPlayStartGameSearch}
                        >
                            Find player
                        </Button>

                        <Button
                            variant={"contained"}
                            className="option-btn"
                            onClick={onOpenPlayFriendModal}
                        >
                            Play friend
                        </Button>
                        <PlayFriendModal
                            open={playFriendModalOpen}
                            onClose={onClosePlayFriendModal}
                        />
                    </section>
                )}
                {gameOngoing && (
                    <Button variant="contained" className="option-btn" onClick={onQuitGame}>
                        Quit game
                    </Button>
                )}
                {searchingForGame && (
                    <section className="searching-game-container">
                        <div className="searching-game-message">Searching for game...</div>
                        <Button variant="contained" onClick={onCancelGameSearch}>
                            Cancel search
                        </Button>
                    </section>
                )}

                {!searchingForGame && <KaijiGameChatSpace />}
            </div>
        </div>
    );
}

export default Play;
