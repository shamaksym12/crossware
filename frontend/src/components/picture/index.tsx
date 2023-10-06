import React, { Key } from 'react';
import Container from "components/Container";
import Filter from "./filter";
import VideoItem from "./item";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { mediafilter } from "utils/functions";
import { Media } from 'redux/app';

const PictureView = () => {
  const { medias, page, pageSize } = useSelector(
    getAppState
  );
  return (
    <Container className="pictureContainer">
      <Filter />
      <div className="contentView">
        {
          mediafilter(medias).slice((page-1) * pageSize, page * pageSize).map((data: Media) => { return <VideoItem key={data.id} data={data} />; })
        }
      </div>
    </Container>
    );
};

export default PictureView;
