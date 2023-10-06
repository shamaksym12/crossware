import React, { FC, useState, useEffect } from 'react';
import { cls, formatNumber } from "utils/functions";
import Checked from "assets/image/icon/unchecked-report.png";
import Unchecked from "assets/image/icon/unchecked.png";
import { Report } from 'redux/app';
import { setVisibleAddReportModal, setSelectedReport, downloadReports } from "redux/app/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import axios from 'axios';
import { OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import DeleteReport from 'components/titleView/deleteReport';

interface ItemProps {
  data: Report;
}

const TitleItemView: FC<ItemProps> = (props: ItemProps) => {
  const { data } = props;

  const [content, setContent] = useState(data.content ? data.content : [""]);
  const [checked, setChecked] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);

  const { token, isDeleting, isDownloading } = useSelector(
    getAppState
  );

  const projects = JSON.parse(localStorage.getItem('project')!);
  const project_id = projects.id;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const showDeleteModal = () => {
    setVisibleDeleteModal(true);
  };
  const hideDeleteModal = () => {
    setVisibleDeleteModal(false);
  };

  const handleClick = () => {
    dispatch(setVisibleAddReportModal(true));
    dispatch(setSelectedReport(data.url));
    setChecked(!checked);
  };

  const downloadReport = () => {
    dispatch(downloadReports(data.url, project_id, token));
  };

  const API_URL = process.env.API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/report/data/${project_id}/${data.url}?token=${token}`).then(res => {
      if (typeof res.data !== typeof []) {
        setContent(res.data.split("\n"));
      }
    }
    ).catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div className={cls(["contentItem", data.status || checked ? "active" : ""])}>

      <div className={cls(["top-shape", data.status || checked ? "active" : ""])}></div>
      {
        <OverflowMenu className="controlBoard" data-floating-menu-container>
          <div className="triUp"></div>
          {!isDownloading ? <OverflowMenuItem className="itemBoard" itemText={t("data.Download")} onClick={downloadReport} /> : <OverflowMenuItem className="itemBoard disabled" itemText={t("data.Download")} />}
          {!isDeleting ? <OverflowMenuItem className="itemBoard" itemText={t("data.Delete")} onClick={showDeleteModal} /> : <OverflowMenuItem className="itemBoard disabled" itemText={t("data.Delete")} />}
        </OverflowMenu>
      }
      <div className="content" onClick={handleClick}>
        {
          content.map((item, key) => (
            <div key={key}>{item}</div>
          ))
        }
      </div>
      <div className="information">
        <div className="title">{data.title}</div>
        <div className="icons">
          {data.status || checked ? <img src={Checked} /> : <img src={Unchecked} />}
        </div>
      </div>
      <div className="footer">
        <div className="date">{data.date}</div>
        <div className="name">{data.name.replace('_', ' ')}</div>
      </div>
      <DeleteReport show={visibleDeleteModal} url={data.url} hideModal={hideDeleteModal} />
    </div>
  );
};

export default TitleItemView;