import React, { useState } from 'react';
import {
    CAvatar,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import Modal from '../ModalAdmin'; // Importando a Modal
import avatarImg from '../../assets/img/avatara.jpg';
import '@coreui/coreui/dist/css/coreui.min.css';
import './App.css';
import socket from '../../context/Socket';


const Dropdown = ({ user, onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const codfuncao = user ? user.codfuncao : '';
    const matriculaSolicitacao = user ? user.matricula : '';

    const handleResetPasswordClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleMatriculaSubmit = (matricula) => {
        
        socket.emit('reset_senha', { matricula_reset: matricula, matricula_solicitacao: matriculaSolicitacao }, (response) => {
            console.log(response);
        });
        closeModal();
    };

    const handleSuporteClick = () => {
        navigate('/suporte');
    };

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CAvatar src={avatarImg} size="md" />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0 c-dropdown-menu" placement="bottom-end">
                {[1031, 935, 14942, 15264].includes(codfuncao) && (
                    <>
                        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2 header-dropdown">Account</CDropdownHeader>
                        <CDropdownItem onClick={handleResetPasswordClick}>
                            <CIcon icon={cilUser} className="me-2" />
                            Reset Senha
                        </CDropdownItem>
                        <CDropdownDivider />
                        <CDropdownHeader className="bg-body-secondary fw-semibold my-2 header-dropdown">Páginas - Em Implantação</CDropdownHeader>
                        <CDropdownItem onClick={handleSuporteClick}>
                            <CIcon icon={cilUser} className="me-2" />
                            Manager
                        </CDropdownItem>
                    </>
                )}
                <CDropdownDivider />
                <CDropdownItem onClick={onLogout}>
                    <CIcon icon={cilLockLocked} className="me-2" />
                    Sair
                </CDropdownItem>
            </CDropdownMenu>
            <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleMatriculaSubmit} />
        </CDropdown>
    );
};

export default Dropdown;
