import React, { useEffect, useState } from "react";
import Container from "components/Container";
import CustomMap from "components/customMap";
import { useNavigate } from "react-router-dom";
import { cls } from "utils/functions";
import Mute from "assets/image/icon/mute.png";
import UnMute from "assets/image/icon/unmute.png";
import End from "assets/image/icon/end.png";
import Scale from "assets/image/icon/scale.png";
import CallUser from "assets/image/icon/call-user.png";
import { TrtcCalling } from "App";
import TRTCCalling from 'trtc-calling-js';
import { useDispatch, useSelector } from "react-redux";
import { handleNotification } from "redux/app/actions";
import Notification from "components/Notification";
import { getAppState } from "redux/app/selectors";
import { useTranslation } from "react-i18next";

const Call = () => {
    const [isFull, setIsFull] = useState(true);
    const [muted, setMuted] = useState(true);
    const [userEntered, setUserEntered] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedHelmet } = useSelector(
        getAppState
    );

    const { t } = useTranslation();

    useEffect(() => {
        TrtcCalling.on(
            TRTCCalling.EVENT.USER_ENTER,
            handleUserEnter
        );

        TrtcCalling.on(
            TRTCCalling.EVENT.USER_ACCEPT,
            handleUserAccept
        );

        TrtcCalling.on(
            TRTCCalling.EVENT.USER_LEAVE,
            handleUserLeave
        );

        TrtcCalling.on(
            TRTCCalling.EVENT.REJECT,
            handleReject
        );

        TrtcCalling.on(
            TRTCCalling.EVENT.LINE_BUSY,
            handleUserBusy
        );

        TrtcCalling.on(
            TRTCCalling.EVENT.CALLING_TIMEOUT,
            handleTimeout
        );
    }, []);

    const handleReject = ({ userID }: any) => {
        dispatch(handleNotification({ title: "Call Status", content: "The user rejected call, please try again later!", show: true }));
    };

    const handleUserLeave = ({ userID }: any) => {
        dispatch(handleNotification({ title: "Call Status", content: "The user left call.", show: true }));
        handleHangup();
    };

    const handleUserAccept = ({ userID }: any) => {
        TrtcCalling.closeCamera();
        
        dispatch(handleNotification({ title: "Call Status", content: "The user accepted call!", show: true }));
    };

    const handleTimeout = ({ userID }: any) => {
        dispatch(handleNotification({ title: "Call Status", content: "The user doesn't respond, please try again later!", show: true }));
    };

    const handleUserBusy = ({ userID }: any) => {
        dispatch(handleNotification({ title: "Call Status", content: "The user you are calling is busy now, please try again later!", show: true }));
    };

    const handleUserEnter = ({ userID }: any) => {
        TrtcCalling.startRemoteView({
            userID: userID,
            videoViewDomID: 'remoteVideo'
        });

        setUserEntered(true);
    };

    const handleScreen = () => {
        setIsFull(!isFull);
    };

    const handleMute = () => {
        if (userEntered) {
            setMuted(!muted);
            TrtcCalling.setMicMute(muted);
        }
    };

    const handleHangup = () => {
        TrtcCalling.hangup();
        navigate('/member');
    };

  return (
    <Container className="callContainer">
        {userEntered && <CustomMap />}
        <div className={cls(["video", isFull ? "full" : "reduced"])}>
            <div className="background" id="remoteVideo">
                {!userEntered && <img src={CallUser} />}
            </div>
            { userEntered && <>
                <div className="title">{selectedHelmet.title}</div>
                <img src={Scale} className="scale" onClick={handleScreen} />
            </> }
        </div>
        <div className="control">
            <div className="controls">
                {muted ? <div className="unit">
                    <img src={Mute} onClick={handleMute} />
                    <div>{t("call.unmute")}</div>
                </div> :
                <div className="unit">
                    <img src={UnMute} onClick={handleMute} />
                    <div>{t("call.mute")}</div>
                </div>}
                <div className="unit" onClick={handleHangup}>
                    <img src={End} />
                    <div>{t("call.end")}</div>
                </div>
            </div>
        </div>
        <Notification />
    </Container>
  );
};

export default Call;
