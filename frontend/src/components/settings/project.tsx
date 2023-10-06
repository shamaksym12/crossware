import React, { useState, useEffect } from "react";
import Container from "components/Container";
import { Form, Table, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { addProject, getProjects, removeMember } from "redux/app/actions";
import { useNavigate } from "react-router-dom";
import { Member } from "redux/app/reducer";
import { useTranslation } from "react-i18next";
import FormItem from "antd/lib/form/FormItem";
import axios from "axios";

const Project = () => {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');

    const { members, token } = useSelector(
        getAppState
    );

    const [status, setStatus] = useState('');
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const { addProjectStatus } = useSelector(
        getAppState
    );

    useEffect(() => {
        setStatus('');
        const projects = JSON.parse(localStorage.getItem('project')!);
        if (projects) {
            setTitle(projects.title)
            setAddress(projects.address)
        } else {
            setTitle("プロジェクトを選択してください")
            setAddress("なし")
        }
    }, []);

    useEffect(() => {
        setStatus(addProjectStatus);

        if (addProjectStatus === "success") navigate('/');
    }, [addProjectStatus]);


    const columns = [
        {
            title: t("profile.name"),
            dataIndex: 'name',
        },
        {
            title: t("project.team"),
            dataIndex: 'team',
        },
        {
            title: t("project.company"),
            dataIndex: 'society',
        },
        {
            title: t("project.email"),
            dataIndex: 'email',
        },
        {
            title: t("project.helmetNo"),
            dataIndex: 'helmetNumber',
        },
    ];

    const user = JSON.parse(localStorage.getItem('user')!);
    useEffect(() => {
        dispatch(getProjects(user.company_id, token));
    }, []);

    const projectCreate = () => {
        return (
            <div className="row">
                <div className="col-3 p-0">
                    <label htmlFor="">{t("project.label")}</label>
                </div>
                <div className="col-9 p-0">
                    <FormItem>
                        <div>
                            <label htmlFor="">{t("project.label")}</label>
                            <div className="form-control">{title}</div>
                        </div>
                    </FormItem>
                    <FormItem>
                        <div className="mt-4">
                            <label htmlFor="">{t("project.address")}</label>
                            <div className="form-control">{address}</div>
                        </div>
                    </FormItem>
                </div>
            </div>
        )
    }

    const userOption = () => {
        return (
            <div className="row mt-5">
                <div className="col-3 p-0">
                <label htmlFor="">{t("project.memberText")}</label>
                    <div className="controls">
                        <div className="controlItem">
                            &nbsp;
                        </div>
                        <div className="controlItem">
                            &nbsp;
                        </div>
                        <div className="controlItem">
                            &nbsp;
                        </div>
                    </div>
                </div>
                <div className="col-9 p-0">
                    <Table
                        columns={columns}
                        dataSource={members}
                    />
                </div>
                <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-9">
                    &nbsp;
                </div>
            </div>
            </div>
        )
    }

    return (
        <Container className="projectContainer">
            {
                projectCreate()
            }
            {
                userOption()
            }
        </Container>
    );
};

export default Project;