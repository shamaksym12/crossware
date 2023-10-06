import React from "react";
import AuthBack from 'assets/image/auth-back.png';
import ResetPasswordForm from "components/resetPassword";
import Container from "components/Container";

const ResetPassword = () => {
  return (
    <Container className="container row p-0">
      <div className="col-12 col-md-6 resetPasswordContainer">
        <ResetPasswordForm />
      </div>
      <div className="col-12 col-md-6 p-0">
        <img src={AuthBack} className="authBack" />
      </div>
    </Container>
  );
};

export default ResetPassword;
