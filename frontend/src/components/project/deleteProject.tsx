import React, { FC, useState } from "react";
import { Form, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import Message from "./message";
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { removePorject } from "redux/app/actions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface DeleteProjectProps {
    show: boolean;
    proid: string;
    companyid: string;
    hideModal: () => void;
}

const DeleteProject: FC<DeleteProjectProps> = (props: DeleteProjectProps) => {
    const { show, proid, companyid, hideModal } = props;

    const [visibleSentMessage, setVisibleSentMessage] = useState(false);
    const [visibleCompletedMessage, setVisibleCompletedMessage] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector(
        getAppState
    );

    const { t } = useTranslation();

    const delProject = () => {
        dispatch(removePorject(proid, token, companyid))
        hideModal();
        setVisibleSentMessage(true);
        navigate('/');
    };

    const hideSentMessage = () => {
        setVisibleSentMessage(false);
        setVisibleCompletedMessage(true);
        navigate('/');
    };

    const hideCompletedMessage = () => {
        setVisibleCompletedMessage(false);
    };

    return (
        <Container className="deleteFormContainer">
            <Modal className="deleteFormContainer" show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{t("del.ProjectTitle")}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={hideModal} >
                                {t("btn.No")}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={delProject}>
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

export default DeleteProject;