import React, { useEffect, useState } from 'react';
import Rnd from 'react-rnd';
import { useDispatch, useSelector } from "react-redux";
import { setVisibleAddReportModal, setSelectedReport } from "redux/app/actions";
import Zoom from "assets/image/icon/zoom-ex.png";
import Close from "assets/image/icon/close-ex.png";
import { cls, formatNumber } from "utils/functions";
import { getAppState } from "redux/app/selectors";
import axios from 'axios';
import { useTranslation } from "react-i18next";

const AddReport = () => {
    const dispatch = useDispatch();
    const { token, selectedReport } = useSelector(
        getAppState
    );

    const { t } = useTranslation();

    const projects = JSON.parse(localStorage.getItem('project')!);
    const project_id = projects.id;

    const API_URL = process.env.API_URL;
    const currentDate = `${(new Date()).getFullYear()}/${formatNumber((new Date()).getMonth() + 1)}/${formatNumber((new Date()).getDate())}`;
    const user = JSON.parse(localStorage.getItem('user')!);

    const [scaleReduced, setScaleReduced] = useState(false);
    const [title, setTitle] = useState(selectedReport ? selectedReport.title : '');
    const [content, setContent] = useState(selectedReport ? selectedReport.content : '');

    useEffect(() => {
        axios.get(`${API_URL}/api/report/data/${project_id}/${selectedReport.url}?token=${token}`).then(res => {
            if (typeof res.data !== typeof []) {
                setContent(res.data);
            }
          }
        ).catch(err => {
            console.log(err);
        });
    }, []);

    const hideModal = () => {
        dispatch(setVisibleAddReportModal(false));
        dispatch(setSelectedReport(''));
    };

    const handleScale = () => {
        setScaleReduced(!scaleReduced);
    };

    const onFinish = () => {
        if (selectedReport.url !== '') {
            const data = {
                title: title,
                content: content,
                name: selectedReport.name
            };

            axios.put(`${API_URL}/api/report/${project_id}/${selectedReport.url}`, data, { headers: { 'x-access-token': token } }).then(res => {
                location.href = "/report";
            }).catch(err => {
                console.log(err);
            });
        } else {
            const data = {
                title: title,
                content: content,
                name: `${user.first_name}_${user.last_name}`
            };

            axios.post(`${API_URL}/api/report/${project_id}/`, data, { headers: { 'x-access-token': token } }).then(res => {
                location.href = "/report";
            }).catch(err => {
                console.log(err);
            });
        }

        dispatch(setVisibleAddReportModal(false));
        dispatch(setSelectedReport(''));
    };

    const selectModal = () => {
        const rnds = document.getElementsByClassName("react-draggable");
        for (let i = 0; i < rnds.length; i++) {
            rnds[i].classList.remove("focused");
        }

        document.getElementsByClassName("addReport")[0].classList.add("focused");
    };

    const handleTitle = (e: { target: { value: string; }; }) => {
        setTitle(e.target.value);
    };

    const handleContent = (e: { target: { value: string; }; }) => {
        setContent(e.target.value);
    };

    return (
        <Rnd
            default={{
                x: 200,
                y: 20,
                width: 750,
                height: 700,
            }}
            minWidth={300}
            minHeight={700}
            bounds="window"
            className={cls(["addReport", scaleReduced ? 'reduced' : ''])}
            onClick={selectModal}
            dragHandleClassName="header"
            >
            <div className="header">
                <img src={Close} className="close" onClick={hideModal} />
                <img src={Zoom} className="scale" onClick={handleScale} />
            </div>
            <div className="content">
                <div className="title">{t("report.title")} {`｜ ${currentDate}　${user.first_name} ${user.last_name}`}</div>
                <form className="reportForm mt-4" onSubmit={onFinish}>
                    <div className="form-group">
                        <label>{t("report.title1")}</label>
                        <input type="text" className="form-control" name="title" value={title} onChange={handleTitle} placeholder={t("report.title1")} />
                    </div>
                    <div className="form-group mt-4">
                        <label>{t("report.body")}</label>
                        <textarea className="form-control" name="content" value={content} rows={22} onChange={handleContent} placeholder={t("report.body")}></textarea>
                    </div>
                    <div className="action mt-4">
                        <button type="submit" className={cls(["btn btn-primary", title && content ? "active" : ''])}>{t("report.submit")}</button>
                    </div>
                </form>
            </div>
        </Rnd>
    );
};

export default AddReport;