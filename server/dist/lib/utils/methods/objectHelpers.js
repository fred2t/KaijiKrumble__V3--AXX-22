"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConcreteObject = void 0;
function isConcreteObject(obj) {
    /**
     * Check if object and not null or undefined which are
     * considered objects with js's typeof function.
     */
    return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}
exports.isConcreteObject = isConcreteObject;
