import React, { useEffect } from "react";
import Container from "components/Container";
import CustomMap from "components/customMap";

const WorkRoute = () => {

  useEffect(() => {
    const disableZoom = (event: any) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    const disableScroll = (event: any) => {
      event.preventDefault();
    };

    document.addEventListener('gesturestart', disableZoom);
    document.addEventListener('touchmove', disableScroll, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', disableZoom);
      document.removeEventListener('touchmove', disableScroll);
    };
  }, []);
  
  return (
    <Container className="routeContainer">
      <CustomMap />
    </Container>
  );
};

export default WorkRoute;
