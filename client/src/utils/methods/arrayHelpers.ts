/**
 * Doing them as functions instead of adding them to the Array prototype
 * because it makes the importing implicit and;
 *
 * "Array prototype is read only, properties should not be added.eslint(no-extend-native)"
 */

export function shuffle<T extends unknown[]>(array: T) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}
