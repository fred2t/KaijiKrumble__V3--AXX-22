import { NodeEnvironments } from "../lib/utils/enums";
import { SERVER_BUILD_ENVIRONMENT } from "./serverSettings";

export function appConsoleLog(...data: any[]): void {
    if (SERVER_BUILD_ENVIRONMENT === NodeEnvironments.Development) {
        console.log(...data);
    }
}
