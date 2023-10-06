import React, { useEffect, useState } from "react";
import Container from "components/Container";
import ProjectView from "components/project";
import { Modal } from 'antd';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import close from "assets/image/icon/close.png";
import { useTranslation } from "react-i18next";

const Home = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(
    getAppState
  );
  const { t } = useTranslation();
  return (
    <Container>
        {/* <div id="welcome" className="homeContainer">
          <h2>{t("home.welcome")}</h2>
          <div className="homeContent">
            <h5>①{t("home.welcome2")}</h5>
            <h5>②{t("home.welcome3")}</h5>
          </div>
        </div> */}

        <div id="projectboard" className="projectContainer">
          <div className="message">{t("project.Headline")}<img src={close} /></div>
          <h5>{t("project.BoardTitle")}</h5>
          <div className="tabContent mt-4">
            <ProjectView />
          </div>
        </div>
    </Container>
  );
};

export default Home;
