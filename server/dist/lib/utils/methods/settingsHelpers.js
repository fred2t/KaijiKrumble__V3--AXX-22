"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xIfDevElseY = void 0;
const serverSettings_1 = require("../../../.app/serverSettings");
const enums_1 = require("../enums");
function xIfDevElseY(ifDev, ifProd) {
    return serverSettings_1.SERVER_BUILD_ENVIRONMENT === enums_1.NodeEnvironments.Development ? ifDev : ifProd;
}
exports.xIfDevElseY = xIfDevElseY;
