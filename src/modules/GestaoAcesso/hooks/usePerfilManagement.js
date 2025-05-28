import { useState, useCallback } from 'react';
import socket from '../../../context/Socket';

export const usePerfilManagement = (usuarios, perfisDisponiveis, matriculaLocal, setUsuarios) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState('');
    const [novoPerfilId, setNovoPerfilId] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);

    const handleOpenModal = useCallback((user, type) => {
        setSelectedUser(user);
        setModalType(type);
        setIdUsuario(user.idUsuario);
        setUpdateStatus(null);

        if (type === 'perfil') {
            const perfilAtual = perfisDisponiveis.find(p => p.nome === user.perfil);
            setNovoPerfilId(perfilAtual ? perfilAtual.id : '');
            setShowModal(true);
        }
    }, [perfisDisponiveis]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedUser(null);
        setModalType('');
        setNovoPerfilId('');
        setIdUsuario('');
        setUpdateStatus(null);
    }, []);

    const handlePerfilChange = useCallback((e) => {
        setNovoPerfilId(e.target.value);
    }, []);

    const handleAlterarPerfil = useCallback(() => {
        setIsUpdating(true);
        const perfilSelecionado = perfisDisponiveis.find(p => p.id === novoPerfilId);

        if (!perfilSelecionado) {
            setUpdateStatus('error');
            setIsUpdating(false);
            return;
        }

        socket.emit('atualizar_perfil', {
            idUsuario,
            matriculaLocal,
            novoPerfilId,
            perfilSelecionado: perfilSelecionado.nome
        }, (response) => {
            setIsUpdating(false);

            if (response.message.includes("sucesso")) {
                setUpdateStatus('success');
                const updatedUsuarios = usuarios.map(u =>
                    u.idUsuario === idUsuario
                        ? { ...u, perfil: perfilSelecionado.nome }
                        : u
                );
                setUsuarios(updatedUsuarios);
            } else {
                setUpdateStatus('error');
            }
        });
    }, [idUsuario, novoPerfilId, perfisDisponiveis, usuarios, matriculaLocal, setUsuarios]);

    return {
        showModal,
        selectedUser,
        modalType,
        novoPerfilId,
        isUpdating,
        updateStatus,
        handleOpenModal,
        handleCloseModal,
        handlePerfilChange,
        handleAlterarPerfil
    };
};
