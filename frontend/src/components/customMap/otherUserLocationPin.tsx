import React, {FC} from "react"
import {OtherUserLocation} from "redux/app";
import {Container} from "react-bootstrap";
import Marker from "assets/image/icon/marker.png";

interface otherUserLocationPinProps {
    lat: number;
    lng: number;
    otherUserLocation: OtherUserLocation;
}
const otherUserLocationPin: FC<otherUserLocationPinProps> = (props: otherUserLocationPinProps) => {
    return (<>
        <Container>
            <img src={Marker} className="marker" />
        </Container>
    </>)
}

export default otherUserLocationPin;