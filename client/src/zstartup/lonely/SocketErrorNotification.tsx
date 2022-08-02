import React, { useEffect, useState } from "react";

import TransitionModal from "../../components/flexible/TransitionModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reportErrorStatus } from "../../redux/slices/wsSlice";

export default function SocketErrorNotification() {
    const [openWSErrorModal, setOpenWSErrorModal] = useState(false);

    const { errored } = useAppSelector((s) => s.ws);

    const dispatch = useAppDispatch();

    useEffect(() => {
        // no pointing doing work since there's no error to show
        if (errored === false) return;

        setOpenWSErrorModal(errored || true);
    }, [errored]);

    const closeWSErrorModal = () => {
        setOpenWSErrorModal(false);

        // set to false so useEffect will trigger again the next time
        // there's an error
        dispatch(reportErrorStatus(false));
    };

    return (
        <TransitionModal
            open={openWSErrorModal}
            onClose={closeWSErrorModal}
            className="socket-error-modal"
        >
            <h1 className="message">Something went wrong. Attempting fixes.</h1>
        </TransitionModal>
    );
}
