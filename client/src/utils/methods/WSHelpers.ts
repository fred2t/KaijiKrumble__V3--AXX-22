import { WS } from "../namespaces";

export function appWSSend<T>(socket: WebSocket | null, eventType: WS.EventNames, eventData: T) {
    socket?.send(JSON.stringify<WS.Message>({ eventType, eventData }));
}
