import React, { useState } from 'react';
import Rnd from 'react-rnd';
import { useDispatch, useSelector } from "react-redux";
import { setVisibleDetailModal } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import Close from "assets/image/icon/close-ex.png";
import Zoom from "assets/image/icon/zoom-ex.png";
import { cls } from "utils/functions";

const AddReport = () => {
    const dispatch = useDispatch();
    const { selectedMedia, token } = useSelector(
        getAppState
    );

    const projects = JSON.parse(localStorage.getItem('project')!);
    const project_id = projects.id;

    const [reducedScale, setReducedScale] = useState(false);

    const hideModal = () => {
        dispatch(setVisibleDetailModal(false));
    };

    const toggleScale = () => {
        setReducedScale(!reducedScale);
    };

    const API_URL = process.env.API_URL;
    const selectModal = () => {
        const rnds = document.getElementsByClassName("react-draggable");
        for (let i = 0; i < rnds.length; i++) {
            rnds[i].classList.remove("focused");
        }

        document.getElementsByClassName("detailModal")[0].classList.add("focused");
    };

    return (
        <Rnd
            default={{
                x: 180,
                y: 20,
                width: 980,
                height: 690
            }}
            minWidth={'40%'}
            minHeight={'40%'}
            maxWidth={'100%'}
            maxHeight={'100%'}
            bounds="window"
            className={cls(["detailModal", reducedScale ? "reducedScale" : "", selectedMedia.type === "video" ? "video" : ""])}
            onClick={selectModal}
            dragHandleClassName="header"
            >
            <div className="header">
                <div className="leftPanel">
                    <div className="control">
                        <img src={Close} className="magnify" onClick={hideModal} />
                        <img src={Zoom} className="closeModal" onClick={toggleScale} />
                    </div>
                    <div className="detailTitle">{selectedMedia.title}</div>
                </div>
                <div className="rightPanel">
                    <div className="detailDate">{selectedMedia.date}</div>
                    <div className="">{selectedMedia.name}</div>
                </div>
            </div>
            <div className="content">
                {selectedMedia.type === "image" ?
                    <img src={`${API_URL}/api/media/data/${project_id}/${selectedMedia.url}?token=${token}`} className="imageBack" /> :
                    <video controls>
                        <source src={`${API_URL}/api/media/data/${project_id}/${selectedMedia.url}?token=${token}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                }
            </div>
        </Rnd>
    );
};

export default AddReport;
