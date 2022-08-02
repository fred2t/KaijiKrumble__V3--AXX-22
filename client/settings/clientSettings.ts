import { NodeEnvironments } from "../src/utils/enums";

const CLIENT_BUILD_ENVIRONMENT = process.env.NEXT_PUBLIC_BUILD_ENVIRONMENT;

// check if environment is valid
if (Object.values(NodeEnvironments).includes(CLIENT_BUILD_ENVIRONMENT as any) === false) {
    throw new Error(`P: Invalid environment type: ${CLIENT_BUILD_ENVIRONMENT}`);
}
export { CLIENT_BUILD_ENVIRONMENT };
