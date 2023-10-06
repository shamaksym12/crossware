import React, { FC } from 'react';
import Container from "components/Container";
import { cls } from "utils/functions";

export type MessageItem = {
    sentBy: string,
    msg: string,
    timestamp: string
};

interface MessageProps {
    message: MessageItem;
}

const Message: FC<MessageProps> = (props: MessageProps) => {
    const { message } = props;
    const me = true;

    return (
        <Container className="messageContainer">
            <div className="messageWrap">
            <div className={cls(["message", me ? 'me' : ''])}>{message.msg}</div>
            </div>
            <div className="info">
                <div className="time">{message.timestamp}</div>
                <div className="userName">{message.sentBy}</div>
            </div>
        </Container>
    );
};

export default Message;
