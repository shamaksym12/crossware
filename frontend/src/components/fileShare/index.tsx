import React from 'react';
import Container from "components/Container";
import FileItem from "./fileShare";
import { useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { ShareFile } from 'redux/app';

const Files = () => {
    const { shareFile } = useSelector(
        getAppState
    );

    return (
        <Container className="mainContainer">
            <div className="fileViewContainer">
                {
                    shareFile.map((fileItem: ShareFile, key: number) => (
                        <FileItem data={fileItem} key={key} />
                    ))
                }
            </div>
        </Container>
    );
};

export default Files;
