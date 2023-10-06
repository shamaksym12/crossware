import React, { useState, useEffect, Key, FC } from "react";
import Container from "components/Container";
import { useSelector, useDispatch } from "react-redux";
import { getProjectBoard} from "redux/app/actions";
import { Project_Board } from "redux/app/reducer";
import ProjectItem from "./projectBoard";
import { getAppState } from "redux/app/selectors";

const ProjectView = () =>{
    const { project_board , token} = useSelector(
        getAppState
    );

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user')!);
    const API_URL = process.env.API_URL;
    var company_id = `${user.company_id}`;

    useEffect(() => {
        dispatch(getProjectBoard(company_id, token))
    }, []);

    return (
        <Container className="mainContainer">
            <div className="projectViewContainer">
                {
                    project_board.map((data: Project_Board) => { return <ProjectItem key={data.id} data={data}/>; })
                }
            </div>  
        </Container>
    );
};

export default ProjectView;