import React, { FC, useState, useEffect } from 'react';
import Container from "components/Container";
import { ShareFile } from "redux/app/reducer";
import Close from 'assets/image/icon/close.png'
import Check from 'assets/image/icon/check.png'
import Share from 'assets/image/icon/share.png'
import Share_White from 'assets/image/icon/share-white.png'
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app'
import { DataSnapshot } from '@firebase/database-types';
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";

export interface ItemProps {
    data: ShareFile;
}

const FileShare: FC<ItemProps> = (props: ItemProps) => {
    const { data } = props;
    const [isOver, setIsOver] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")!);
    const userName = user.first_name + user.last_name;

    const { selectedHelmet, token } = useSelector(
        getAppState
    );

    const firebaseConfig = {
        databaseURL: process.env.FIREBASE_RD_URL
    }

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const API_URL = process.env.API_URL;

    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const formattedDate = `${day}/${month}/${year}`;
    const formattedDateWithDashes = formattedDate.replace(/\//g, '-');

    useEffect(() => {
        const sharedRef = ref(database, `/share/project${selectedHelmet.projectId}/${selectedHelmet.id}/${formattedDateWithDashes}`);
        onValue(sharedRef, (snapshot: DataSnapshot) => {
            const sharedData = snapshot.val();
            if (sharedData) {
                const sharedImages = Object.values(sharedData);
                const isShared = sharedImages.some((image: any) => {
                    return image.path === `${API_URL}/api/helmet/${selectedHelmet.id}/share/${data.name}`;
                });
                setIsImageVisible(isShared);
            }
        });

        return () => {
            onValue(sharedRef, null);
        };
    }, [selectedHelmet.id, data.name, formattedDateWithDashes]);


    const handleOver = (value: boolean) => {
        setIsOver(value);
    };

    const preview = () => {
        switch (data.type) {
            case "image":
                return <img className="img" src={`${API_URL}/api/helmet/${selectedHelmet.id}/share/${data.name}?token=${token}`} alt="" />;
            case "video":
                return <div></div>;
            default:
                return <div></div>;
        }
    }

    const check = () => {
        if (isImageVisible) {
            return <img className="check" src={Check} alt="" />
        } else {
            return null;
        }
    };

    const handleShare = () => {
        if (selectedHelmet.id == null || selectedHelmet.id === '') {
            alert("デバイスIDが見つかりません");
            return;
        }
        push(ref(database, `/share/project${selectedHelmet.projectId}/${selectedHelmet.id}/${formattedDateWithDashes}`), {
            path: `${API_URL}/api/helmet/${selectedHelmet.id}/share/${data.name}`,
            username: userName,
            timestamp: new Date().getTime()
        });
        setIsImageVisible(true);
    }

    return (
        <Container className="contentItem">
            <div className="close">
                <img src={Close} className="closeBtn" alt="" />
            </div>
            <div>
                {preview()}
            </div>
            <div className="">
                <div className="information">
                    <div className="title">{data.name}</div>
                    <div className="icons">
                        {check()}
                    </div>
                    <div className="icons" onMouseOver={() => handleOver(true)} onMouseLeave={() => handleOver(false)}>
                        {isOver ? (
                            <img className="share" src={Share} alt="" onClick={handleShare} />
                        ) : (
                            <img className="share" src={Share_White} alt="" onClick={handleShare} />
                        )}
                    </div>
                </div>
                <div className="information">
                    <div className="date">{new Date(data.lastModified).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</div>
                    <div className="name">{userName}</div>
                </div>
            </div>
        </Container>
    );
}

export default FileShare;
