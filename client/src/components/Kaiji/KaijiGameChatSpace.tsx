import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";

import useLocalStorage from "../../utils/hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { appWSSend } from "../../utils/methods/WSHelpers";
import { KeyDownKeys, LocalStorageKeys } from "../../utils/enums";
import { sendMessage } from "../../redux/slices/kaijiGameSlice";
import { Kaiji, WS } from "../../utils/namespaces";

function KaijiGameChatSpace() {
    const [message, setMessage] = useState("");
    const [messageInputHelperText, setMessageInputHelperText] = useState("");
    const [chatOpen, setChatHidden] = useLocalStorage(LocalStorageKeys.ChatOpen, false);
    const [notificationsOn, setNotificationsOn] = useLocalStorage(
        LocalStorageKeys.ChatNotificationsOn,
        true
    );
    const [messageCountSinceClose, setMessageCountSinceClose] = useState(0);

    const { socket } = useAppSelector((s) => s.ws);
    const { messages, roomAlive } = useAppSelector((s) => s.kaijiGame);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (chatOpen === true) return;

        setMessageCountSinceClose(messages.length);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatOpen]);

    const onSendMessage = () => {
        if (message.length === 0) {
            setMessageInputHelperText("Message cannot be empty");
            return;
        }

        dispatch(sendMessage(message));
        setMessage("");
        setMessageInputHelperText("");

        if (roomAlive === true) {
            appWSSend<WS.OutgoingData[WS.EventNames.PlaySendMessage]>(
                socket,
                WS.EventNames.PlaySendMessage,
                { message }
            );
        }
    };

    const swapChatOpenStatus = () => {
        setChatHidden((prevChatHidden) => !prevChatHidden);
    };

    const onTurnOffChatNotifications = () => {
        setNotificationsOn((prevNotificationsOn) => !prevNotificationsOn);
    };

    return (
        <section className="chat-space">
            <header>
                <h1 className="title">
                    <div>Chat</div>
                    {!chatOpen && notificationsOn && (
                        <Badge
                            badgeContent={messages.length - messageCountSinceClose}
                            color="primary"
                            className="chat-badge point"
                            onClick={swapChatOpenStatus}
                        />
                    )}
                </h1>

                <div className="option-btns">
                    <Button
                        variant="contained"
                        color="success"
                        className="btn"
                        onClick={swapChatOpenStatus}
                    >
                        {chatOpen ? "Hide" : "Open"}
                    </Button>
                    <Button
                        variant="contained"
                        className="btn"
                        onClick={onTurnOffChatNotifications}
                    >
                        Turn {`${notificationsOn ? "Off" : "On"}`} notifications
                    </Button>
                </div>
            </header>

            {chatOpen && (
                <>
                    <section className="new-message-container">
                        <TextField
                            label="Message"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            error={messageInputHelperText.length > 0}
                            helperText={messageInputHelperText}
                            onKeyDown={(e) => e.key === KeyDownKeys.Enter && onSendMessage()}
                        />
                        <Button variant="contained" onClick={onSendMessage}>
                            Send
                        </Button>
                    </section>

                    <div className="messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${Kaiji.MESSAGE_CLASS_MAP[message.identity]}`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default KaijiGameChatSpace;
