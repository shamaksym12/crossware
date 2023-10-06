import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";

interface MessageProps {
    show: boolean;
    content: string;
    hideModal: () => void;
}

const Message: FC<MessageProps> = (props: MessageProps) => {
    const { show, content, hideModal } = props;

    return (
        <Container className="deleteProjectFormContainer">
            <Modal show={show} onHide={hideModal} size="sm">
                <Modal.Body>
                    <div className="deleteContent">{content}</div>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Message;
