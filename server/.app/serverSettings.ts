import cors from "cors";
import dotenv from "dotenv";
import { NodeEnvironments } from "../lib/utils/enums";

dotenv.config();
const { SERVER_BUILD_ENVIRONMENT } = process.env;

// check if environment is valid
if (Object.values(NodeEnvironments as object).includes(SERVER_BUILD_ENVIRONMENT) === false) {
    throw new Error(`Invalid environment type: ${SERVER_BUILD_ENVIRONMENT}`);
}
export { SERVER_BUILD_ENVIRONMENT };

export const CORS_SETTINGS: cors.CorsOptions = { origin: "http://localhost:3000" };
