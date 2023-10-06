import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileUploader } from "react-drag-drop-files";
import { getAppState } from "redux/app/selectors";
import axios from "axios";
import FileItem, { ItemProps } from "./fileShare";

const fileTypes = ["image/jpeg", "image/png", "application/pdf"];

const DragDrop = () => {
    const API_URL = process.env.API_URL;
    const dispatch = useDispatch();
    const { token, selectedHelmet } = useSelector(getAppState);
    const user = JSON.parse(localStorage.getItem("user")!);

    const handleDrop = (fileList: FileList) => {
        console.log(fileList)
        const files = Array.from(fileList);
        files.forEach(async (file) => {
            const formData = new FormData();
            formData.append("file", file, encodeURIComponent(file.name));
            try {
                const response = await axios.post(`${API_URL}/api/helmet/${selectedHelmet.id}/share`, formData, {
                    headers: { "Content-Type": "multipart/form-data", 'x-access-token': token },
                });

                console.log("Files uploaded successfully!");
            } catch (error) {
                console.error(error);
            }
        });
    };

    return (
        <div>
            <FileUploader
                handleChange={handleDrop}
                name="file"
                type={fileTypes}
                multiple={true}
            />
        </div>
    );
};

export default DragDrop;
