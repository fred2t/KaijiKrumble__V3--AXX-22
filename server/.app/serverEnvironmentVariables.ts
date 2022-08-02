import dotenv from "dotenv";
import fs from "fs";

import { ServerBuildSettings } from "../lib/types/utility";
import { notValueNestedCheck } from "../lib/serverDebugging";
import { SERVER_BUILD_ENVIRONMENT } from "./serverSettings";
import { NodeEnvironments } from "../lib/utils/enums";

dotenv.config();

const {
    PORT,

    CLIENT_URL,
} = process.env;

const ENVS: ServerBuildSettings = {
    // Number(PORT) -> P or 0 -> P: P, 0: 3001, where P=port
    PORT: Number(PORT) || 3001,

    CLIENT_URL: CLIENT_URL as string,
};
notValueNestedCheck(ENVS, undefined);

export { ENVS };
