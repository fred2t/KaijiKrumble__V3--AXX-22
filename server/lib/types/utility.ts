interface ServerBuildSettings {
    PORT: number;
    CLIENT_URL: string;
}

type TimeRepresentation =
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "year";

type EpochTime = number;

export { ServerBuildSettings, TimeRepresentation, EpochTime };
