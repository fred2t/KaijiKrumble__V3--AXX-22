import { useEffect } from "react";

import { ENVS } from "../../../settings/clientEnvironmentVariables";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    setPrivateRoomExists,
    notifyOpponentQuit,
    setPlayWithFriendLink,
    updateOpponentPlay,
    startGame,
    receiveOpponentEmote,
    clearOpponentEmote,
    receiveOpponentMessage,
    notifyOpponentLeaveRoom,
} from "../../redux/slices/kaijiGameSlice";
import {
    reportErrorStatus,
    setConnectionTime,
    setIsConnecting,
    setSocket,
} from "../../redux/slices/wsSlice";
import { Kaiji, WS } from "../../utils/namespaces";
import { JSONParsedOrReturn } from "../../utils/methods/generalHelpers";
import { appConsoleLog } from "../../../settings/clientInstances";
import { SessionStorageKeys } from "../../utils/enums";
import { currentEpochTime } from "../../utils/namespaces/Time";

function useSocketConnection(): void {
    const { socket, isConnecting, pausedMessages } = useAppSelector((state) => state.ws);

    const dispatch = useAppDispatch();

    let currentStateWS: WebSocket | undefined;
    useEffect(() => {
        const connectSocket = (): void => {
            /**
             * Connects to the socket.
             *
             * Connection is extracted to a function to be able to reuse it for reconnection
             * when the socket is closed.
             *
             * This will also store the time when the socket was connected to the session storage
             * to be used to determine if the socket should be reconnected before starting another
             * kaiji game. Used because of host's conenction timeout.
             */

            // don't run this function if another socket is being connected
            if (isConnecting) return appConsoleLog("another socket already connecting");

            // connect the socket and start building the socket tools
            dispatch(setIsConnecting(true));
            const ws = new WebSocket(ENVS.WS_BASE_URL);

            ws.onopen = function () {
                console.log("connected");
                dispatch(setSocket(ws));
                dispatch(setConnectionTime(currentEpochTime()));

                ws.onmessage = (event) => {
                    // prettier-ignore
                    const socketResponse = JSONParsedOrReturn(event.data.toString()) as unknown as WS.Message;
                    if (typeof socketResponse === "string") return appConsoleLog(socketResponse);
                    appConsoleLog(socketResponse);
                    const { eventType, eventData } = socketResponse;

                    switch (eventType) {
                        case WS.EventNames.PlayStartGame:
                            dispatch(startGame(eventData));
                            break;

                        case WS.EventNames.PlayGetPrivateRoom:
                            dispatch(setPlayWithFriendLink(eventData));
                            break;

                        case WS.EventNames.PlayJoinPrivateRoom:
                            dispatch(setPrivateRoomExists(eventData));
                            break;

                        case WS.EventNames.PlayGetOpponentMove:
                            dispatch(updateOpponentPlay(eventData));
                            break;

                        case WS.EventNames.PlayGetOpponentEmote:
                            dispatch(receiveOpponentEmote(eventData));
                            setTimeout(() => {
                                dispatch(clearOpponentEmote());
                            }, Kaiji.EMOTE_VISIBILITY_SECONDS * 1000);
                            break;

                        case WS.EventNames.PlayGetOpponentMessage:
                            dispatch(receiveOpponentMessage(eventData));
                            break;

                        case WS.EventNames.EndOpponentQuitGame:
                            dispatch(notifyOpponentQuit());
                            break;

                        // caught when opponent leaves game
                        case WS.EventNames.EndOpponentLeaveRoom:
                            dispatch(notifyOpponentLeaveRoom());
                            break;

                        // debugger;
                        case "ShowSock" as WS.EventNames:
                            console.log(socketResponse);
                            break;

                        default:
                            console.error("missed event", socketResponse);
                    }
                };

                ws.onclose = function () {
                    console.log("disconnected, trying to reconnect");
                    dispatch(reportErrorStatus(true));

                    setTimeout(() => {
                        connectSocket();
                    }, 2345);
                };

                ws.onerror = function (event) {
                    dispatch(reportErrorStatus(true));

                    console.error(`Socket encountered error: ${event}`);
                };
            };

            // all socket tools are built and functions are ready to go
            dispatch(setIsConnecting(false));
        };

        connectSocket();
        return () => {
            if (currentStateWS == undefined) return;
            currentStateWS.close();
        };
    }, []);

    // playback messages that were queued while the socket was offline
    useEffect(() => {
        /**
         * Playback messages that were queued while the socket was offline.
         *
         * This will be important for restarting the app to a functioning
         * state after the socket disconnects due to connection timeout.
         */

        // don't do anything if the socket isn't connected
        if (socket?.readyState == null) return;
        if (socket.readyState !== WebSocket.OPEN)
            return appConsoleLog("messages not ready to play");

        // once the socket is connected, play back all messages that were sent while
        // it socket was offline
        console.log("starting Q");
        pausedMessages.forEach((message) => {
            message(socket);
            console.log("message printed");
        });

        // don't add pausedMessages as dependecy or it will fire before the
        // socket is connected
    }, [socket?.readyState]);
}

export default useSocketConnection;
