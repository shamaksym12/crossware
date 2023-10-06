import React, { useEffect } from "react";
import Home from "pages/home";
import Login from "pages/login";
import ResetPassword from "pages/resetPassword";
import Member from "pages/member";
import Camera from "pages/camera";
import Report from "pages/report";
import WorkRoute from "pages/workroute";
import Settings from "pages/settings";
import Call from "pages/call";
import Project from "pages/project"
import LoginLayout from "components/layouts/login";
import DefaultLayout from "components/layouts/default";
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { updateMyLocation, getLocations } from "redux/app/actions";
import { Routes, Route, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HELMET_CYCLE = 30 * 1000;

const Router = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const { token } = useSelector(
    getAppState
  );
  const success: PositionCallback = (data: GeolocationPosition) => {
    dispatch(updateMyLocation(token, data.coords.latitude, data.coords.longitude))
  };
  const user = JSON.parse(localStorage.getItem('user')!);

  useEffect(() => {
    setSearchParams({ lng: i18n.language });
  }, [i18n.language]);

  useEffect(() => {
    if (searchParams.get('lng') != "" && searchParams.get('lng') != null) {
      i18n.changeLanguage(searchParams.get('lng')!);
    }

    updateHelmetList();

    setInterval(() => {
      updateHelmetList();
    }, HELMET_CYCLE);
  }, []);

  useEffect(() => {
    if (token) {
      navigator.geolocation.getCurrentPosition(success);
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(success);
      }, 1000 * 30)
      return () => clearInterval(interval)
    }
  }, [token])

  useEffect(() => {
    setSearchParams({ lng: i18n.language });
    if (!token && location.pathname !== '/reset-password') navigate('/login');
  }, [location.pathname]);

  const updateHelmetList = () => {
    if(user) dispatch(getLocations(`${user.company_id}`, token));
  };

  return token ? (
    <Routes>
      <Route path="/" element={<DefaultLayout children={<Home />} />} />
      <Route path="/member" element={<DefaultLayout children={<Member />} />} />
      <Route path="/camera" element={<DefaultLayout children={<Camera />} />} />
      <Route path="/workroute" element={<DefaultLayout children={<WorkRoute />} />} />
      <Route path="/report" element={<DefaultLayout children={<Report />} />} />
      <Route path="/settings" element={<DefaultLayout children={<Settings />} />} />
      <Route path="/call" element={<DefaultLayout children={<Call />} />} />
      <Route path="/login" element={<LoginLayout children={<Login />} />} />
      <Route path="/project" element={<DefaultLayout children={<Project />} />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/login" element={<LoginLayout children={<Login />} />} />
      <Route path="/reset-password" element={<LoginLayout children={<ResetPassword />} />} />
    </Routes>
  );
};

export default Router;
