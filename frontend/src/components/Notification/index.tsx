import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { getAppState } from "redux/app/selectors";
import { useDispatch, useSelector } from "react-redux";
import { handleNotification } from "redux/app/actions";

const Notification = () => {

  const { notification } = useSelector(
    getAppState
  );
  const dispatch = useDispatch();

  const hideNotification = () => {
    dispatch(handleNotification({ title: "", content: "", show: false }));
  };

  return (
    <>
      <ToastContainer position={'top-end'}>
        <Toast onClose={() => hideNotification()} show={notification.show} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">{notification.title}</strong>
          </Toast.Header>
          <Toast.Body>{notification.content}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Notification;
