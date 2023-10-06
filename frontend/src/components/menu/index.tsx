import React, { useEffect, useState } from "react";
import Container from "components/Container";
import MenuIcon from "assets/image/icon/menu.png";
import { getAppState } from "redux/app/selectors";
import { Select, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "redux/app/actions";

import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const languages = [
  { value: 'ja', text: "Japanese" },
	{ value: 'en', text: "English" },
]

const Menu = () => {
  const [visibleBar, setVisibleBar] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const { Option } = Select;

  const { user } = useSelector(
    getAppState
  );

  useEffect(() => {
    setVisibleBar(false);
  }, [location.pathname]);

  const toggleBar = () => {
    setVisibleBar(!visibleBar);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Container className="menuContainer">
      <div className="actionBar" onClick={toggleBar}>
        <div className="usersign">{user.email.charAt(0).toUpperCase()}</div>
        <img src={MenuIcon} className="" alt="" />
      </div>
      {visibleBar && <div className="settingBar">
        <div className="usersignWrap">
          <div className="usersign">{user.email.charAt(0).toUpperCase()}</div>
        </div>
        <div className="userinfo">
          <div className="username">{`${user.first_name} ${user.last_name}`}</div>
          <div className="useremail">{user.email}</div>
        </div>
        <Button type="primary" onClick={handleLogout}>
          {t('menu.logout')}
        </Button>
        <div className="lang">
          <Select className="Select" defaultValue={i18n.language} onChange={handleLanguage} tabIndex={0} placeholder="Locale">
          <Option className="Option" key="default" value="default"><span className="material-symbols-outlined">language</span> Language</Option>
            {languages.map((language) => (
              <Option key={language.value} value={language.value}>
                {language.text}
              </Option>
            ))}
          </Select>
        </div>
      </div>}
    </Container>
  );
};

export default Menu;
