import React, { FC } from 'react';
import Container from "components/Container";
import Marker from 'assets/image/icon/marker-cur.png';


interface myLocationPinProps {
    lat: number;
    lng: number;
}

const MyLocationPin: FC<myLocationPinProps> = (_: myLocationPinProps) => {
    return (
        <Container>
            <img src={Marker} className="marker" />
        </Container>
    );
};

export default MyLocationPin;
