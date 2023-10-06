import React, { FC, useState } from "react";
import { Form, Input, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import Message from "./message";
import { useTranslation } from "react-i18next";

interface EditEmailProps {
    show: boolean;
    hideModal: () => void;
}

const EditPassword: FC<EditEmailProps> = (props: EditEmailProps) => {
    const { show, hideModal } = props;

    const [visibleCompletedMessage, setVisibleCompletedMessage] = useState(false);

    const { t } = useTranslation();

    const onFinish = (values: any) => {
        console.log('Success:', values);

        hideModal();

        setVisibleCompletedMessage(true);
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const hideCompletedMessage = () => {
        setVisibleCompletedMessage(false);
    };

    const validatePassword = (rule: any, value: string, callback: any) => {
        if (!value || value.length < 6) {
            callback(t("signup.validatePassword"));
        } else {
            callback();
        }
    };

    return (
        <Container className="addProfileFormContainer">
            <Modal show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{t("profile.changePswdTitle")}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        name="basic"
                        initialValues={{ old_password: "********" }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="addProjectForm editPasswordForm"
                    >
                        <Form.Item
                            label={t("profile.currentPswd")}
                            name="old_password"
                            rules={[{ required: true, message: t("profile.currentPswdError") }]}
                        >
                            <Input type="password" placeholder={t("profile.currentPswd")} value="12345678" />
                        </Form.Item>
                        <Form.Item
                            label={t("profile.newPswd")}
                            name="password"
                            rules={[{ required: true, message: t("login.passwordError") }, { validator: validatePassword }]}
                        >
                            <Input.Password placeholder={t("profile.newPswdPlaceholder")} />
                        </Form.Item>
                        <Form.Item
                            label={t("profile.newPswdRetype")}
                            name="repassword"
                            dependencies={['password']}
                            hasFeedback
                            rules={[{ required: true, message: t("signup.repasswordError") }, ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error(t("signup.repasswordError2")));
                                },
                            })]}
                        >
                            <Input.Password placeholder="" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                            {t("profile.changeBtn")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal.Body>
            </Modal>
            <Message show={visibleCompletedMessage} hideModal={hideCompletedMessage} content={t("profile.emailMsg1")} />
        </Container>
    );
};

export default EditPassword;
