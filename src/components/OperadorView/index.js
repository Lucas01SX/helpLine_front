import React, { useState, useEffect, useCallback } from 'react';
import { CFormSelect, CButton, CSpinner, CForm } from '@coreui/react';
import CardSuporte from '../../modules/CardSuporte';
import Icon from '../../assets/img/central-de-ajuda.png';
import './App.css';
import socket from '../../context/Socket';

const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';
const OperadorView = ({ user }) => {
    const [filas, setFilas] = useState([]);
    const [filaSelecionada, setFilaSelecionada] = useState('');
    const [suporte, setSuporte] = useState(null); // Dados do suporte ativo
    const [loading, setLoading] = useState(false);
    const [erroFilas, setErroFilas] = useState(false);
    const [tempoEspera, setTempoEspera] = useState('00:00:00');
    const [botaoSolicitarVisivel, setBotaoSolicitarVisivel] = useState(true); // Controle do botão "Solicitar Suporte"
    const [cardVisivel, setCardVisivel] = useState(false); // Controle do card de suporte
    const [botaoCancelarDesabilitado, setBotaoCancelarDesabilitado] = useState(false); // Desabilitar botão "Cancelar"



    // Buscar as filas disponíveis ao carregar o componente
    useEffect(() => {
        const fetchFilas = async () => {
            try {

                const response = await fetch(`${baseUrl}/suporte-api/api/filas/gerais`);
                const data = await response.json();

                if (Array.isArray(data.filas)) {
                    setFilas(data.filas);
                } else {
                    console.error('Formato inesperado de dados:', data);
                    setFilas([]);
                    setErroFilas(true);
                }
            } catch (error) {
                console.error('Erro ao buscar filas:', error);
                setFilas([]);
                setErroFilas(true);
            }
        };

        fetchFilas();
    }, []);

    // Gerenciar eventos recebidos do socket
    useEffect(() => {
        socket.on('atualizar_suporte', (response) => {
            if (response.action === 'finalizar') {
                console.log('Suporte finalizado');
                setSuporte(null);
                setBotaoSolicitarVisivel(true); // Reexibe o botão "Solicitar Suporte"
                setCardVisivel(false); // Oculta o card de suporte
                setBotaoCancelarDesabilitado(false)
            } else if (response.action === 'atender') {
                console.log('Chamado atendido');
                setBotaoCancelarDesabilitado(true); // Substitui o botão por "Em Atendimento"
            } else {
                try {
                    if (suporte && suporte.gerarSuporte && response.chamado.gerarSuporte.id_suporte === suporte.gerarSuporte.id_suporte) {
                        if (response.action === 'abrir') {
                            console.log('Suporte solicitado');
                            setBotaoSolicitarVisivel(false); // Oculta o botão "Solicitar Suporte"
                            setCardVisivel(true); // Exibe o card de suporte
                            setBotaoCancelarDesabilitado(false)
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        });

        return () => {
            socket.off('atualizar_suporte');
        };
    }, [suporte]);

    // Manipula o botão "Solicitar Suporte"
    const handleSolicitarSuporte = async () => {
        if (!filaSelecionada) return;

        setLoading(true);
        try {
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const hora = now.toTimeString().split(' ')[0];
            const filaSelecionadaObj = filas.find((fila) => fila.mcdu === Number(filaSelecionada));
            const nomeDaFila = filaSelecionadaObj ? filaSelecionadaObj.fila : 'Fila não encontrada';

            socket.emit(
                'abrir_chamado',
                {
                    matricula: user.matricula,
                    mcdu: filaSelecionada,
                    date: date,
                    hora: hora,
                },
                (response) => {
                    if (response.message === 'Suporte registrado com sucesso') {
                        setSuporte({
                            ...response,
                            horaInicio: now.toISOString(),
                            fila: nomeDaFila,
                            idCancelamento: response.gerarSuporte.id_suporte,
                        });
                        setBotaoSolicitarVisivel(false);
                        setCardVisivel(true);
                    } else if (response.message === 'Erro em localizar os dados na request 2cx') {
                        alert('Você não está em nenhuma ligação.');
                        console.error('Você não está em nenhuma ligação.');
                    }
                }
            );
        } catch (error) {
            console.error('Erro ao solicitar suporte:', error);
        } finally {
            setLoading(false);
        }
    };

    // Manipula o botão "Cancelar Suporte"
    const handleCancelarSuporte = async (idCancelamento) => {
        try {
            socket.emit(
                'cancelar_chamado',
                {
                    idCancelamento: idCancelamento,
                },
                (response) => {
                    if (response.message === 'Cancelamento realizado com sucesso') {
                        setSuporte(null);
                        setTempoEspera('00:00:00');
                        setBotaoSolicitarVisivel(true); // Reexibe o botão "Solicitar Suporte"
                        setCardVisivel(false); // Oculta o card de suporte
                    } else {
                        console.error('Erro ao cancelar suporte.');
                    }
                }
            );
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    // Calcula o tempo de espera para exibição no card
    const calcularTempoEspera = useCallback(() => {
        if (!suporte) return '00:00:00';
        const agora = new Date();
        const inicio = new Date(suporte.horaInicio);
        const diferenca = Math.floor((agora - inicio) / 1000);

        const horas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
        const minutos = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
        const segundos = String(diferenca % 60).padStart(2, '0');

        return `${horas}:${minutos}:${segundos}`;
    }, [suporte]); // Memorize a função com base em 'suporte'

    // Atualiza o tempo de espera a cada segundo
    useEffect(() => {
        let intervalId;

        if (cardVisivel) {
            intervalId = setInterval(() => {
                setTempoEspera(calcularTempoEspera());
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [cardVisivel, calcularTempoEspera]);

    return (
        <div className="operador-view">
            {erroFilas && (
                <p className="text-danger">
                    Não foi possível carregar as filas. Tente novamente mais tarde.
                </p>
            )}

            <div className="selectOperador">
                <CFormSelect
                    aria-label="Selecione a fila"
                    onChange={(e) => setFilaSelecionada(e.target.value)}
                    disabled={loading || erroFilas || !botaoSolicitarVisivel}
                    className="selectFilaOperador"
                >
                    <option value="">Selecione uma fila</option>
                    {filas.map((fila) => (
                        <option key={fila.mcdu} value={fila.mcdu}>
                            {fila.fila}
                        </option>
                    ))}
                </CFormSelect>

                {botaoSolicitarVisivel && (
                    <CButton
                        onClick={handleSolicitarSuporte}
                        disabled={!filaSelecionada || loading || erroFilas}
                        className="filaSelect"
                    >
                        {loading ? <CSpinner size="sm" /> : (
                            <>
                                Solicitar Suporte
                                <img
                                    src={Icon}
                                    alt="Icone de suporte"
                                    style={{ width: '16px', height: '16px', marginRight: '8px' }}
                                />
                            </>
                        )}
                    </CButton>
                )}
            </div>

            <CForm>
                {cardVisivel && (
                    <CardSuporte
                        tempoEspera={tempoEspera}
                        fila={suporte}
                        handleCancelarSuporte={handleCancelarSuporte}
                        botaoCancelarDesabilitado={botaoCancelarDesabilitado}
                    />
                )}
            </CForm>
        </div>
    );
};

export default OperadorView;
