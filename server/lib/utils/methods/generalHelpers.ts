export function JSONParsedOrReturn(toParse: string): string | Record<string, unknown> {
    try {
        return JSON.parse(toParse);
    } catch (e) {
        return toParse;
    }
}

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function randomChoice<T extends string | unknown[]>(arr: T): T[number] {
    return arr[getRandomInt(arr.length - 1)];
}

export function simpleUUID(length: number) {
    const lcLetsNumbs = "abcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from({ length }, () => randomChoice(lcLetsNumbs)).join("");
}

export function coinFlip(): boolean {
    return Math.random() < 0.5;
}

export function appJSONStringify<T>(obj: T) {
    return JSON.stringify(obj);
}
