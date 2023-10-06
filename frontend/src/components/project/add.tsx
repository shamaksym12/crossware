import React, { FC } from "react";
import { Form, Input, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import { useDispatch, useSelector } from "react-redux";
import { addMember, editMember } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import { Member } from "redux/app/reducer";
import { QRCodeSVG } from 'qrcode.react';

interface AddProjectProps {
    show: boolean;
    action: string;
    member: Member;
    hideModal: () => void;
}

const AddProject: FC<AddProjectProps> = (props: AddProjectProps) => {
    const { show, hideModal, action, member } = props;
    const dispatch = useDispatch();
    const { token } = useSelector(
        getAppState
    );

    const API_URL = process.env.API_URL;

    const user = JSON.parse(localStorage.getItem('user')!);
    const project = JSON.parse(localStorage.getItem('project')!);

    const onFinish = (values: any) => {
        values = {
            ...values,
            company_id: user.company_id,
            project_id: project.project_id
        }
        if (action === "add") dispatch(addMember(values, token));
        else {
            values.id = member.id;
            console.log(values, 'values')
            dispatch(editMember(values, token));
        }
        hideModal();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Container className="addProjectFormContainer">
            <Modal show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {action === 'add' ? <h4>プロジェクトにメンバーを追加する</h4> : <h4>プロジェクトメンバーを編集する</h4>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        name="basic"
                        initialValues={member}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="addProjectForm"
                    >
                        <Form.Item
                            label="ヘルメット 番号"
                            name="helmetNumber"
                            rules={[{ required: true, message: 'ヘルメット番号を入力して下さい' }]}
                        >
                            <Input placeholder="CW-SR-03" />
                        </Form.Item>
                        <Form.Item
                            label="名前"
                            name="name"
                            rules={[{ required: true, message: '名前を入力して下さい' }]}
                        >
                            <Input placeholder="鈴木 アキラ" />
                        </Form.Item>
                        <Form.Item
                            label="チーム"
                            name="team"
                            rules={[{ required: true, message: 'チーム名を入力して下さい' }]}
                        >
                            <Input placeholder="土台チーム" />
                        </Form.Item>
                        <Form.Item
                            label="電話番号"
                            name="phoneNumber"
                            rules={[{ required: true, message: '電話番号を入力して下さい' }]}
                        >
                            <Input placeholder="050-0000-0000" />
                        </Form.Item>
                        <Form.Item
                            label="メール"
                            name="email"
                            rules={[{ required: true, message: 'メールアドレスを入力して下さい', type: 'email' }]}
                        >
                            <Input placeholder="name@domain.com" />
                        </Form.Item>
                        <Form.Item>
                            {action === 'add' || member && <QRCodeSVG value={`${API_URL}/api/helmet/${member.id}/project`} />}
                        </Form.Item>
                        <Form.Item>
                            <div className="btnWrap">
                                <Button type="primary" htmlType="submit">
                                    {action === 'add' ? "追加する" : "保存する"}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>

                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AddProject;