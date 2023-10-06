import React, { useEffect, useState } from "react";
import Container from "components/Container";
import TitleView from "components/titleView";
import Pagination from "components/pagination";
import { useDispatch } from "react-redux";
import { setMediaFilter, getReports } from "redux/app/actions";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";

const Report = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(
    getAppState
  );

  const projects = JSON.parse(localStorage.getItem('project')!);
  if (!projects) {
    location.href = "/";
  } else {
    var project_id = projects.id;
  }

  const handleChatBox = (type: string) => {
    dispatch(setMediaFilter({ type: type }));
  };

  useEffect(() => {
    dispatch(getReports(token, project_id, null));
  }, []);


  return (
    <Container className="reportContainer">
      <Pagination />
      <div className="tabContent mt-4">
        <TitleView />
      </div>
    </Container>
  );
};

export default Report;
