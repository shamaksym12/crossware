import React, { useEffect, useState } from 'react';
import Container from "components/Container";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { useTranslation } from "react-i18next";
import Menu from "assets/image/icon/menu-round.png";
import Menu_Active from "assets/image/icon/menu-active.png";
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, off } from 'firebase/database';
import RouteMenu from './routeMenu';
import { googleMapType } from '.';

interface DataRow {
    startTime: Date;
    endTime: Date;
    workHours: string;
}

interface RouteDataRow {
    latitude: string;
    longitude: string;
}

interface BoardProps {
    googleMap: googleMapType;
    setGoogleMap: (googleMap: googleMapType) => void;
}

const Board: React.FC<BoardProps> = ({ googleMap, setGoogleMap }) => {
    const { selectedHelmet } = useSelector(
        getAppState
    );

    const firebaseConfig = {
        databaseURL: process.env.FIREBASE_RD_URL
    }

    const { t } = useTranslation();
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const [dataRows, setDataRows] = useState<DataRow[]>([]);
    const [routeDataRows, setRouteDataRows] = useState<RouteDataRow[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [distance, setDistance] = useState<number>();
    const [totaldistance, setTotaldistance] = useState<number>();
    const [showRoute, setShowRoute] = useState<boolean>(true);
    const [totalWorkingHour, setTotalWorkingHour] = useState<string>("00:00");

    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const formattedDate = `${day}/${month}/${year}`;
    const formattedDateWithDashes = formattedDate.replace(/\//g, '-');

    const [statusRef, setStatusRef] = useState(ref(database, `/status/data/project${selectedHelmet.projectId}/${selectedHelmet.id}/${formattedDateWithDashes}`));
    const [routeRef, setRouteRef] = useState(ref(database, `/route/project${selectedHelmet.projectId}/${selectedHelmet.id}/${formattedDateWithDashes}`));
    const helmetNum = selectedHelmet.name;
    const helmetId = `${selectedHelmet.projectId}-${selectedHelmet.id}`;

    const updateRoute = (data: any) => {
        let rows: RouteDataRow[] = [];
        for (const key in data) {
            const route = data[key];
            var lat = route.latitude;
            var lng = route.longitude;
            let newRow: RouteDataRow = { latitude: lat, longitude: lng };
            rows.push(newRow);
        }
        const view = (googleMap.path[helmetId] && googleMap.path[helmetId].getMap() !== null);
        if (view) {
            googleMap.path[helmetId].setMap(null);
        }
        googleMap.path[helmetId] = new googleMap.maps.Polyline({
            path: rows.map((row) => ({
                lat: row.latitude,
                lng: row.longitude
            })),
            geodesic: true,
            strokeColor: "#00a5bf",
            strokeOpacity: 1,
            strokeWeight: 5,
        });
        if (view) {
            googleMap.path[helmetId].setMap(googleMap.map!);
        }
        setGoogleMap(googleMap);

        setRouteDataRows(rows);
    };

    useEffect(() => {
        off(routeRef)
        setRouteRef(ref(database, `/route/project${selectedHelmet.projectId}/${selectedHelmet.deviceId}`));
    }, [selectedHelmet]);

    useEffect(() => {
        onValue(routeRef, (snapshot: { exists: () => any; val: () => any; }) => {
            if (snapshot.exists()) {
                updateRoute(snapshot.val());
            }
        })
    }, [routeRef]);

    const handleOver = (value: any) => {
        setIsPopoverOpen(value);
    };

    const handleTouchStart = () => {
        setIsPopoverOpen(true);
    };

    const displayRoute = () => {
        googleMap.path[helmetId].setMap(googleMap.map!);
    };

    const hideRoute = () => {
        googleMap.path[helmetId].setMap(null);
    };

    const toRadians = (degrees: number): number => {
        return (degrees * Math.PI) / 180;
    };

    useEffect(() => {
        let totalDistance = 0;
        if (routeDataRows && routeDataRows.length > 0) {
            for (let i = 0; i < routeDataRows.length - 1; i++) {
                const startLat: number = parseFloat(routeDataRows[i].latitude);
                const startLng: number = parseFloat(routeDataRows[i].longitude);
                const endLat: number = parseFloat(routeDataRows[i + 1].latitude);
                const endLng: number = parseFloat(routeDataRows[i + 1].longitude);
                const R = 6371; // Earth's radius in kilometers
                const dLat = toRadians(endLat - startLat);
                const dLon = toRadians(endLng - startLng);
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(startLat)) *
                    Math.cos(toRadians(endLat)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c * 1000; // Convert distance to meters
                totalDistance += distance;
            }
        }
        setDistance(Math.round(totalDistance));

    }, [routeDataRows]);

    const updateStatus = (data: any) => {
        let rows: DataRow[] = [];
        for (const key in data) {
            const status = data[key];
            var startDate = new Date();
            startDate.setTime(status.startTime);
            var endDate = new Date();
            endDate.setTime(status.endTime);
            const timeDiff = status.endTime - status.startTime;
            const differenceInSec = Math.floor(timeDiff / 1000);
            const hours = Math.floor(differenceInSec / 3600);
            const minutes = Math.floor((differenceInSec % 3600) / 60);
            const workHours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            let newRow: DataRow = { startTime: startDate, endTime: endDate, workHours: workHours };
            rows.push(newRow);
        }
        setDataRows(rows);
    };

    useEffect(() => {
        const statusCallback = (snapshot: { exists: () => any; val: () => any; }) => {
            if (snapshot.exists()) {
                updateStatus(snapshot.val());
            }
        };

        onValue(statusRef, statusCallback);

        return () => {
            off(statusRef, 'value', statusCallback);
        };
    }, [statusRef]);

    useEffect(() => {
        if (dataRows.length > 0) {
            let totalHours = 0;
            let totalMinutes = 0;
            for (let i = 0; i < dataRows.length; i++) {
                const row = dataRows[i];
                const startTime = row.startTime.getTime();
                const endTime = row.endTime.getTime();
                const timeDiff = endTime - startTime;
                const differenceInSec = Math.floor(timeDiff / 1000);
                const hours = Math.floor(differenceInSec / 3600);
                const minutes = Math.floor((differenceInSec % 3600) / 60);
                totalHours += hours;
                totalMinutes += minutes;
            }
            if (totalMinutes >= 60) {
                const additionalHours = Math.floor(totalMinutes / 60);
                totalHours += additionalHours;
                totalMinutes %= 60;
            }
            const formattedTotalWorkingHour = `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}`;
            setTotalWorkingHour(formattedTotalWorkingHour);
        }
    }, [dataRows]);

    const user = JSON.parse(localStorage.getItem('user')!);
    const userEmail = `${user.email}`;
    if (userEmail === "sh_imaoka@mail.taiyooil.co.jp") {
        var route = {
            name: '--',
            number: '--',
            businessHours: '--',
            averageDistance: '--',
            weeklyDistance: '--',
            residenceTime: '--',
            heatStrokeRisk: '--',
            workingFloor: '--'
        }
    } else {
        var route = {
            name: '鈴木アキラ',
            number: 'CW-SR-03',
            businessHours: '03:42:33',
            averageDistance: '890.2メートル',
            weeklyDistance: '2,748メートル',
            residenceTime: '12:41',
            heatStrokeRisk: '中',
            workingFloor: '2F/3F'
        }
    }

    return (
        <Container className="controlBoard routeBoard board">
            {dataRows.length > 0 && (
                <div>
                    <div className="information">
                        <div className="item">
                            <div className="label">{t("routeboard.name")}</div>
                            <div className="content">{route.name}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.helmetNo")}</div>
                            <div className="content">{helmetNum}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.startTime")}</div>
                            <div className="content">{dataRows[0].startTime.toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" })}&nbsp;&nbsp;
                                {dataRows[0].startTime.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.endTime")}</div>
                            <div className="content">{dataRows[dataRows.length - 1].endTime.toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" })}&nbsp;&nbsp;
                                {dataRows[dataRows.length - 1].endTime.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.workingHour")}</div>
                            <div className="content">{totalWorkingHour}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.distance")}</div>
                            <div className="content">{distance}メートル</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.weeklydistance")}</div>
                            <div className="content">{route.weeklyDistance}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.residenceTime")}</div>
                            <div className="content">{route.residenceTime}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.heatStrokeRisk")}</div>
                            <div className="content">{route.heatStrokeRisk}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.workingFloor")}</div>
                            <div className="content">{route.workingFloor}</div>
                        </div>
                    </div>
                    <div className="icons" onMouseOver={() => handleOver(true)} onMouseLeave={() => handleOver(false)} onTouchStart={handleTouchStart}>
                        <img className="menuImg" src={isPopoverOpen ? Menu_Active : Menu} alt="" onTouchStart={handleTouchStart} />
                        {isPopoverOpen && (
                            <RouteMenu displayRoute={displayRoute} hideRoute={hideRoute} />
                        )}
                    </div>
                </div>
            )}
            {dataRows.length === 0 && (
                <div>
                    <div className="information">
                        <div className="item">
                            <div className="label">{t("routeboard.name")}</div>
                            <div className="content">{route.name}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.helmetNo")}</div>
                            <div className="content">{helmetNum}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.startTime")}</div>
                            <div className="content">--</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.endTime")}</div>
                            <div className="content">--</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.workingHour")}</div>
                            <div className="content">--</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.distance")}</div>
                            <div className="content">--メートル</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.weeklydistance")}</div>
                            <div className="content">{route.weeklyDistance}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.residenceTime")}</div>
                            <div className="content">{route.residenceTime}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.heatStrokeRisk")}</div>
                            <div className="content">{route.heatStrokeRisk}</div>
                        </div>
                        <div className="item">
                            <div className="label">{t("routeboard.workingFloor")}</div>
                            <div className="content">{route.workingFloor}</div>
                        </div>
                    </div>
                    <div className="icons" onMouseOver={() => handleOver(true)} onMouseLeave={() => handleOver(false)} onTouchStart={handleTouchStart}>
                        <img className="menuImg" src={isPopoverOpen ? Menu_Active : Menu} alt="" onTouchStart={handleTouchStart} />
                        {isPopoverOpen && (
                            <RouteMenu displayRoute={displayRoute} hideRoute={hideRoute} />
                        )}
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Board;