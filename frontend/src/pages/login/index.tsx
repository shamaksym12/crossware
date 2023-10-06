import React, { useEffect, useState } from "react";
import AuthBack from 'assets/image/auth-back.png';
import LoginForm from "components/login";
import Container from "components/Container";

import { getAppState } from "redux/app/selectors";

import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [visibleBar, setVisibleBar] = useState(false);

  useEffect(() => {
    setVisibleBar(false);
  }, [location.pathname]);

  return (
    <Container className="container row p-0">
      <div className="col-12 col-md-6 loginContainer">
        <LoginForm />
      </div>
      <div className="col-12 col-md-6 p-0">
        <img src={AuthBack} className="authBackImg" />
      </div>
    </Container>
  );
};

export default Login;
