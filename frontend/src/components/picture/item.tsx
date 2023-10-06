import React, { FC, useRef, useState } from 'react';
import Container from "components/Container";
import Checked from "assets/image/icon/checked.png";
import Unchecked from "assets/image/icon/unchecked.png";
import VideoPlay from "assets/image/icon/video-play.png";
import { Media } from 'redux/app';
import { useDispatch, useSelector } from "react-redux";
import { toggleVideoChecked, setVisibleDetailModal, setSelectedMedia, downloadMedias } from "redux/app/actions";
import { cls } from "utils/functions";
import { getAppState } from "redux/app/selectors";
import { OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import DeleteMedia from 'components/picture/deleteMedia';

interface ItemProps {
  data: Media;
}

const PictureView: FC<ItemProps> = (props: ItemProps) => {
  const { data } = props;
  const dispatch = useDispatch();
  const { search, token, isDeleting, isDownloading } = useSelector(
    getAppState
  );

  const projects = JSON.parse(localStorage.getItem('project')!);
  const project_id = projects.id;

  const [visibleOverlap, setVisibleOverlap] = useState(true);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);

  const { t } = useTranslation();

  const showDeleteModal = () => {
    setVisibleDeleteModal(true);
  };

  const hideDeleteModal = () => {
    setVisibleDeleteModal(false);
  };

  const video = useRef<HTMLVideoElement>(null);

  const playVideo = () => {
    video.current && video.current.play();
    setVisibleOverlap(false);
  };

  const endedPlay = () => {
    setVisibleOverlap(true);
  };

  const showDetail = () => {
    dispatch(setVisibleDetailModal(true));
    dispatch(setSelectedMedia(data.id));
  };

  const downloadMedia = () => {
    dispatch(downloadMedias(data.url, project_id, token));
  };


  const API_URL = process.env.API_URL;

  return (
    <Container className="contentItem">
      {
        <OverflowMenu className="controlBoard" data-floating-menu-container>
          <div className="triUp"></div>
          {!isDownloading ? <OverflowMenuItem className="itemBoard" itemText={t("data.Download")} onClick={downloadMedia} /> : <OverflowMenuItem className="itemBoard disabled" itemText={t("data.Download")} />}
          {!isDeleting ? <OverflowMenuItem className="itemBoard" itemText={t("data.Delete")} onClick={showDeleteModal} /> : <OverflowMenuItem className="itemBoard disabled" itemText={t("data.Delete")} />}
        </OverflowMenu>
      }
      {
        data.type === "video" ? <video ref={video} onEnded={endedPlay} controls={!visibleOverlap} poster={`${API_URL}/api/thumbnail/${project_id}/${data.url}?token=${token}`} preload="none">
          <source src={`${API_URL}/api/media/data/${project_id}/${data.url}?token=${token}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video> :
          <img src={`${API_URL}/api/media/data/${project_id}/${data.url}?token=${token}`} className="imageBack" onClick={showDetail} />}
      {visibleOverlap && data.type === "video" && <div className="overlap" onClick={showDetail}>
        <img className="play" src={VideoPlay} />
        {/* <div className="duration">{data.duration}</div> */}
      </div>}
      <div className={cls(["description", data.type === "video" ? "" : "imageDescription"])}>
        <div className="descriptionItem">
          <div className="title">{data.title}</div>
          <div className="icons">
            {!data.checked ? <img src={Unchecked} onClick={() => { dispatch(toggleVideoChecked(data.id)); }} /> : <img src={Checked} onClick={() => { dispatch(toggleVideoChecked(data.id)); }} />}
          </div>
        </div>
        <div className="descriptionItem">
          <div className="date">{data.date}</div>
          <div className={cls(["name", data.name === search ? "searched" : ""])}>{data.name}</div>
        </div>
      </div>
      <DeleteMedia show={visibleDeleteModal} url={data.url} hideModal={hideDeleteModal} />
    </Container>
  );
};

export default PictureView;
