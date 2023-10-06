import React, { FC, useEffect, useState } from "react";
import { Form, Input, Button } from 'antd';
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";
import { signup } from "redux/app/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { useTranslation } from "react-i18next";

interface SignupProps {
    show: boolean;
    hideModal: () => void;
}

const Signup: FC<SignupProps> = (props: SignupProps) => {
    const { show, hideModal } = props;
    
    const { t } = useTranslation();

    const [status, setStatus] = useState('');

    const dispatch = useDispatch();
    const { signupStatus } = useSelector(
        getAppState
    );

    useEffect(() => {
        setStatus('');
    }, []);

    useEffect(() => {
        setStatus(signupStatus);

        if (signupStatus === "success") hideModal();
    }, [signupStatus]);

    const onFinish = async (values: any) => {
        await dispatch(signup(values));
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const validatePassword = (rule: any, value: string, callback: any) => {
        if (!value || value.length < 6) {
            callback(t("signup.validatePassword"));
        } else {
            callback();
        }
    };

    const formChange = () => {
        setStatus('success');
    };

    return (
        <Container className="signupFormContainer">
            <Modal show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{t("signup.register")}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="signupForm"
                        onValuesChange={formChange}
                    >
                        <div className="userName">
                            <label className="mb-2">{t("signup.name")}</label>
                            <div className="row">
                                <Form.Item
                                    name="first_name"
                                    rules={[{ required: true, message: t("signup.LnameError") }]}
                                    className="col-12 col-md-6 firstName"
                                >
                                    <Input placeholder={t("signup.Lname")} />
                                </Form.Item>
                                <Form.Item
                                    name="last_name"
                                    rules={[{ required: true, message: t("signup.FnameError") }]}
                                    className="col-12 col-md-6 secondName"
                                >
                                    <Input placeholder={t("signup.Fname")} />
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item
                            label={t("signup.phone")}
                            name="phone_number"
                            rules={[{ required: true, message: t("signup.phoneError") }]}
                        >
                            <Input placeholder={t("signup.phone")} />
                        </Form.Item>
                        <Form.Item
                            label={t("signup.company")}
                            name="company"
                            rules={[{ required: true, message: t("signup.companyError") }]}
                        >
                            <Input placeholder={t("signup.company")} />
                        </Form.Item>
                        <Form.Item
                            label={t("login.mailAddress")}
                            name="email"
                            rules={[{ required: true, message: t("login.mailAddressError"), type: 'email' }]}
                        >
                            <Input placeholder={t("login.mailAddress")} />
                        </Form.Item>
                        <Form.Item
                            label={ t("login.password") }
                            name="password"
                            rules={[{ required: true, message: t("login.passwordError") }, { validator: validatePassword }]}
                        >
                            <Input.Password placeholder={ t("login.password") } />
                        </Form.Item>
                        <Form.Item
                            label={ t("signup.repassword") }
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
                            <Input.Password placeholder={ t("login.password") } />
                        </Form.Item>
                        {status !== "success" && <div role="alert" className="validation_error">{status}</div>}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                            {t('signup.signup')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Signup;
