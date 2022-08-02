export enum TextColourClass {
    Green = "cgreen",
    Gold = "cgold",
    Orange = "corange",
    Red = "cred",
    Miscellaneous = "cmisc",
}

export enum BackgroundClass {
    Green = "bgreen",
    Red = "bred",
}

export type TransitionStartingDirection =
    /**
     * l = left
     * r = right
     * t = top
     * b = bottom
     * tl = top left
     * tr = top right
     * bl = bottom left
     * br = bottom right
     */
    "none" | "in-place" | "l" | "r" | "t" | "b" | "tl" | "tr" | "bl" | "br";

export function addTransition<N extends HTMLElement | null>(
    intersectionObserver: IntersectionObserver | null,
    transitionStartingDirection: TransitionStartingDirection
): (node: N) => void {
    /**
     * react element ref values can be null so '| null' is required to pass the typechecker
     * otherwise it is useless
     *
     * the intersectionobserver argument is useless (*in react - not next) since this method
     * is context-specific however this is to avoid circular imports
     */

    return (node: N) => {
        if (node == null) return;
        if (transitionStartingDirection === 'none') return;

        // console.log("adding transition");
        node.classList.add("transition", `transition-${transitionStartingDirection}`);
        intersectionObserver?.observe(node);
    };
}
