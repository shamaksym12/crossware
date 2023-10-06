import React, { FC, useState } from 'react';
import Container from 'components/Container';
import Modal from "react-bootstrap/Modal";
import { Button, Form, Input } from "antd";
import Message from "components/project/message";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app";

interface EditProjectProps {
  show: boolean;

  hideModal: () => void;
}

const CreateProject:  FC<EditProjectProps> = (props: EditProjectProps) => {

  const { t } = useTranslation();

  const [visibleCompletedMessage, setVisibleCompletedMessage] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')!);
  const { token } = useSelector(
    getAppState
  );

  const API_URL = process.env.API_URL;

  const onFinish = (values: any) => {
    axios.post(`${API_URL}/api/project/`, {
      title: values.title,
      address: values.address,
      company_id: `${user.company_id}`,
      owner_user_id: `${user.id}`,
    }, { headers: { 'x-access-token': token } }).then(res => {
      props.hideModal();
      setVisibleCompletedMessage(true);
      console.log('Success:', values);
    }).catch(err => {
      console.log(err);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const hideCompletedMessage = () => {
    setVisibleCompletedMessage(false);
  };

  return(
    <Container className="addProfileFormContainer">
      <Modal show={props.show} onHide={props.hideModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>{t("register.ProjectTitle")}</h4>
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
              name="title"
              label={t("register.ProjectInfo")}
              rules={[{ required: true, message: t("edit.ProjectInfoError") }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="address"
              label={t("register.ProjectAddress")}
              rules={[{ required: true, message: t("edit.ProjectAddressError") }]}
            >
              <Input type="text"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {t("project.register")}
              </Button>
            </Form.Item>
          </Form>
        </Modal.Body>
      </Modal>
      <Message show={visibleCompletedMessage} hideModal={hideCompletedMessage} content={t("register.Projectmsg")} />
    </Container>
  );
};

export default CreateProject;