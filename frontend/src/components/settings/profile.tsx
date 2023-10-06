import React, { useState } from "react";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import EditEmail from "components/profile/editEmail";
import EditPassword from "components/profile/editPassword";
import { useTranslation } from "react-i18next";

const Profile = () => {
    const [visibleEmailModal, setVisibleEmailModal] = useState(false);
    const [visiblePasswordModal, setVisiblePasswordModal] = useState(false);

    const { t } = useTranslation();

    const { user } = useSelector(
        getAppState
    );

    const showEmailModal = () => {
        setVisibleEmailModal(true);
    };

    const showPasswordModal = () => {
        setVisiblePasswordModal(true);
    };

    const hideEmailModal = () => {
        setVisibleEmailModal(false);
    };

    const hidePasswordModal = () => {
        setVisiblePasswordModal(false);
    };

    return (
        <Container className="profileContainer">
            <div className="row">
                <div className="col-3 p-0">
                    <label htmlFor="">{t("profile.edit")}</label>
                    <div className="pt-3">{t("login.mailAddress")}</div>
                    <div>{t("profile.pswdNote")}</div>
                </div>
                <div className="col-2 p-0">
                    <div className="label">{t("profile.name")}</div>
                    <div className="label">{t("profile.phone")}</div>
                    <div className="label">{t("signup.company")}</div>
                    <div className="label editable" onClick={showEmailModal}>{t("login.mailAddress")}</div>
                    <div className="label editable" onClick={showPasswordModal}>{ t("login.password") }</div>
                </div>
                <div className="col-3 p-0 value">
                    <div className="name">{`${user.first_name} ${user.last_name}`}</div>
                    <div className="phone_number">{user.phone_number}</div>
                    <div className="company">{user.company}</div>
                    <div className="email">{user.email}</div>
                    <div className="password pt-1"> ******** </div>
                </div>
            </div>
            <EditEmail show={visibleEmailModal} hideModal={hideEmailModal} email={user.email} />
            <EditPassword show={visiblePasswordModal} hideModal={hidePasswordModal} />
        </Container>
    );
};

export default Profile;
