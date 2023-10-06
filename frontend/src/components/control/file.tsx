import React, { FC, useEffect, useState } from 'react';
import Container from "components/Container";
import { cls, dateList } from "utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { Select } from 'antd';
import FileFilter from '../fileShare/filter';
import DragDrop from '../fileShare/fileDnD';
import Files from 'components/fileShare';
import Close from 'assets/image/icon/close.png'
import { handleFileBox } from 'redux/app';
import { setMediaFilter, getMedias } from "redux/app/actions";
import { useTranslation } from "react-i18next";

const FileBoard = () => {
    const { Option } = Select;
    const [recentDates, setRecentDates] = useState<string[]>();
    const { mediaFilter, token } = useSelector(
        getAppState
    );

    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        setRecentDates(dateList(7));
    }, []);

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    }

    const { visibleFileBox } = useSelector(
        getAppState
    );

    const handleChatBox = (type: string) => {
        dispatch(setMediaFilter({ type: type }));
    };

    const hideFileBox = () => {
        dispatch(handleFileBox(false));
    }

    return (
        <Container className={cls(["fileBoardContainer board", visibleFileBox ? "showBox" : ''])}>
            <img src={Close} className="mainClose" alt="" onClick={hideFileBox} />
            <ul className="tabHeader">
                <li className={cls(["tabItem", mediaFilter.type === "all" ? 'active' : ''])} onClick={() => { handleChatBox("all"); }}>{t("media.filterall")}</li>
                <li className={cls(["tabItem", mediaFilter.type === "image" ? 'active' : ''])} onClick={() => { handleChatBox("image"); }}>{t("media.filterimg")}</li>
                <li className={cls(["tabItem", mediaFilter.type === "map" ? 'active' : ''])} onClick={() => { handleChatBox("map"); }}>{t("media.FilterMap")}</li>
                <li className={cls(["tabItem", mediaFilter.type === "manual" ? 'active' : ''])} onClick={() => { handleChatBox("manual"); }}>{t("media.Manual")}</li>
            </ul>
            <FileFilter />
            <div className="mt-5">
                <Files />
            </div>
            <div className="fileupload">
                <DragDrop />
            </div>
        </Container>
    );
};

export default FileBoard;
