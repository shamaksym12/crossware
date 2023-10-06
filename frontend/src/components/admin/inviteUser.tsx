import React, { FC, useState } from "react";
import { Form, Input, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import Message from "./message";
import { useTranslation } from "react-i18next";

interface InviteUserProps {
    show: boolean;
    hideModal: () => void;
}

const InviteUser: FC<InviteUserProps> = (props: InviteUserProps) => {
    const { show, hideModal } = props;

    const [visibleSentMessage, setVisibleSentMessage] = useState(false);
    const [visibleCompletedMessage, setVisibleCompletedMessage] = useState(false);

    const { t } = useTranslation();

    const onFinish = (values: any) => {
        console.log('Success:', values);

        hideModal();

        setVisibleSentMessage(true);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const hideSentMessage = () => {
        setVisibleSentMessage(false);
        setVisibleCompletedMessage(true);
    };

    const hideCompletedMessage = () => {
        setVisibleCompletedMessage(false);
    };

    return (
        <Container className="inviteFormContainer">
            <Modal className="inviteFormContainer" show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{t("invite.Title")}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="col-75"
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: t("profile.emailError"), type: 'email' }]}
                        >
                            <Input placeholder={t("login.mailAddress")} />
                        </Form.Item>
                        <div className="button">
                            <Form.Item>
                                <Button type="primary" htmlType="submit" onClick={hideModal} >
                                    {t("invite.Cancel")}
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {t("invite.Invite")}
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Message show={visibleSentMessage} hideModal={hideSentMessage} content={t("profile.emailMsg")} />
            <Message show={visibleCompletedMessage} hideModal={hideCompletedMessage} content={t("profile.emailMsg1")} />
        </Container>
    );
};

export default InviteUser;