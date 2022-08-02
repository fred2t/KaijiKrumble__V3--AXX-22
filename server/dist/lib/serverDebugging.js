"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notValueNestedCheck = exports.noNullishValuesCheck = void 0;
const objectHelpers_1 = require("./utils/methods/objectHelpers");
function noNullishValuesCheck(obj) {
    /**
     * Separating null and undefined checks on purpose
     */
    for (const [key, value] of Object.entries(obj)) {
        switch (value) {
            case undefined:
                throw new Error(`P: Object has undefined value for key: ${key}`);
            case null:
                console.warn(`P: Object has null value key, ${key}`);
        }
        // nan can't be matched with ===
        if (isNaN(value)) {
            throw new Error(`P: Object has NaN value for key: ${key}`);
        }
    }
}
exports.noNullishValuesCheck = noNullishValuesCheck;
function notValueNestedCheck(obj, disallowedValue) {
    /**
     * Check if object has any property with disallowed value.
     * @param obj - object to check
     * @param disallowedValue - value to check for
     * @throws Error if object has any property with disallowed value
     * @returns void
     */
    for (const [key, value] of Object.entries(obj)) {
        if (value === disallowedValue) {
            throw new Error(`object ${key} is value: ${disallowedValue}`);
        }
        else if ((0, objectHelpers_1.isConcreteObject)(value)) {
            notValueNestedCheck(value, disallowedValue);
        }
    }
}
exports.notValueNestedCheck = notValueNestedCheck;
