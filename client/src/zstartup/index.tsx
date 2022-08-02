import useSocketConnection from "./lonely/useSocketConnection";
import useTransitionInitiator from "./lonely/useTransitionInitiator";
import SocketErrorNotification from "./lonely/SocketErrorNotification";

function InitializeApp(): JSX.Element {
    /**
     * This is moved into a separate component since the initialization
     * process involves redux which.
     *
     * This can't be done in the _app.tsx file since it would have to be
     * outside of the react-redux provider.
     *
     * This also can't be in the index.ts file in case the user enters
     * the website on a route that isn't the main landing page.
     */

    useSocketConnection();
    useTransitionInitiator();

    return (
        <>
            {/* <SocketErrorNotification /> */}
        </>
    );
}

export default InitializeApp;
