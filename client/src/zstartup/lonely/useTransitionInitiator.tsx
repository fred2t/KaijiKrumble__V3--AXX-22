import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setTransitionController } from "../../redux/slices/aestheticSlice";

export default function useTransitionInitiator(): void {
    /**
     * Used for transitions on page load ---------------------------------------------------
     * Each transition will be given a code, ex. l, r, tr etc.
     * Where l = left, r = right, tr = top right, etc
     * 
     * This is to add smooth transitions without breaking website layout between each step.
     * `transform` doesn't work due to breaking layout during animations.

     * This format also allows for an abstraction wherein adding transitions involves:
     * lfr: ref={addTransition('r')}
     * tfb: ref={addTransition('tr')}
     * for each react element doing the translating.
     
     * To prevent class overlap, 'transition-' will be prefixed to every node using
     * the ref callback behind the scenes.
    */

    /**
     * Using a hook instead of a dedicated intersection observer stored in constants.ts
     *
     * since next -- unlike react,
     * will execute function components when the browser isn't loaded.
     * Intersection observer is not available outside the browser. This strategy
     * allows having access to the intersection observer grabbing it after waiting
     * for the browser to load.
     */

    const transitionController = useAppSelector((state) => state.aesthetic.transitionController);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // console.log("intersecting");

                        entry.target.classList.add("start-transition");
                        transitionController?.unobserve(entry.target);
                    } else {
                        // console.log("not intersecting");
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        dispatch(setTransitionController(intersectionObserver));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
}
