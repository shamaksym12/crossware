import React from 'react';
import Container from "components/Container";
import Message from "assets/image/icon/message.png";
import MessageOver from "assets/image/icon/message-over.png";
import Voice from "assets/image/icon/voice.png";
import VoiceOver from "assets/image/icon/voice-hover.png";
// import Capture from "assets/image/icon/capture.png";
// import CaptureOver from "assets/image/icon/capture-over.png";
import Setting from "assets/image/icon/setting.png";
import SettingOver from "assets/image/icon/setting-over.png";
import Item from "./item";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { useTranslation } from "react-i18next";

const Board = () => {
    const { selectedHelmet } = useSelector(
        getAppState
    );

    const { t } = useTranslation();

    return (
        <Container className="controlBoard board">
            <h6 className="positionTitle board">{selectedHelmet.title}</h6>
            <div className="activeStatusWrap">
                <div className="activeStatus">{selectedHelmet.title.charAt(0).toUpperCase()}</div>
            </div>
            <div className="itemsBoard board">
                <Item icon={Message} iconOver={MessageOver} label={t("memberboard.text")} value="text" />
                <Item icon={Voice} iconOver={VoiceOver} label={t("memberboard.call")} value="call" />
                {/* <Item icon={Capture} iconOver={CaptureOver} label={t("memberboard.camerashare")} value="camera" /> */}
                <Item icon={Setting} iconOver={SettingOver} label={t("memberboard.fileshare")} value="file" />
            </div>
        </Container>
    );
  };

export default Board;