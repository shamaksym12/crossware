import React, { FC, useState } from 'react';
import { cls } from "utils/functions";
import addImg from "assets/image/icon/add.png";
import Container from 'components/Container';
import { Link } from "react-router-dom";

const AddProject = () => {

    const [isOver, setIsOver] = useState(false);

    const handleOver = (value: boolean) => {
        setIsOver(value);
    };

    return(
        <Container className="addContainer">
            <Link to="/settings" >
                <div className={cls(["contentItem", isOver ? "active" : ""])} onMouseOver={() => { handleOver(true); }} onMouseOut={() => { handleOver(false); }}>
                    {
                        <div>
                            <img src={addImg} className="add" />
                        </div>
                    }
                </div>
            </Link>
        </Container>
    );
};

export default AddProject;