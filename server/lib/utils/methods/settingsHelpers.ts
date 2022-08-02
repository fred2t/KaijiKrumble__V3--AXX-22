import { SERVER_BUILD_ENVIRONMENT } from "../../../.app/serverSettings";
import { NodeEnvironments } from "../enums";

function xIfDevElseY<T>(ifDev: T, ifProd: T): T {
    return SERVER_BUILD_ENVIRONMENT === NodeEnvironments.Development ? ifDev : ifProd;
}

export { xIfDevElseY };
