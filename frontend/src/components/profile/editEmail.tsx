import React, { FC, useState } from "react";
import { Form, Input, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import Message from "./message";
import { useTranslation } from "react-i18next";

interface EditEmailProps {
    show: boolean;
    email: string;
    hideModal: () => void;
}

const EditEmail: FC<EditEmailProps> = (props: EditEmailProps) => {
    const { show, email, hideModal } = props;

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
        <Container className="addProfileFormContainer">
            <Modal show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{t("profile.editEmailTitle")}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="addProjectForm"
                    >
                        <Form.Item
                            label={t("profile.currentEmail")}
                            name="number"
                            className="old_email"
                        >
                            <label htmlFor="">{email}</label>
                        </Form.Item>
                        <Form.Item
                            label={t("profile.newEmail")}
                            name="email"
                            rules={[{ required: true, message: t("profile.emailError"), type: 'email' }]}
                        >
                            <Input placeholder={t("login.mailAddress")} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                            {t("profile.changeBtn")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal.Body>
            </Modal>
            <Message show={visibleSentMessage} hideModal={hideSentMessage} content={t("profile.emailMsg")} />
            <Message show={visibleCompletedMessage} hideModal={hideCompletedMessage} content={t("profile.emailMsg1")} />
        </Container>
    );
};

export default EditEmail;
