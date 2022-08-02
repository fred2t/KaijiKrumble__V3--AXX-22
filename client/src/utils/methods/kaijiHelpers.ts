import { GameParticipant } from "../enums";
import { Kaiji } from "../namespaces";

export function postPlayGameState({
    turnFinished,
    clientPlay,
    opponentPlay,
    clientPoints,
    opponentPoints,
    turnCountdownInterval,
    automaticPlayCountdown,
}: {
    turnFinished: boolean;
    clientPlay: Kaiji.Cards | null;
    opponentPlay: Kaiji.Cards | null;
    clientPoints: number;
    opponentPoints: number;
    turnCountdownInterval: NodeJS.Timer | null;
    automaticPlayCountdown: NodeJS.Timeout | null;
}) {
    /**
     * Extraction of functionality that will be run around halfway through
     * the state update no matter if the client or opponent made the move.
     *
     * @Note Both @var clientPlay and @var opponentPlay will be postfixed with
     * the (!) non-null assertion operator since they're values will only be
     * accessed if they pass the @var turnFinished boolean check. If
     * @var turnFinished is @var true, then that means both players have made a move.
     * (Otherwise, they haven't made a move yet.)
     */

    // check if a player won the round
    const clientWonRound = turnFinished && Kaiji.WIN_AGAINST[clientPlay!] === opponentPlay;

    const opponentWonRound =
        /**
         * Make sure the turn is finished since that is when both players have a
         * card they've played.
         */
        turnFinished &&
        /**
         * The turnFinished check before confirms that the opponent has made a play
         * and @var opponentPlay is not null.
         */
        Kaiji.WIN_AGAINST[opponentPlay!] === clientPlay;

    // calculate the new points of each player
    // add the card type's point value to the current points if won the round
    const updatedClientPoints =
        clientPoints + (clientWonRound ? Kaiji.CARD_WIN_POINTS[clientPlay!] : 0);
    const updatedOpponentPoints =
        // again, the opponent play can't be null if the turn ended
        // (turn ended because opponent winning implies both players made a play)
        // again, add the card's value if the opponent won the round
        opponentPoints + (opponentWonRound ? Kaiji.CARD_WIN_POINTS[opponentPlay!] : 0);

    const mappablePlayers: Kaiji.FormattedPlayer[] = [
        { identity: GameParticipant.Client, score: updatedClientPoints },
        {
            identity: GameParticipant.Opponent,
            score: updatedOpponentPoints,
        },
    ];
    const winner = mappablePlayers.find((player) => player.score >= Kaiji.POINTS_TO_WIN);
    const gameOver = winner !== undefined;

    if (gameOver) {
        clearInterval(turnCountdownInterval ?? undefined);
        clearTimeout(automaticPlayCountdown ?? undefined);

        // don't make players leave the room here to allow for further
        // communications with each other if wanted
    }

    return {
        clientWonRound,
        opponentWonRound,
        updatedClientPoints,
        updatedOpponentPoints,
        winner,
        gameOver,
    };
}
