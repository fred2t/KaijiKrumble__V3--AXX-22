import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAppSelector } from "../../../redux/hooks";
import { appWSSend } from "../../../utils/methods/WSHelpers";
import { WS } from "../../../utils/namespaces";

interface Props {}

function Game({}: Props): JSX.Element {
    /**
     * The route visited when users click on the "Play Friend" button on /play.
     */

    const router = useRouter();
    const { id: gameId } = router.query as { id: string };

    const { socket } = useAppSelector((s) => s.ws);
    const { privateRoomExists, gameOngoing } = useAppSelector((s) => s.kaijiGame);

    useEffect(() => {
        console.log("game use eff");

        if (gameId == undefined) return;

        appWSSend<WS.OutgoingData[WS.EventNames.PlayJoinPrivateRoom]>(
            socket,
            WS.EventNames.PlayJoinPrivateRoom,
            { roomId: gameId }
        );
    }, [gameId, router, socket]);

    useEffect(() => {
        if (!gameOngoing) return;

        router.push("/play");
    }, [gameOngoing, router]);

    return (
        <div className="game-awaiting-page">
            {privateRoomExists ? (
                <div>Preparing game...</div>
            ) : (
                <>
                    <h1>This room does not exist.</h1>
                    <h3>Your friend may have closed out their tab</h3>
                </>
            )}
        </div>
    );
}

export default Game;
