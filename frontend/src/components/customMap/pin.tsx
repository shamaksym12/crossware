import React, { FC, useState, useEffect } from 'react';
import Container from "components/Container";
import MemberBoard from "./memberboard";
import RouteBoard from "./routeboard";
import Marker from 'assets/image/icon/marker.png';
import MarkerIn from 'assets/image/icon/marker-in.png';
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { handleChatBox, setSelectedHelmet, handleFileBox } from "redux/app/actions";
import { Helmet } from "redux/app/reducer";
import { googleMapType } from '.';

interface LocationPinProps {
    lat: number;
    lng: number;
    helmet: Helmet;
    googleMap: googleMapType;
    setGoogleMap: (googleMap: googleMapType) => void;
}

const LocationPin: FC<LocationPinProps> = ({ lat, lng, helmet, googleMap, setGoogleMap }) => {
    const [visibleBoard, setVisibleBoard] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const closePopup = (e: any) => {
            if (!e.target.classList.contains('board')) {
                setVisibleBoard(false);
                // dispatch(handleChatBox(false));
            }
        };

        document.body.addEventListener('click', closePopup);

        dispatch(handleChatBox(false));
        dispatch(handleFileBox(false));
        return () => { googleMap.path[`${helmet.projectId}-${helmet.id}`]?.setMap(null); };
    }, []);

    const handleBoard = () => {
        setVisibleBoard(!visibleBoard);

        dispatch(setSelectedHelmet(helmet));
    };

    return (
        <Container>
            {visibleBoard ? <img src={Marker} className="marker" onClick={handleBoard} alt="" />
                : <img src={MarkerIn} className="marker" onClick={handleBoard} alt="" />}

            {location.pathname === "/member" ? visibleBoard && <MemberBoard /> :
                location.pathname === "/workroute" ? visibleBoard && <RouteBoard googleMap={googleMap} setGoogleMap={setGoogleMap} /> :
                    ''}
        </Container>
    );
};

export default LocationPin;