import http from "http";

import WebSocket from "ws";

import { WS } from "../utils/namespaces";
import { JSONParsedOrReturn } from "../utils/methods/generalHelpers";
import {
    getPrivateRoom,
    makeMove,
    joinPrivateRoom,
    startGame,
    sendEmote,
    sendMessage,
} from "../ws/play";
import { startConnection } from "../ws/start";
import { leaveGame, quitGame } from "../ws/end";
import { appConsoleLog } from "../../.app/serverInstances";

import { kaijiController } from "./serverRoom";

function initializedWebSocketServer(
    options?: http.ServerOptions & { server: http.Server },
    callback?: (() => void) | undefined
) {
    const wss = new WebSocket.Server(options, callback);

    wss.on("connection", async (ws) => {
        console.log("connected");
        startConnection(ws);

        ws.onmessage = function (event) {
            // prettier-ignore
            const socketRequest = JSONParsedOrReturn(event.data.toString())
            // prettier-ignore
            if (typeof socketRequest === "string") return appConsoleLog(socketRequest);
            // prettier-ignore
            if (socketRequest.type === "test") ws.send(JSON.stringify({ type: "testR" }));
            // prettier-ignore
            const { eventType, eventData } = socketRequest as { eventType: WS.EventNames; eventData: any };

            appConsoleLog(socketRequest);
            switch (eventType) {
                case WS.EventNames.PlayStartGame:
                    startGame(ws);
                    break;

                case WS.EventNames.PlayGetPrivateRoom:
                    // remove them if they're already in a room
                    if (ws.kaijiGame.roomId !== null) leaveGame(ws);
                    getPrivateRoom(ws);
                    break;

                case WS.EventNames.PlayJoinPrivateRoom:
                    joinPrivateRoom(ws, eventData);
                    break;

                case WS.EventNames.PlayMakeMove:
                    makeMove(ws, eventData);
                    break;

                case WS.EventNames.PlaySendEmote:
                    sendEmote(ws, eventData);
                    break;

                case WS.EventNames.PlaySendMessage:
                    sendMessage(ws, eventData);
                    break;

                case WS.EventNames.EndQuitGame:
                    quitGame(ws);
                    break;

                case WS.EventNames.EndLeaveRoom:
                    leaveGame(ws);
                    break;

                // debugger;
                case "ShowSock" as unknown as WS.EventNames:
                    // console.log(ws.id, ws.kaijiGame);
                    kaijiController.testingGet();
                    break;

                default:
                    console.log(`unknown event type ${eventType}`);
            }
        };

        ws.onclose = function () {
            leaveGame(ws);
        };
    });

    return wss;
}

export { initializedWebSocketServer };
