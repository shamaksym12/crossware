import React, { useEffect, useState } from "react";
import Container from "components/Container";
import GoogleMapReact from 'google-map-react';
import LocationPin from "./pin";
import MyLocationPin from "./myLocationPin";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { Helmet, MyLocation, OtherUserLocation } from "redux/app/reducer";
import { getOtherUserLocations } from "redux/app";
import OtherUserLocationPin from "components/customMap/otherUserLocationPin";

export interface googleMapType {
  map?: google.maps.Map;
  maps?: any;
  path: { [name: string]: google.maps.Polyline };
}

const CustomMap = () => {
  const [currentLocations, setCurrentLocations] = useState<Helmet[]>([]);
  const [center, setCenter] = useState<MyLocation>();
  const [googleMap, setGoogleMap] = useState<googleMapType>({ path: {} });

  const dispatch = useDispatch()

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";
  const TOKYO_STATION_LAT = 35.681247102494765;
  const TOKYO_STATION_LNG = 139.76712270470023;

  const { selectedLocations, myLocation, otherUserLocations, user, token } = useSelector(
    getAppState
  );

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getOtherUserLocations(token))
    }, 1000 * 30)
    dispatch(getOtherUserLocations(token))

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    if (selectedLocations.length) {
      const myCenter = {
        lat: parseFloat(selectedLocations[selectedLocations.length - 1].location.lat),
        lng: parseFloat(selectedLocations[selectedLocations.length - 1].location.lng)
      }

      setCenter(myCenter);
    } else {
      setCenter(myLocation);
    }

    setCurrentLocations(selectedLocations);
  }, [selectedLocations, myLocation]);

  return (
    <Container className="customMapContainer">
      {currentLocations && (center || myLocation) && <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
        center={center && center.lat == 0 && center.lng == 0 ? { lat: TOKYO_STATION_LAT, lng: TOKYO_STATION_LNG } : center}
        defaultZoom={14}
        onGoogleApiLoaded={({ map, maps }: { map: google.maps.Map, maps: typeof google.maps }) => {
          setGoogleMap({ map, maps, path: {} });
        }}
      >
        {myLocation && <MyLocationPin
          lat={myLocation.lat == 0.00000000 ? TOKYO_STATION_LAT : myLocation.lat}
          lng={myLocation.lng == 0.00000000 ? TOKYO_STATION_LNG : myLocation.lng}
        />}
        {
          currentLocations.map((location, key) => {
            if (location) {
              return (
                <LocationPin
                  lat={location.location.lat == 0.00000000 ? TOKYO_STATION_LAT : location.location.lat}
                  lng={location.location.lng == 0.00000000 ? TOKYO_STATION_LNG : location.location.lng}
                  helmet={location}
                  key={key}
                  googleMap={googleMap}
                  setGoogleMap={setGoogleMap}
                />
              );
            }
            return null;
          })
        }
        {
          otherUserLocations.map((location: OtherUserLocation, key: number) =>
            location && location.location_lat && location.location_lng && location.id != user.id &&
            <OtherUserLocationPin
              lat={location.location_lat}
              lng={location.location_lng}
              otherUserLocation={location}
              key={key}
            />
          )
        }
      </GoogleMapReact>}
    </Container>
  );
};

export default CustomMap;