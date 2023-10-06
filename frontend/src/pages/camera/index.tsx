import React, { useEffect, useState } from "react";
import Container from "components/Container";
import PictureView from "components/picture";
import Pagination from "components/pagination";
import { cls } from "utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { setMediaFilter, getMedias } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import { useTranslation } from "react-i18next";

const Camera = () => {
  const dispatch = useDispatch();
  const { mediaFilter, token } = useSelector(
    getAppState
  );

  const projects = JSON.parse(localStorage.getItem('project')!);
  if (!projects) {
    location.href = "/";
  } else {
    var project_id = projects.id;
  }

  const { t } = useTranslation();

  const handleChatBox = (type: string) => {
    dispatch(setMediaFilter({ type: type }));
  };

  useEffect(() => {
    dispatch(getMedias(token, project_id, null));
  }, []);

  return (
    <Container className="cameraContainer">
      {
        console.log("Test Message")
      }
      <ul className="tabHeader">
        <li className={cls(["tabItem", mediaFilter.type === "all" ? 'active' : ''])} onClick={() => { handleChatBox("all"); }}>{t("media.filterall")}</li>
        <li className={cls(["tabItem", mediaFilter.type === "video" ? 'active' : ''])} onClick={() => { handleChatBox("video"); }}>{t("media.filtervideo")}</li>
        <li className={cls(["tabItem", mediaFilter.type === "image" ? 'active' : ''])} onClick={() => { handleChatBox("image"); }}>{t("media.filterimg")}</li>
      </ul>
      <Pagination />
      <div className="tabContent mt-2">
        <PictureView />
      </div>
    </Container>
  );
};

export default Camera;
