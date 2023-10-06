import React from "react";
import Container from "components/Container";
import LocationsTree from "./tree";
import { Link } from "react-router-dom";
import LogoWhite from "assets/image/icon/logo-white.png";
import NavMenu from "./nav";

const SideBar = () => {
    return (
        <Container className="sidebarContainer">
            <Link to="/">
                <img src={LogoWhite} className="main_logo" alt="" />
            </Link>
            <NavMenu />
            <LocationsTree />
        </Container>
    );
};

export default SideBar;
