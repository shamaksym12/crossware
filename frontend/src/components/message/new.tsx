import React, { FC, useRef, useState } from 'react';
import Container from "components/Container";
import { Input, Button, InputRef } from 'antd';
import { Database, ref, push } from 'firebase/database';
import { Helmet } from "redux/app/reducer";
import { useTranslation } from "react-i18next";

interface NewMessageProps {
    user_name: string;
    helmet_id: Helmet;
    db: typeof Database
}

const NewMessage: FC<NewMessageProps> = (props: NewMessageProps) => {
    const { user_name: user_id, helmet_id, db } = props;

    const [value, setValue] = useState("");

    const { t } = useTranslation();

    const msgBox = document.getElementById("msgBox") as HTMLInputElement | null;

    const sendMessage = () => {
        if (msgBox == null) return;
        if (helmet_id.deviceId == null || helmet_id.deviceId === '') {
            alert("デバイスIDが見つかりません");
            return;
        }
        push(ref(db, `/notification/${helmet_id.deviceId}`), {
            sentBy: user_id,
            msg: value,
            timestamp: new Date().getTime()
        });

        setValue("");
    };

    return (
        <Container className="newMessageContainer">
            <Input id="msgBox" className="form-control" required value={value} onChange={(e) => setValue(e.target.value)} size="large" placeholder={t("textmsg.placeholder")} maxLength={30} />
            <Button onClick={sendMessage}>{t("textmsg.btn")}</Button>
        </Container>
    );
};

export default NewMessage;