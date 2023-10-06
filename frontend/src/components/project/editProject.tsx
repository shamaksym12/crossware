import React, { FC, useState } from "react";
import { Form, Input, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import Message from "./message";
import { useTranslation } from "react-i18next";

interface EditProjectProps {
    show: boolean;
    projectname: string;
    projectaddress: string;

    hideModal: () => void;
}

const EditProject: FC<EditProjectProps> = (props: EditProjectProps) => {
    const { show, projectname, projectaddress, hideModal } = props;

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
                        <h4>{t("edit.ProjectTitle")}</h4>
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
                            label={t("edit.ProjectInfo")}
                            name="number"
                            //className="old_email"
                            rules={[{ required: true, message: t("edit.ProjectInfoError") }]}
                        >
                            <Input type="text" placeholder={projectname} />
                        </Form.Item>
                        <Form.Item
                            label={t("edit.ProjectAddress")}
                            name="email"
                            rules={[{ required: true, message: t("edit.ProjectAddressError") }]}
                        >
                            <Input type="text" placeholder={projectaddress} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                            {t("profile.changeBtn")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal.Body>
            </Modal>
            <Message show={visibleSentMessage} hideModal={hideSentMessage} content={t("del.Projectmsg")} />
            <Message show={visibleCompletedMessage} hideModal={hideCompletedMessage} content={t("del.Projectmsg")} />
        </Container>
    );
};

export default EditProject;
