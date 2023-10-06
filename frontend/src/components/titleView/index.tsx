import React, { Key } from 'react';
import Container from "components/Container";
import TitleItem from "./item";
import Filter from "./filter";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { reportfilter } from "utils/functions";
import { Report } from 'redux/app';

const TitleView = () => {
  const { reports, page, pageSize } = useSelector(
    getAppState
  );
  return (
    <Container className="mainContainer">
      <Filter />
      <div className="titleViewContainer">
        {
          reportfilter(reports).slice((page-1) * pageSize, page * pageSize).map((data: Report) => { return <TitleItem key={data.id} data={data} />; })
        }
      </div>
    </Container>
  );  
};

export default TitleView;