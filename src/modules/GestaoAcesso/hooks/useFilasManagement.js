import { useState, useCallback, useEffect } from 'react';
import useDebounce from './useDebounce';
import socket from '../../../context/Socket';

export const useFilasManagement = (filas, usuarios, setUsuarios, user) => {
    console.log(user);
    const [showFilasModal, setShowFilasModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [idUsuario, setIdUsuario] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [isAjuste, setIsAjuste] = useState(false);

    const [segmentoSelecionado, setSegmentoSelecionado] = useState('all');
    const [termoBuscaDisponiveisRaw, setTermoBuscaDisponiveisRaw] = useState('');
    const [termoBuscaSelecionadasRaw, setTermoBuscaSelecionadasRaw] = useState('');
    const termoBuscaDisponiveis = useDebounce(termoBuscaDisponiveisRaw, 300);
    const termoBuscaSelecionadas = useDebounce(termoBuscaSelecionadasRaw, 300);

    const [filasDisponiveis, setFilasDisponiveis] = useState([]);
    const [filasSelecionadasTemporarias, setFilasSelecionadasTemporarias] = useState([]);

    const [selecionadasParaAdicionar, setSelecionadasParaAdicionar] = useState([]);
    const [selecionadasParaRemover, setSelecionadasParaRemover] = useState([]);

    useEffect(() => {
        let filtradas = [...filas];
        if (segmentoSelecionado !== 'all') {
            filtradas = filtradas.filter(f => f.segmento === segmentoSelecionado);
        }
        if (termoBuscaDisponiveis.trim()) {
            const termo = termoBuscaDisponiveis.toLowerCase();
            filtradas = filtradas.filter(f =>
                f.fila.toLowerCase().includes(termo) ||
                String(f.mcdu || '').toLowerCase().includes(termo) ||
                String(f.segmento || '').toLowerCase().includes(termo)
            );
        }

        filtradas = filtradas.filter(f => !filasSelecionadasTemporarias.some(fs => fs.fila === f.fila));
        setFilasDisponiveis(filtradas);
    }, [filas, segmentoSelecionado, termoBuscaDisponiveis, filasSelecionadasTemporarias]);

    const filasSelecionadasFiltradas = termoBuscaSelecionadas.trim()
        ? filasSelecionadasTemporarias.filter(f => {
            const termo = termoBuscaSelecionadas.toLowerCase();
            return f.fila.toLowerCase().includes(termo) ||
                String(f.mcdu || '').toLowerCase().includes(termo) ||
                String(f.segmento || '').toLowerCase().includes(termo);
        })
        : filasSelecionadasTemporarias;


    const handleOpenModal = useCallback((user, type) => {
        if (type === 'filas') {
            setSelectedUser(user);
            setIdUsuario(user.idUsuario);
            setUpdateStatus(null);
            const filasCadastradas = user.filasDetalhes.map((fila, idx) => ({
                fila,
                mcdu: user.mcdu[idx] || '',
                segmento: user.segmentos[idx] || ''
            }));
            setFilasSelecionadasTemporarias(filasCadastradas);
            setIsAjuste(user.filas === 'Cadastradas');
            setShowFilasModal(true);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowFilasModal(false);
        setSelectedUser(null);
        setIdUsuario('');
        setUpdateStatus(null);
        setSegmentoSelecionado('all');
        setTermoBuscaDisponiveisRaw('');
        setTermoBuscaSelecionadasRaw('');
        setSelecionadasParaAdicionar([]);
        setSelecionadasParaRemover([]);
    }, []);

    const handleCadastrarFilas = useCallback(() => {
        setIsUpdating(true);
        const filasParaEnviar = filasSelecionadasTemporarias.map(f => f.fila);
        const mcduParaEnviar = filasSelecionadasTemporarias.map(f => f.mcdu);
        const segmentosParaEnviar = filasSelecionadasTemporarias.map(f => f.segmento);

        const userData = {
            idUsuario,
            matricula: selectedUser?.matricula,
            login: selectedUser?.login,
            nome: selectedUser?.nome,
            filas: filasParaEnviar.join(','),
            mcdu: mcduParaEnviar.join(','),
            segmentos: segmentosParaEnviar.join(','),
            situacao: isAjuste ? 'ajuste' : 'cadastro',
            mat_responsavel: user.login
        };

        socket.emit('atualizar_filas', userData, (response) => {
            setIsUpdating(false);
            if (Array.isArray(response) && response[0].message.includes("sucesso")) {
                setUpdateStatus('success');
                const updatedUsuarios = usuarios.map(u =>
                    u.idUsuario === idUsuario
                        ? {
                            ...u,
                            filas: filasParaEnviar.length > 0 ? 'Cadastradas' : 'Não Cadastradas',
                            filasDetalhes: filasParaEnviar,
                            mcdu: mcduParaEnviar,
                            segmentos: [...new Set(segmentosParaEnviar)]
                        }
                        : u
                );
                setUsuarios(updatedUsuarios);
            } else {
                setUpdateStatus('error');
            }
        });
    }, [idUsuario, filasSelecionadasTemporarias, usuarios, selectedUser, setUsuarios, isAjuste]);

    const adicionarFilas = useCallback(() => {
        const toAdd = filasDisponiveis.filter(f => selecionadasParaAdicionar.includes(f.fila));
        setFilasSelecionadasTemporarias(prev => [...prev, ...toAdd]);
        setSelecionadasParaAdicionar([]);
    }, [filasDisponiveis, selecionadasParaAdicionar]);

    const removerFilas = useCallback(() => {
        setFilasSelecionadasTemporarias(prev =>
            prev.filter(f => !selecionadasParaRemover.includes(f.fila))
        );
        setSelecionadasParaRemover([]);
    }, [selecionadasParaRemover]);

    const toggleSelecaoAdicao = useCallback((filaName) => {
        setSelecionadasParaAdicionar(prev =>
            prev.includes(filaName) ? prev.filter(f => f !== filaName) : [...prev, filaName]
        );
    }, []);

    const toggleSelecaoRemocao = useCallback((filaName) => {
        setSelecionadasParaRemover(prev =>
            prev.includes(filaName) ? prev.filter(f => f !== filaName) : [...prev, filaName]
        );
    }, []);

    const selecionarTodasDisponiveis = useCallback(() => {
        if (selecionadasParaAdicionar.length === filasDisponiveis.length) {
            setSelecionadasParaAdicionar([]);
        } else {
            setSelecionadasParaAdicionar(filasDisponiveis.map(f => f.fila));
        }
    }, [filasDisponiveis, selecionadasParaAdicionar]);

    const selecionarTodasSelecionadas = useCallback(() => {
        if (selecionadasParaRemover.length === filasSelecionadasFiltradas.length) {
            setSelecionadasParaRemover([]);
        } else {
            setSelecionadasParaRemover(filasSelecionadasFiltradas.map(f => f.fila));
        }
    }, [filasSelecionadasFiltradas, selecionadasParaRemover]);

    const handleDrop = useCallback((item) => {
        if (item.type === 'disponivel') {
            if (item.isMultiDrag) {
                const toAdd = filasDisponiveis.filter(f => selecionadasParaAdicionar.includes(f.fila));
                setFilasSelecionadasTemporarias(prev => [...prev, ...toAdd]);
                setSelecionadasParaAdicionar([]);
            } else {
                setFilasSelecionadasTemporarias(prev => [...prev, item.fila]);
                if (item.isSelected) {
                    setSelecionadasParaAdicionar(prev => prev.filter(f => f !== item.fila.fila));
                }
            }
        } else {
            if (item.isMultiDrag) {
                setFilasSelecionadasTemporarias(prev =>
                    prev.filter(f => !selecionadasParaRemover.includes(f.fila))
                );
                setSelecionadasParaRemover([]);
            } else {
                setFilasSelecionadasTemporarias(prev =>
                    prev.filter(f => f.fila !== item.fila.fila)
                );
                if (item.isSelected) {
                    setSelecionadasParaRemover(prev => prev.filter(f => f !== item.fila.fila));
                }
            }
        }
    }, [filasDisponiveis, selecionadasParaAdicionar, selecionadasParaRemover]);

    return {
        showFilasModal,
        selectedUser,
        isUpdating,
        updateStatus,
        isAjuste,
        segmentoSelecionado,
        termoBuscaDisponiveisRaw,
        termoBuscaSelecionadasRaw,
        filasDisponiveis,
        filasSelecionadasFiltradas,
        selecionadasParaAdicionar,
        selecionadasParaRemover,
        filasSelecionadasTemporarias,
        handleOpenModal,
        handleCloseModal,
        handleCadastrarFilas,
        setSegmentoSelecionado,
        setTermoBuscaDisponiveisRaw,
        setTermoBuscaSelecionadasRaw,
        adicionarFilas,
        removerFilas,
        toggleSelecaoAdicao,
        toggleSelecaoRemocao,
        selecionarTodasDisponiveis,
        selecionarTodasSelecionadas,
        setSelecionadasParaAdicionar,
        setSelecionadasParaRemover,
        handleDrop
    };
};
