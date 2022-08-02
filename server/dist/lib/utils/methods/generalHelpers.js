"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appJSONStringify = exports.coinFlip = exports.simpleUUID = exports.randomChoice = exports.getRandomInt = exports.JSONParsedOrReturn = void 0;
function JSONParsedOrReturn(toParse) {
    try {
        return JSON.parse(toParse);
    }
    catch (e) {
        return toParse;
    }
}
exports.JSONParsedOrReturn = JSONParsedOrReturn;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
exports.getRandomInt = getRandomInt;
function randomChoice(arr) {
    return arr[getRandomInt(arr.length - 1)];
}
exports.randomChoice = randomChoice;
function simpleUUID(length) {
    const lcLetsNumbs = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => randomChoice(lcLetsNumbs)).join("");
}
exports.simpleUUID = simpleUUID;
function coinFlip() {
    return Math.random() < 0.5;
}
exports.coinFlip = coinFlip;
function appJSONStringify(obj) {
    return JSON.stringify(obj);
}
exports.appJSONStringify = appJSONStringify;
