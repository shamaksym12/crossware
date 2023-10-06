import React, { FC, useState, useEffect, Key, useRef } from 'react';
import circle from "assets/image/icon/circle.png";
import { cls, dateString } from "utils/functions";
import DeleteProject from "./deleteProject";
import { Project_Board } from "redux/app/reducer";
import { useDispatch, useSelector } from "react-redux";
import { downloadProject, setSelectProject, setPro, setProjectBoard } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import Message from "./message";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OverflowMenu, OverflowMenuItem } from '@carbon/react';

interface ItemProps {
    data: Project_Board;
}

var pro_id = "";

const ProjectItemView: FC<ItemProps> = (props: ItemProps) => {
    const { data } = props;
    const [isOver, setIsOver] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [visibleSentMessage, setVisibleSentMessage] = useState(false);
    const [selectProject, setselectProject] = useState(0);
    const user = JSON.parse(localStorage.getItem('user')!);
    var company_id = `${user.company_id}`;
    const API_URL = process.env.API_URL;

    const navigate = useNavigate();

    const { token, project_board } = useSelector(
        getAppState
    );

    useEffect(() => {
        const selected = JSON.parse(localStorage.getItem('project')!);

        if (selected) setselectProject(parseInt(selected.id));
    }, [localStorage.getItem('project')]);

    const selectID = (event: React.ChangeEvent<HTMLInputElement>) => {
        pro_id = event.currentTarget.id
        return pro_id;
    }

    const downloadProj = () => {
        dispatch(downloadProject(pro_id, token, company_id))
        setVisibleSentMessage(true);
        navigate('/');
    };

    const dispatch = useDispatch();

    const handleOver = (value: boolean) => {
        setIsOver(value);
    };

    const showDeleteModal = () => {
        setVisibleDeleteModal(true);
    };

    const hideSentMessage = () => {
        setVisibleSentMessage(false);
        navigate('/');
    };

    const hideDeleteModal = () => {
        setVisibleDeleteModal(false);
    };

    const { t } = useTranslation();

    const handleClick = (event: any) => {
        const proj_id = event.currentTarget.id;
        dispatch(setSelectProject(parseInt(pro_id)));

        project_board.map((project: any) => {
            project.status = project.id == data.id;
        });

        dispatch(setProjectBoard(project_board));

        if (proj_id) {
            const storeProject = {
                id: proj_id,
                title: data.title,
                address: data.address,
            };

            localStorage.setItem('project', JSON.stringify(storeProject));
            dispatch(setPro(storeProject));
            console.log("---Store Project---:", storeProject)
            navigate('/');
        }

    };

    const date = new Date(data.create_date);
    var createDate = dateString(date);
    var name = data.owner_first_name + data.owner_last_name;

    return (
        <div className={cls(["contentItem", isOver ? "active_over" : "", data.status || selectProject == parseInt(data.id) ? "active" : ""])} onMouseOver={() => { handleOver(true); }} onMouseOut={() => { handleOver(false); }}>
            {
                <OverflowMenu className="controlBoard" data-floating-menu-container id={data.id} onClick={selectID}>
                    <div className="triUp"></div>
                    <a className="link" href={process.env.API_URL + `/api/project/download/${pro_id}?token=` + token} target="_blank"><OverflowMenuItem className="itemBoard" itemText={t("project.Download")} onClick={downloadProj} /></a>
                    <OverflowMenuItem className="itemBoard" itemText={t("project.Delete")} onClick={showDeleteModal} />
                </OverflowMenu>
            }
            <div className="content" onClick={handleClick} id={data.id}>
                {
                    <div className="title">{data.title} </div>
                }
                {
                    <div className="address">{data.address} </div>
                }
                {
                    <div className="date">更新日: {createDate}</div>
                }
                {
                    <div className="manager">管理者: {name}</div>
                }
                {
                    <div className="onlineUser"><img src={circle} alt="" />&nbsp;&nbsp;&nbsp;&nbsp;{name}</div>
                }
                <DeleteProject show={visibleDeleteModal} proid={pro_id} hideModal={hideDeleteModal} companyid={company_id} />
                <Message show={visibleSentMessage} hideModal={hideSentMessage} content={t("del.Projectmsg")} />
            </div>
        </div>
    );
};

export default ProjectItemView;