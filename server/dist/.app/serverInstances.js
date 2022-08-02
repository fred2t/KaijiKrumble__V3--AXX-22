"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConsoleLog = void 0;
const enums_1 = require("../lib/utils/enums");
const serverSettings_1 = require("./serverSettings");
function appConsoleLog(...data) {
    if (serverSettings_1.SERVER_BUILD_ENVIRONMENT === enums_1.NodeEnvironments.Development) {
        console.log(...data);
    }
}
exports.appConsoleLog = appConsoleLog;
