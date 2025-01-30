import React from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

const ModalAlert = ({ message, modalVisivel, setModalVisivel }) => {
    return (
        <CModal visible={modalVisivel} onClose={() => setModalVisivel(false)}>
            <CModalHeader closeButton>
                <h5>Aviso</h5>
            </CModalHeader>
            <CModalBody>
                {message}
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={() => setModalVisivel(false)}>
                    OK
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ModalAlert;
