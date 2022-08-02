export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomChoice<T extends string | unknown[]>(arr: T): T[number] {
    return arr[getRandomInt(arr.length - 1)];
}

export function JSONParsedOrReturn(toParse: string): string | Record<string, unknown> {
    try {
        return JSON.parse(toParse);
    } catch (e) {
        return toParse;
    }
}

export function appJSONStringify<T>(obj: T) {
    return JSON.stringify(obj);
}
