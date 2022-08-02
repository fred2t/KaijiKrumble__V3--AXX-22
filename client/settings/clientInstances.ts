import { NodeEnvironments } from "../src/utils/enums";

import { CLIENT_BUILD_ENVIRONMENT } from "./clientSettings";

export enum PageRoutes {
    Home = "/",
    Contact = "/contact",
    Play = "/play",
    Information = "/information",

    Account = "/account",
    Register = "/register",
    Login = "/login",

    GameTemplate = "/game/[id]",
}

// 1 hour
export const CONNECTION_TIMEOUT_SECONDS = 3600;

export function appConsoleLog(...data: unknown[]): void {
    if (CLIENT_BUILD_ENVIRONMENT === NodeEnvironments.Development) {
        console.log(...data);
    }
}
