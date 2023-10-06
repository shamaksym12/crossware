import React, { FC, useState } from 'react';
import { cls } from "utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { handleChatBox, handleNotification, handleFileBox, getShareFile } from "redux/app/actions";
import { useNavigate } from "react-router-dom";
import { TrtcCalling } from "App";
import TRTC from 'trtc-js-sdk';
import { getAppState } from "redux/app/selectors";

interface ItemProps {
    icon: string;
    iconOver: string;
    label: string;
    value: string;
}

const Item: FC<ItemProps> = (props: ItemProps) => {
    const { icon, iconOver, label, value } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedHelmet, token } = useSelector(
        getAppState
    );

    const [isOver, setIsOver] = useState(false);

    const checkDevices = async () => {
        // const cameraList = await TRTC.getCameras();
        const micList = await TRTC.getMicrophones();

        // if (!cameraList.length) return { result: false, message: "Please connect your camera!" };
        if (!micList.length) return { result: false, message: "Please connect your microphone!" };
        else return { result: true };
    };

    const handleBoard = async () => {
        if (value === "text") dispatch(handleChatBox(true));
        if (value === "file") dispatch(handleFileBox(true));
        switch (value) {
            case 'text':
                dispatch(handleChatBox(true));
                dispatch(handleFileBox(false));
                break;

            case 'file':
                dispatch(handleFileBox(true));
                dispatch(getShareFile(selectedHelmet.id, token));
                dispatch(handleChatBox(false));
                break;

            case 'call':
                const res = await checkDevices();

                if (res.result) {
                    TrtcCalling.call({
                        userID: selectedHelmet.trtcId,
                        type: 2
                    }).then(() => {
                        console.log('calling ...')
                    });

                    navigate('/call');
                } else {
                    dispatch(handleNotification({ title: "No Device Error!", content: "Please check if you connected microphone!", show: true }));
                }
                break;

            default:
                break;
        }
    };

    return (
        <div className={cls(["itemBoard board"])} onMouseEnter={() => setIsOver(true)} onMouseLeave={() => setIsOver(false)} onClick={handleBoard}>
            {isOver ? <img className="board" src={iconOver} /> : <img className="board" src={icon} />}
            <h6 className="board">{label}</h6>
        </div>
    );
};

export default Item;
