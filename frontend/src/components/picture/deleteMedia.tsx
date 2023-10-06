import React, { FC, useEffect, useState } from "react";
import { Form, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import Message from "../project/message";
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { deleteMedia, setIsDeleting } from "redux/app/actions";
import { useTranslation } from "react-i18next";

interface DeleteMediaProps {
    show: boolean;
    url: string;
    hideModal: () => void;
}

const DeleteMedia: FC<DeleteMediaProps> = (props: DeleteMediaProps) => {
    const { show, url, hideModal } = props;

    const [visibleSentMessage, setVisibleSentMessage] = useState(false);
    const dispatch = useDispatch();

    const { token, isDeleting } = useSelector(
        getAppState
    );

    const { t } = useTranslation();

    const showSentMessage = () => {
        hideModal();
        setVisibleSentMessage(true);
    };

    const hideSentMessage = () => {
        setVisibleSentMessage(false);
        location.reload();
    };

    const projects = JSON.parse(localStorage.getItem('project')!);
    const project_id = projects.id;

    const deleteItem = () => {
        dispatch(setIsDeleting(true));
        dispatch(deleteMedia(url, token, project_id, showSentMessage))
    };

    return (
        <Container className="deleteFormContainer">
            <Modal className="deleteFormContainer" show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{t("del.DataTitle")}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isDeleting} onClick={hideModal} >
                                {t("btn.No")}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isDeleting} onClick={deleteItem}>
                                {t("btn.Yes")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal.Body>
            </Modal>
            <Message show={visibleSentMessage} hideModal={hideSentMessage} content={t("del.Projectmsg")} />
        </Container>
    );
};

export default DeleteMedia;