import Container from "components/Container";
import { Link } from "react-router-dom";
import CameraData from "assets/image/icon/camera_data.png";
import CameraDataWhite from "assets/image/icon/camera_data-white.png";
import DisplayMember from "assets/image/icon/display_member.png";
import DisplayMemberWhite from "assets/image/icon/display_member-white.png";
import VariousSettings from "assets/image/icon/various_settings.png";
import VariousSettingsWhite from "assets/image/icon/various_settings-white.png";
import WorkReport from "assets/image/icon/work_report.png";
import WorkReportWhite from "assets/image/icon/work_report-white.png";
import WorkRoute from "assets/image/icon/work_route.png";
import WorkRouteWhite from "assets/image/icon/work_route-white.png";
import PlusWhite from "assets/image/icon/plus-white.png";
import Angle from "assets/image/icon/angle.png";
import AngleWhite from "assets/image/icon/angle-white.png";
import { cls } from "utils/functions";
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setVisibleAddReportModal, setSelectedMedia } from "redux/app/actions";
import { useTranslation } from "react-i18next";

const NavMenu = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const addReport = () => {
        dispatch(setVisibleAddReportModal(true));
        dispatch(setSelectedMedia(0));
    };
    
    return (
        <Container className="navContainer">
            <ul>
                <li className={cls(["linkWrap", location.pathname === "/camera" ? "activeNav" : ""])}>
                    <Link to="/camera" className="navLink">
                        <div>
                            {
                                location.pathname === "/camera" ? <img src={CameraDataWhite} /> : <img src={CameraData} />
                            }
                            <h4>{t("nav.camdata")}</h4>
                        </div>
                    </Link>
                </li>
                <li className={cls(["linkWrap", location.pathname === "/report" ? "activeNav" : ""])}>
                    <Link to="/report" className="navLink">
                        <div>
                            {
                                location.pathname === "/report" ? <img src={WorkReportWhite} /> : <img src={WorkReport} />
                            }
                            <h4>{t("nav.report")}</h4>
                        </div>
                    </Link>
                    <img src={PlusWhite} className="add_report" onClick={addReport} />
                </li>
                <li className={cls(["linkWrap", location.pathname === "/workroute" ? "activeNav" : ""])}>
                    <Link to="/workroute" className="navLink">
                        <div>
                            {
                                location.pathname === "/workroute" ? <img src={WorkRouteWhite} /> : <img src={WorkRoute} />
                            }
                            <h4>{t("nav.status")}</h4>
                        </div>
                    </Link>
                </li>
                <li className={cls(["linkWrap", location.pathname === "/settings" ? "activeNav" : ""])}>
                    <Link to="/settings" className="navLink">
                        <div>
                            {
                                location.pathname === "/settings" ? <img src={VariousSettingsWhite} /> : <img src={VariousSettings} />
                            }
                            <h4 className="settingsWrap">{t("nav.settings")}</h4>
                        </div>
                    </Link>
                </li>
                <hr className="devider" />
                <li className={cls(["linkWrap", location.pathname === "/member" ? "activeNav" : ""])}>
                    <Link to="/member" className="navLink">
                        <div>
                            {
                                location.pathname === "/member" ? <img src={DisplayMemberWhite} /> : <img src={DisplayMember} />
                            }
                            <h4>{t("nav.member")}</h4>
                        </div>
                        {
                            location.pathname === "/member" ? <img src={AngleWhite} className="rightangle" /> : <img src={Angle} className="rightangle" />
                        }
                    </Link>
                </li>
            </ul>
        </Container>
    );
};

export default NavMenu;
