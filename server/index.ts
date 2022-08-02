import { ENVS } from "./.app/serverEnvironmentVariables";
import { server } from "./lib/config/serverRoom";

server.listen(ENVS.PORT, () => {
    console.log(`Server started on port ${ENVS.PORT}`);
    console.log(`Homepage: ${ENVS.CLIENT_URL}`);
});
