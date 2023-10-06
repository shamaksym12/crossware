import React, { useEffect } from "react";
import Container from "components/Container";
import CustomMap from "components/customMap";
import TextBoard from "components/control/text";
import Notification from "components/Notification";
import FileBoard from "components/control/file";

const Member = () => {
  
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
    <Container className="memberContainer">
      <CustomMap />

      <TextBoard />
      <Notification />
      <FileBoard />
    </Container>
  );
};

export default Member;
