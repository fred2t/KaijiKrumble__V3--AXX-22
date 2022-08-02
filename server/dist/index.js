"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverEnvironmentVariables_1 = require("./.app/serverEnvironmentVariables");
const serverRoom_1 = require("./lib/config/serverRoom");
serverRoom_1.server.listen(serverEnvironmentVariables_1.ENVS.PORT, () => {
    console.log(`Server started on port ${serverEnvironmentVariables_1.ENVS.PORT}`);
    console.log(`Homepage: ${serverEnvironmentVariables_1.ENVS.CLIENT_URL}`);
});
