import React, { useState, useEffect } from "react";
import Container from "components/Container";
import AddProject from "components/project/add";
import DeleteProject from "components/project/delete";
import Plus from "assets/image/icon/plus-p.png";
import Minus from "assets/image/icon/minus.png";
import Edit from "assets/image/icon/edit.png";
import MinusActive from "assets/image/icon/minus-active.png";
import EditActive from "assets/image/icon/edit-active.png";
import { Form, Table, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { getProjects, removeMember } from "redux/app/actions";
import { useNavigate } from "react-router-dom";
import { Member } from "redux/app/reducer";
import { useTranslation } from "react-i18next";
import FormItem from "antd/lib/form/FormItem";
import axios from "axios";
import CreateProject from "components/project/createProject";

const AdminProject = () => {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleAddModal, setVisibleAddModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
    const [action, setAction] = useState('add');
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const user = JSON.parse(localStorage.getItem('user')!);

    const { members, token } = useSelector(
        getAppState
    );

    const API_URL = process.env.API_URL;

    const [status, setStatus] = useState('');
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const { addProjectStatus } = useSelector(
        getAppState
    );

    const project = JSON.parse(localStorage.getItem('project')!);

    useEffect(() => {
        setStatus('');

        if (project) {
            setTitle(project.title)
            setAddress(project.address)
        } else {
            setTitle("プロジェクトを選択してください")
            setAddress("なし")
        }
    }, []);

    useEffect(() => {
        setStatus(addProjectStatus);

        if (addProjectStatus === "success") navigate('/');
    }, [addProjectStatus]);

    const onFinish = () => {
        const data = {
            title: title,
            address: address,
            company_id: `${user.company_id}`,
            owner_user_id: `${user.id}`,
        }
        if(project) {
            axios.patch(`${API_URL}/api/project/${project.id}`, data, { headers: { 'x-access-token': token } }).then(res => {
                location.href = "/";
            }).catch(err => {
                console.log(err);
            });
        } else {
            axios.post(`${API_URL}/api/project/`, data, { headers: { 'x-access-token': token } }).then(res => {
                location.href = "/";
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

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

    useEffect(() => {
        dispatch(getProjects(user.company_id, token));
    }, []);

    const rowSelection = {
        selectedRows: setSelectedMembers,
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: Member[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedMembers(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    const showCreateModal = () => {
      setVisibleCreateModal(true);
    };

    const hideCreateModal = () => {
      setVisibleCreateModal(false);
    };

    const showAddModal = () => {
        setAction('add');
        setVisibleAddModal(true);
    };

    const hideAddModal = () => {
        setVisibleAddModal(false);
        setSelectedMembers([]);
        setSelectedRowKeys([]);
    };

    const deleteProjects = () => {
        if (selectedMembers.length) {
            selectedMembers.map(member => {
                dispatch(removeMember(member, token));
            });
            setVisibleDeleteModal(true);
        }
    };

    const hideDeleteModal = () => {
        setVisibleDeleteModal(false);
        setSelectedMembers([]);
    };

    const editProject = () => {
        if (selectedMembers.length) {
            setAction('edit');
            setVisibleAddModal(true);
        }
    }

    const formChange = () => {
        setStatus('success');
    };

    const handleTitle = (e: { target: { value: string; }; }) => {
        setTitle(e.target.value);
    };

    const handleAddress = (e: { target: { value: string; }; }) => {
        setAddress(e.target.value);
    };


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
                            <input type="text" name="title" value={title} onChange={handleTitle} required className="form-control" />
                        </div>
                    </FormItem>
                    <FormItem>
                        <div className="mt-4">
                            <label htmlFor="">{t("project.address")}</label>
                            <input type="text" name="content" value={address} onChange={handleAddress} required className="form-control" />
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
                    <label htmlFor="">{t("project.memberEdit")}</label>
                    <div className="controls">
                        <div className="controlItem" onClick={showAddModal}>
                            <img src={Plus} />
                            <div>{t("project.add")}</div>
                        </div>
                        <div className="controlItem" onClick={deleteProjects}>
                            {selectedMembers.length ? <img src={MinusActive} /> : <img src={Minus} />}
                            <div>{t("project.delete")}</div>
                        </div>
                        <div className="controlItem" onClick={editProject}>
                            {selectedMembers.length ? <img src={EditActive} /> : <img src={Edit} />}
                            <div>{t("project.edit")}</div>
                        </div>
                    </div>
                </div>
                <div className="col-9 p-0">
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={members}
                    />
                </div>
            </div>
        )
    }

    return (
        <Container className="projectContainer">
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                onValuesChange={formChange}
            >
                {
                    projectCreate()
                }
                {
                    userOption()
                }
                <div className="row mt-3">
                    <div className="col-3"></div>
                    <div className="col-3"></div>
                    <div className="col-3">
                        <FormItem>
                            <div className="btnWrap">
                                <Button type="primary" htmlType="submit">
                                    {project ? t("project.edit") : t("project.register")}
                                </Button>
                            </div>
                        </FormItem>
                    </div>
                </div>
            </Form>
            <CreateProject show={visibleCreateModal} hideModal={hideCreateModal} />
            <AddProject show={visibleAddModal} hideModal={hideAddModal} action={action} member={selectedMembers[0]} />
            <DeleteProject show={visibleDeleteModal} hideModal={hideDeleteModal} />
        </Container>
    );
};

export default AdminProject;