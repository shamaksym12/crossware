import React, { useEffect, useState } from "react";
import Container from "components/Container";
import ProjectView from "components/project";
import ProjectItemView from "components/project/projectBoard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import close from "assets/image/icon/close.png";
import { useTranslation } from "react-i18next";
import AddProject from "components/project/addProject";

const Project = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(
    getAppState
  );
  const { t } = useTranslation();

  return (
    <Container className="projectContainer">
      <div className="message">{t("project.Headline")}<img src={close} /></div>
      <h5>{t("project.BoardTitle")}</h5>
      <div className="tabContent mt-4">
        <AddProject />
        <ProjectView />
      </div>
    </Container>
  );
};

export default Project;