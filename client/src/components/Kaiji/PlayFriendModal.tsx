import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useAppSelector } from "../../redux/hooks";
import { WS } from "../../utils/namespaces";
import { appConsoleLog } from "../../../settings/clientInstances";
import TransitionModal from "../flexible/TransitionModal";
import { appWSSend } from "../../utils/methods/WSHelpers";

interface Props {
    open: boolean;
    onClose: () => void;
}

function PlayFriendModal({ open, onClose }: Props): JSX.Element {
    const [linkForFriendToJoin, setLinkForFriendToJoin] = useState("");

    const { privateRoomId } = useAppSelector((s) => s.kaijiGame);

    useEffect(() => {
        setLinkForFriendToJoin(`${window.location.origin}/game/${privateRoomId}`);
    }, [privateRoomId]);

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(linkForFriendToJoin);
    };

    return (
        <TransitionModal className="play-friend-request-modal" open={open} onClose={onClose}>
            <div className="create-game-page">
                <header>
                    <Button
                        variant="contained"
                        color="error"
                        className="stretch-w"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </header>

                <div className="setup-container">
                    <div>Get your friend to visit:</div>
                    <h3>
                        {privateRoomId ? (
                            <>
                                <Button
                                    variant="contained"
                                    className="stretch-w"
                                    endIcon={<ContentCopyIcon />}
                                    startIcon={<ContentCopyIcon />}
                                    onClick={copyLinkToClipboard}
                                >
                                    {linkForFriendToJoin}
                                </Button>
                            </>
                        ) : (
                            <div>Getting link...</div>
                        )}
                    </h3>
                </div>
            </div>
        </TransitionModal>
    );
}

export default PlayFriendModal;
