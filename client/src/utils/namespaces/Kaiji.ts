import { StaticImageData } from "next/image";
import { v4 } from "uuid";

import emperorCard from "../../../public/images/emperor-card.png";
import citizenCard from "../../../public/images/citizen-card.png";
import slaveCard from "../../../public/images/slave-card.png";
import { GameParticipant } from "../enums";

import { Aesthetics } from ".";

export enum Cards {
    Emperor = "Emperor",
    Citizen = "Citizen",
    Slave = "Slave",
}

export enum Emotes {
    PlayEmperor = "I played Emperor",
    PlayCitizen = "I played Citizen",
    PlaySlave = "I played Slave",
    Appreciation = "Thank you",
    WellPlayed = "Well played",
    Greetings = "Greetings",
    Surprise = "Wow",
    Celebration = "Oh yeah!",
    Mistake = "Oops",
}

// export enum PastOpponentReactions {
//     /**
//      * During and after every game, players may give each others a reaction.
//      *
//      * This will be given to any future opponents that player comes across.
//      */

//     Cheerful = "cheerful",
//     Friendly = "friendly",
//     Smart = "smart",
//     Aggressive = "Aggressive",
//     Unfriendly = "Unfriendly",
//     Dumb = "Dumb",
//     Fast = "Fast",
//     Slow = "Slow",
//     Confident = "Confident",
//     Happy = "Happy",
// }

export interface MappableCard {
    id: string;
    type: Cards;
}

export interface FormattedPlayer {
    identity: GameParticipant;
    score: number;
}

export interface MappableMessage {
    id: string;
    text: string;
    identity: GameParticipant;
}

export const CARD_IMAGE_MAP: { [C in Cards]: StaticImageData } = {
    [Cards.Emperor]: emperorCard,
    [Cards.Citizen]: citizenCard,
    [Cards.Slave]: slaveCard,
};

// primitives
export const HAND_SIZE = 5;
export const POINTS_TO_WIN = 10;
export const SECONDS_TO_MOVE = 8;
// assuming every turn in the game rewards a player 1 point, all cards are played
// before a turn winner, both players reach 1 point from winning and the timer
// runs out on every turn. finally divide by the lowest point win (emperor & citizen = 1)
export const MAXIMUM_GAME_SECONDS = (SECONDS_TO_MOVE * HAND_SIZE * 2 * POINTS_TO_WIN * 2) / 1;
export const EMOTE_VISIBILITY_SECONDS = 5;

// array
export const DEFAULT_CLIENT_HAND: MappableCard[] = Array.from({ length: HAND_SIZE }, () => {
    return { id: v4(), type: Cards.Citizen };
});
export const DEFAULT_OPPONENT_HAND = Array.from({ length: HAND_SIZE }, () => v4());

// object
export const CLIENT_EMPEROR_CARD: MappableCard = Object.freeze({ id: v4(), type: Cards.Emperor });
export const CLIENT_SLAVE_CARD: MappableCard = Object.freeze({ id: v4(), type: Cards.Slave });
export const WIN_AGAINST: Readonly<{ [C in Cards]: Cards }> = Object.freeze({
    [Cards.Emperor]: Cards.Citizen,
    [Cards.Citizen]: Cards.Slave,
    [Cards.Slave]: Cards.Emperor,
});
export const CARD_WIN_POINTS: Readonly<{ [C in Cards]: number }> = Object.freeze({
    /**
     * Points awarded if the card is won with.
     */

    [Cards.Emperor]: 1,
    [Cards.Citizen]: 1,
    [Cards.Slave]: 4,
});
export const PARTICIPANT_WIN_MESSAGE: Readonly<{ [P in GameParticipant]: string }> = Object.freeze({
    [GameParticipant.Client]: "You win!",
    [GameParticipant.Opponent]: "You lose",
    [GameParticipant.System]: "System",
});
export const MESSAGE_CLASS_MAP: { [P in GameParticipant]: string } = Object.freeze({
    /**
     * Class name for message author identities.
     */
    [GameParticipant.Client]: "client-message",
    [GameParticipant.Opponent]: "opponent-message",
    [GameParticipant.System]: "system-message",
});

// helper methods
export function countdownTextClass(secondsLeft: number): Aesthetics.TextColourClass {
    if (secondsLeft < 3) return Aesthetics.TextColourClass.Red;
    else if (secondsLeft < 4) return Aesthetics.TextColourClass.Orange;
    else if (secondsLeft < 6) return Aesthetics.TextColourClass.Gold;
    else return Aesthetics.TextColourClass.Green;
}

export function winnerClassAppend(clientWonRound: boolean): Aesthetics.BackgroundClass {
    return clientWonRound ? Aesthetics.BackgroundClass.Green : Aesthetics.BackgroundClass.Red;
}
