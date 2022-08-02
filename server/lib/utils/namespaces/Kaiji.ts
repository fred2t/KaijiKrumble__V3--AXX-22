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

export interface SocketUserData {
    searchingForOpponent: boolean;
    roomId: string | null;
    opponentId: string | null;
}
