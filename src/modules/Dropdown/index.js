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
import { cilChartLine, cilLockLocked, cilUser, cilControl } from '@coreui/icons';
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

    const handleManagerClick = () => {
        navigate('/manager');
    };

    const handleRelatorioClick = () => {
        navigate('/relatorio');
    };

    const handleGestaoAcessoClick = () => {
        navigate('/gestao/acesso');
    }
    const ROLE_PERMISSIONS = {
        admins: [1031, 935, 14942, 15264, 828, 574, 572, 15],
        planejamento: [1031, 935, 14942, 15264, 828],
        users: [496,836,944, 14943],
    };
    
    const hasAdminAccess = ROLE_PERMISSIONS.admins.includes(codfuncao);
    const hasPlanejamentonAccess = ROLE_PERMISSIONS.planejamento.includes(codfuncao);
    const hasUserAccess = ROLE_PERMISSIONS.users.includes(codfuncao);

    return (
        <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
            <CAvatar src={avatarImg} size="md" />
        </CDropdownToggle>

        <CDropdownMenu className="pt-0 c-dropdown-menu" placement="bottom-end">
            {(hasAdminAccess || hasUserAccess) && (
                <>
                    <CDropdownHeader className="bg-body-secondary fw-semibold mb-2 header-dropdown">Account</CDropdownHeader>
                    <CDropdownItem onClick={handleResetPasswordClick}>
                        <CIcon icon={cilUser} className="me-2" />
                        Reset Senha
                    </CDropdownItem>
                    <CDropdownDivider />
                </>
            )}
            {hasAdminAccess && (
                <>
                    <CDropdownHeader className="bg-body-secondary fw-semibold my-2 header-dropdown">Páginas</CDropdownHeader>
                    <CDropdownItem onClick={handleSuporteClick}>
                        <CIcon icon={cilUser} className="me-2" />
                        Suporte
                    </CDropdownItem>
                    <CDropdownItem onClick={handleManagerClick}>
                        <CIcon icon={cilUser} className="me-2" />
                        Manager
                    </CDropdownItem>
                    <CDropdownItem onClick = {handleRelatorioClick}>
                        <CIcon icon={cilChartLine} className="me-2" />
                        Relatorio
                    </CDropdownItem>
                    <CDropdownDivider />
                </>
            )} {hasPlanejamentonAccess && (
                <>
                    <CDropdownItem onClick={handleGestaoAcessoClick}>
                        <CIcon icon={cilControl} className="me-2" />
                        Gestão de Acesso
                    </CDropdownItem>
                </>
            )

            }

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
