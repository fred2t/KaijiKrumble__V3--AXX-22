import { isConcreteObject } from "./utils/methods/objectHelpers";

function noNullishValuesCheck<O extends object>(obj: O): void {
    /**
     * Separating null and undefined checks on purpose
     */

    for (const [key, value] of Object.entries(obj)) {
        switch (value) {
            case undefined:
                throw new Error(
                    `P: Object has undefined value for key: ${key}`
                );
            case null:
                console.warn(`P: Object has null value key, ${key}`);
        }

        // nan can't be matched with ===
        if (isNaN(value)) {
            throw new Error(`P: Object has NaN value for key: ${key}`);
        }
    }
}

function notValueNestedCheck<O extends object>(
    obj: O,
    disallowedValue: any
): void {
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
        } else if (isConcreteObject(value)) {
            notValueNestedCheck(value, disallowedValue);
        }
    }
}

export { noNullishValuesCheck, notValueNestedCheck };
