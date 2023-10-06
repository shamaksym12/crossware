import React, { useEffect, useState } from "react";
import { Form, Input, Button } from 'antd';
import Logo from 'assets/image/icon/logo.png';
import FooterLogo from 'assets/image/icon/footer-logo.png';
import Signup from "components/signup";
import Container from "components/Container";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import { useNavigate } from "react-router-dom";
import { Select } from 'antd';
import { useTranslation } from "react-i18next";

const LoginForm = () => {
    const [visibleSignupModal, setVisibleSignupModal] = useState(false);
    const [status, setStatus] = useState('');
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const { token, loginStatus } = useSelector(
        getAppState
    );
    const navigate = useNavigate();

    const languages = [
        { value: 'ja', text: "Japanese" },
        { value: 'en', text: "English" },
    ]

    const handleLanguage = (value: string) => {
        i18n.changeLanguage(value);
    };

    const { Option } = Select;

    useEffect(() => {
        setStatus('');

        if (token) navigate('/');
    }, [token]);

    useEffect(() => {
        setStatus(loginStatus);

        if (loginStatus === "success") navigate('/');
    }, [loginStatus]);

    const showSignupModal = () => {
        setVisibleSignupModal(true);
    };

    const hideSignupModal = () => {
        setVisibleSignupModal(false);
    };

    const onFinish = async (values: any) => {
        await dispatch(login(values));
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const formChange = () => {
        setStatus('success');
    };

    return (
        <Container className="loginFormContainer">
            <Link to="/" className="logoContainer">
                <img src={Logo} alt="" />
            </Link>
            <h2 className="loginTitle">{t("login.loginTitle")}</h2>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                onValuesChange={formChange}
            >
                <Form.Item
                    label={t("login.mailAddress")}
                    name="email"
                    rules={[{ required: true, message: t("login.mailAddressError"), type: 'email' }]}
                >
                    <Input placeholder={t("login.mailAddress")} />
                </Form.Item>
                <Form.Item
                    label={t("login.password")}
                    name="password"
                    rules={[{ required: true, message: t("login.passwordError") }]}
                >
                    <Input.Password placeholder={t("login.password")} />
                </Form.Item>
                <Form.Item
                    label={t("login.Code")}
                    name="company_code"
                    className="code"
                >
                    <Input placeholder={t("login.Code")} onInput={(e) => e.currentTarget.value = ("" + e.currentTarget.value).toUpperCase()} />
                </Form.Item>
                <span className="span">※{t("login.CodeText")}</span>
                {status !== "success" && <div role="alert" className="validation_error">{status}</div>}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {t("login.login")}
                    </Button>
                </Form.Item>
            </Form>
            <h4 className="toRegister" onClick={showSignupModal}>{t("login.register")}</h4>
            <h6 className="forgetPassword">{t("login.ForgetPassword")}</h6>
            <div className="footerLogoContainer">
                <img src={FooterLogo} alt="" />

                <div className="lng">
                    <Select className="Select" defaultValue={i18n.language} onChange={handleLanguage} tabIndex={1} placeholder="Locale">
                        <Option className="Option" key="default" value="default"><span className="material-symbols-outlined">language</span> Language</Option>
                        {languages.map((language) => (
                            <Option key={language.value} value={language.value}>
                                {language.text}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
            <Signup show={visibleSignupModal} hideModal={hideSignupModal} />
        </Container>
    );
};

export default LoginForm;
