import React, { useEffect, useState } from 'react';
import Container from "components/Container";
import { cls, dateList } from "utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { Select, Button } from 'antd';
import Close from 'assets/image/icon/close.png'
import Message, { MessageItem } from "components/message";
import NewMessage from 'components/message/new';
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, off } from 'firebase/database';
import { useTranslation } from "react-i18next";
import { handleChatBox } from 'redux/app';



const TextBoard = () => {
    const { Option } = Select;
    const [recentDates, setRecentDates] = useState<string[]>();
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const firebaseConfig = {
        databaseURL: process.env.FIREBASE_RD_URL
    }

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    const { visibleChatBox, selectedHelmet } = useSelector(
        getAppState
    );

    const hideChatBox = () => {
        dispatch(handleChatBox(false));
    }


    const [messageRef, setMessageRef] = useState(ref(database, `/notification/${selectedHelmet.deviceId}`));

    const updateMessages = (data: any) => {
        setMessages(_ => {
            var ret: MessageItem[] = [];
            for (const key in data) {
                const message = data[key];
                var date = new Date()
                date.setTime(message.timestamp)
                ret.push({
                    msg: message.msg,
                    timestamp: date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
                    sentBy: message.sentBy,
                })
            }
            return ret;
        });
    };

    useEffect(() => {
        off(messageRef)
        setMessageRef(ref(database, `/notification/${selectedHelmet.deviceId}`))
    }, [selectedHelmet]);

    useEffect(() => {
        setMessages([]);
        onValue(messageRef, (snapshot: { exists: () => any; val: () => any; }) => {
            if (snapshot.exists()) {
                updateMessages(snapshot.val());
            }
        });
    }, [messageRef]);

    useEffect(() => {
        setRecentDates(dateList(7));
    }, []);

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    }

    return (
        <Container className={cls(["textBoardContainer board", visibleChatBox ? "showBox" : ''])} >
            <img src={Close} className="closeButton" alt="Close" onClick={hideChatBox} />
            <h4 className="chatTitle board">{t("textmsg.title")}</h4>
            <div className="mt-3">
                {recentDates && <Select defaultValue={recentDates[0]} style={{ width: 120 }} onChange={handleChange}>
                    {recentDates.map((date, key) => (<Option value="jack" key={key}>{date}</Option>))}
                </Select>}
            </div>
            <div className="mt-5">
                {
                    messages &&
                    messages.map((message, key) => (
                        <Message message={message} key={key} />
                    ))
                }
            </div>
            <div className="newMessage">
                <NewMessage user_name={process.env.TRTC_CALLING_USER_ID || ""} helmet_id={selectedHelmet} db={database} />
            </div>
        </Container>
    );
};

export default TextBoard;