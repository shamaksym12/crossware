import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import Container from "components/Container";

interface AddProjectProps {
    show: boolean;
    hideModal: () => void;
}

const AddProject: FC<AddProjectProps> = (props: AddProjectProps) => {
    const { show, hideModal } = props;

    return (
        <Container className="deleteProjectFormContainer">
            <Modal show={show} onHide={hideModal} size="sm">
                <Modal.Body>
                    <div className="deleteContent">完了しました。</div>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AddProject;
