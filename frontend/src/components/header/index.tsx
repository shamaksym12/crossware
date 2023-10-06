import React from "react";
import Container from "components/Container";
import SearchBox from "components/searchBox";
import Menu from "components/menu";
import AdminSetting from "components/menu/admin";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();

  const projects = JSON.parse(localStorage.getItem('project')!);
  var name = "";
  if (projects) {
    name = projects.title;
  } else {
    name = `${t('header.Title')}`;
  }

  const user = JSON.parse(localStorage.getItem('user')!);
  const privilege = `${user.privilege}`;

  const userType = () => {
    if (privilege === "admin") {
      return (
        <div className="headerControl">
        <SearchBox />
        <AdminSetting />
        <Menu />
      </div>      
      )
    } else {
      return (
        <div className="headerControl">
        <SearchBox />
        <Menu />
      </div>
      )
    }
  }

  return (
    <Container className="headerContainer">
      <h4>{name}</h4>
      {
        userType()
      }
    </Container>
  );
};

export default Header;
