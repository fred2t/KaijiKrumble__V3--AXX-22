function noNullishValuesCheck(obj: object): void {
    /**
     * Separating null and undefined checks on purpose
     */

    Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined) {
            throw new Error(`P: Object has undefined value for key: ${key}`);
        } else if (obj[key] === null) {
            // eslint-disable-next-line no-console
            console.warn(`P: Object has null value key, ${key}`);
        }
    });
}

export { noNullishValuesCheck };
