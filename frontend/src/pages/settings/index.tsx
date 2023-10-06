import React, { useState } from "react";
import Container from "components/Container";
import AdminProject from "components/settings/adminProject";
import Profile from "components/settings/profile";
import { cls } from "utils/functions";
import { useTranslation } from "react-i18next";
import UserProject from "components/settings/project";

enum SETTINGTAB {
  PROJECT = 'PROJECT',
  PROFILE = 'PROFILE'
}

const Settings = () => {
  const [tab, setTab] = useState(SETTINGTAB.PROJECT);

  const { t } = useTranslation();


  const user = JSON.parse(localStorage.getItem('user')!);
  const privilege = `${user.privilege}`;

  return (
    <Container className="settingsContainer">
      <h4 className="title">{t("varioussettings.setting")}</h4>
      <div className="tabHeader">
        <div className={cls(["tabHeaderItem", tab === SETTINGTAB.PROJECT ? "active" : ""])} onClick={() => setTab(SETTINGTAB.PROJECT)}>{t("varioussettings.project")}</div>
        <div className={cls(["tabHeaderItem", tab === SETTINGTAB.PROFILE ? "active" : ""])} onClick={() => setTab(SETTINGTAB.PROFILE)}>{t("varioussettings.profile")}</div>
      </div>
      <div className="tabContent">
        {
          tab === SETTINGTAB.PROJECT ?
            (privilege == "admin" ? <AdminProject />: <UserProject/>) :
          tab === SETTINGTAB.PROFILE ? <Profile /> : ''
        }
      </div>
    </Container>
  );
};

export default Settings;
