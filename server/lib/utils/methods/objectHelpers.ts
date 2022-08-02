function isConcreteObject(obj: unknown): boolean {
    /**
     * Check if object and not null or undefined which are
     * considered objects with js's typeof function.
     */

    return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}

export { isConcreteObject };
