import React, { useState, useEffect, useRef } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import Container from "components/Container";
import SideBar from "components/sidebar";
import Header from "components/header";
import AddReport from "components/rnd/addReport";
import MediaDetail from "components/rnd/mediaDetail";
import Ringtone from "assets/audio/ringtone.mp3";
import Sound from "assets/image/icon/sound-white.png";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { TrtcCalling } from "App";
import TRTCCalling from 'trtc-calling-js';
import Modal from "react-bootstrap/Modal";
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleSoundNotification } from "redux/app/actions";

const initInviteData = {
    version: 1,
    callType: 2,
    callEnd: 0,
    roomID: ''
}

const DefaultLayout = (props: { children: React.ReactChild }) => {
    const [inviteID, setInviteID] = useState('');
    const [sponsor, setSponsor] = useState('');
    const [inviteData, setInviteData] = useState(initInviteData);
    const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();

    const { soundnotification } = useSelector(
        getAppState
    );

    const ringtoneRef = useRef(new Audio(Ringtone));
    const [ringtone, setRingtone] = useState(ringtoneRef.current);

    const [, setMuted] = useState(true);

    const { t } = useTranslation();

    useEffect(() => {
        setModalVisible(visibleConfirmModal);
    }, [visibleConfirmModal]);

    const { visibleAddReportModal, visibleDetailModal } = useSelector(
        getAppState
    );
    const navigate = useNavigate();

    function isiOS(): boolean {
        return (
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(window as any).MSStream
        );
    }

    const handleModalVisibility = (visible: boolean) => {
        setVisibleConfirmModal(visible);
    };

    useEffect(() => {
        ringtoneRef.current.load();

        TrtcCalling.on(
            TRTCCalling.EVENT.INVITED,
            handleInvited
        );

        TrtcCalling.on(
            TRTCCalling.EVENT.KICKED_OUT,
            handleKickedOut
        );

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                console.log('You let me use your mic!')
            })
            .catch(function (err) {
                console.log('No mic for you!')
            });
    }, []);

    useEffect(() => {
        if (isiOS()) {
            console.log('This is an iOS device');
            if (visibleConfirmModal) {
                dispatch(handleSoundNotification({ title: "着信音を許可", content: "着信音を許可", show: true }));
            }
        } else {
            console.log('This is not an iOS device');
        }
    }, [visibleConfirmModal, dispatch]);

    const handleKickedOut = () => {
        console.log("handleKickedOut");
        TrtcCalling.logout();
    };

    const playRingtone = () => {
        if (modalVisible) {
            const playPromise = ringtone.play();
            if (playPromise !== undefined)
                return playPromise
                    .then(() => setMuted(false))
                    .catch(() => setMuted(false));
        }
    };

    const handleInvited = ({ inviteID, sponsor, inviteData }: any) => {
        console.log('handleInvited', inviteID, sponsor, inviteData);
        setInviteID(inviteID);
        setSponsor(sponsor);
        setInviteData(inviteData);
        setVisibleConfirmModal(true);
    };

    const showConfirmModal = () => {
        setVisibleConfirmModal(true);
        setModalVisible(true);
        playRingtone();
    };

    const hideModal = () => {
        setVisibleConfirmModal(false);
        setModalVisible(false);
        ringtone.pause();
        ringtone.currentTime = 0;
    };

    const acceptInvitation = () => {
        TrtcCalling.accept({
            inviteID: inviteID,
            roomID: inviteData.roomID,
            callType: inviteData.callType
        }).then(() => {
            console.log('accepting...')
            ringtone.pause();
            ringtone.currentTime = 0;
        });

        setVisibleConfirmModal(false);
        ringtone.pause();
        ringtone.currentTime = 0;
        hideNotification();
        navigate('/call');
    };

    const rejectInvitation = () => {
        TrtcCalling.reject();
        setVisibleConfirmModal(false);
        ringtone.pause();
        ringtone.currentTime = 0;
        hideNotification();
    };

    const hideNotification = () => {
        dispatch(handleSoundNotification({ title: "", content: "", show: false }));
    };

    const handleClick = () => {
        playRingtone();
        hideNotification();
    };

    return (
        <div className="mainContent" id="mainContent">
            <Container className="sideBar">
                <SideBar />
            </Container>
            <Container className="rightContent">
                <Header />
                {props.children}
            </Container>
            {visibleDetailModal && <MediaDetail />}
            {visibleAddReportModal && <AddReport />}
            <Modal className="callAlertContainer" show={visibleConfirmModal} onHide={hideModal} size="lg" onEntered={() => { handleModalVisibility(true); showConfirmModal(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>{inviteData.callType == 2 ? `${t('call.Title1')}` : `${t('call.Title2')}`}</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6><b>{sponsor}</b> {inviteData.callType == 2 ? `${t('call.AlertMsg1')}` : `${t('call.AlertMsg2')}`}</h6>
                    <div>
                        <Button type="primary" onClick={acceptInvitation} >
                            {
                                `${t('call.Accept')}`
                            }
                        </Button>
                        <Button type="primary" onClick={rejectInvitation} >
                            {
                                `${t('call.Reject')}`
                            }
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer position={'top-end'}>
                <Toast onClose={() => hideNotification()} show={soundnotification.show} delay={5000}>
                    <Toast.Header>
                        <strong className="me-auto">{soundnotification.title}</strong>
                    </Toast.Header>
                    <Toast.Body className="center">
                        <Button className="ant-btnSound" onClick={handleClick}>
                            <img className="img" src={Sound} alt="" />{soundnotification.content}
                        </Button>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default DefaultLayout