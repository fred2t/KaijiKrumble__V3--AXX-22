"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const serverInstances_1 = require("../../.app/serverInstances");
const namespaces_1 = require("../utils/namespaces");
const WS_1 = require("../utils/namespaces/WS");
const AppRoom_1 = __importDefault(require("./abstract/AppRoom"));
class KaijiRoom extends AppRoom_1.default {
    constructor({ users, openToJoin, friendOnly, }) {
        super({ users, openToJoin });
        this.friendOnly = friendOnly;
    }
    notifyUserQuitGame(leaverId) {
        this.users.forEach((userSocket) => {
            if (userSocket.readyState !== ws_1.default.OPEN)
                return (0, serverInstances_1.appConsoleLog)("not ready");
            if (userSocket.id === leaverId)
                return;
            (0, WS_1.appWSSend)(userSocket, namespaces_1.WS.EventNames.EndOpponentQuitGame, null);
        });
    }
    getUser(id) {
        return this.users.find((user) => user.id === id);
    }
    addUser(user) {
        this.users.push(user);
    }
    closeToNewcomers() {
        this.openToJoin = false;
    }
    removeUser(socket) {
        if (!socket.kaijiGame.roomId)
            return (0, serverInstances_1.appConsoleLog)("is not in game");
        this.users = this.users.filter((userSocket) => userSocket.id !== socket.id);
    }
}
exports.default = KaijiRoom;
