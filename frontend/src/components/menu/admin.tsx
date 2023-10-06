import React, { useEffect, useState, SyntheticEvent } from "react";
import Container from "components/Container";
import settingIcon from "assets/image/icon/manage-accounts.png";
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Button } from 'antd';
import { useTranslation } from "react-i18next";
import InviteUser from "components/admin/inviteUser";

const AdminSetting = () => {
    const [visibleBar, setVisibleBar] = useState(false);
    const [visibleInviteModal, setVisibleInviteModal] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        setVisibleBar(false);
    }, [location.pathname]);

    const toggleBar = () => {
        setVisibleBar(!visibleBar);
    };

    const showInviteModal = () => {
        setVisibleInviteModal(true);
    };

    const hideInviteModal = () => {
        setVisibleInviteModal(false);
    };

    return (
        <Container className="menuContainer">
            <div className="actionBar" onClick={toggleBar} >
                    <img src={settingIcon} className="rss opacity" alt="" />
                </div> 
            {visibleBar && <div className="adminBar">
                <Button type="primary" onClick={showInviteModal}>{t('admin.Option1')}</Button>
                <Button type="primary">{t('admin.Option2')}</Button>
            </div>
            }
            <InviteUser show={visibleInviteModal} hideModal={hideInviteModal} />
        </Container>
    );
};

export default AdminSetting;
