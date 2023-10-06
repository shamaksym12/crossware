import React, { useEffect, useState } from "react";
import { Form, Input, Button } from 'antd';
import Container from "components/Container";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
    const [step, setStep] = useState('email-verification');

    const { token } = useSelector(
        getAppState
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (token) navigate('/');
    }, [token]);

    const toLogin = () => {
        navigate('/login');
    };

    const onEmailVerificationFinish = async (values: any) => {
        setStep('code-verification');
    };

    const onCodeVerificationFinish = async (values: any) => {
        setStep('reset-password');
    };
    

    const onResetPasswordFinish = async (values: any) => {
        
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const validatePassword = (rule: any, value: string, callback: any) => {
        if (!value || value.length < 6) {
            callback("パスワードは6文字以上にする必要があります!");
        } else {
            callback();
        }
    };

    return (
        <Container className="resetPasswordFormContainer">
            <h2 className="resetPasswordTitle">パスワードの再設定</h2>
            {step === 'email-verification' && <Form
                name="emailVerificationForm"
                onFinish={onEmailVerificationFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="メールアドレスを入力してください。"
                    name="email"
                    rules={[{ required: true, message: 'メールアドレスを入力して下さい', type: 'email' }]}
                >
                    <Input placeholder="メールアドレス" />
                </Form.Item>
                <h6 className="description">ご登録されているメールアドレスに認証番号を送付します。</h6>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        次へ
                    </Button>
                </Form.Item>
            </Form>}
            {step === 'code-verification' && <Form
                name="codeVerificationForm"
                onFinish={onCodeVerificationFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <h6 className="description">ご登録されているメールアドレスに送付された <br />認証番号を入力してください。</h6>
                <Form.Item
                    name="code"
                    rules={[{ required: true, message: '認証番号を入力してください' }]}
                >
                    <Input placeholder="" />
                </Form.Item>
                <h6 className="description">認証番号の有効期限は60分となります。認証番号が届かない場合は、<a href="#" className="contact-link">こちらへ</a>お問い合わせください。</h6>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        パスワードの再設定に進む
                    </Button>
                </Form.Item>
            </Form>}
            {step === 'reset-password' && <Form
                name="resetPasswordForm"
                onFinish={onResetPasswordFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="新しいパスワードを入力"
                    name="password"
                    rules={[{ required: true, message: 'パスワードを入力して下さい' }, { validator: validatePassword }]}
                >
                    <Input.Password placeholder="パスワード" />
                </Form.Item>
                <h6 className="description">※半角英数字を組み合わせて8~64文字</h6>
                <Form.Item
                    label="新しいパスワードを入力（確認）"
                    name="repassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[{ required: true, message: 'パスワードを確認してください' }, ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                            }
                            return Promise.reject(new Error('パスワードが違います。'));
                        },
                    })]}
                >
                    <Input.Password placeholder="パスワード" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        設定する
                    </Button>
                </Form.Item>
            </Form>}
            <h4 className="toLogin" onClick={toLogin}>ログイン画面へ戻る</h4>
        </Container>
    );
};

export default ResetPasswordForm;
