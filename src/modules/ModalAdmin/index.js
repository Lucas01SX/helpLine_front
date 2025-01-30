import React, { useState } from 'react';
import {
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
    CFormInput
} from '@coreui/react';

const ModalAdmin = ({ isOpen, onClose, onSubmit }) => {
    const [matricula, setMatricula] = useState('');

    const handleSubmit = () => {
        if (matricula) {
            onSubmit(matricula);
            setMatricula('')
        }
    };

    return (
        <CModal visible={isOpen} onClose={onClose} alignment="center">
            <CModalBody className="text-center">
                {/* Criando o título manualmente para remover o "X" */}
                <h5 className="mb-3">Resetar Senha</h5>
                <CFormInput
                    type="text"
                    placeholder="Insira a matrícula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="mb-3"
                />
            </CModalBody>
            <CModalFooter className="d-flex justify-content-center">
                <CButton color="primary" onClick={handleSubmit}>Enviar</CButton>
                <CButton color="secondary" onClick={onClose}>Fechar</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ModalAdmin;
