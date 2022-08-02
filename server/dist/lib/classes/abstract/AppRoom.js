"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalHelpers_1 = require("../../utils/methods/generalHelpers");
class AppRoom {
    constructor({ users, openToJoin }) {
        this.id = (0, generalHelpers_1.simpleUUID)(10);
        this.users = users;
        this.openToJoin = openToJoin;
    }
}
exports.default = AppRoom;
