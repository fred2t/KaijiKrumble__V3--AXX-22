import { ClientBuildSettings } from "../src/types/utility";
import { noNullishValuesCheck } from "../src/clientDebugging";

const { NEXT_PUBLIC_BASE_URL } = process.env;

const ENVS: ClientBuildSettings = {
    BASE_URL: NEXT_PUBLIC_BASE_URL as string,
    WS_BASE_URL: NEXT_PUBLIC_BASE_URL?.replace("https://", "wss://").replace(
        "http://",
        "ws://"
    ) as string,
};
noNullishValuesCheck(ENVS);

export { ENVS };
