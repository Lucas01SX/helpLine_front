import React, { useState, useEffect, useCallback } from 'react';
import { CFormSelect, CButton, CForm } from '@coreui/react';
import StarRating from '../../modules/AvaliacaoSuporte';
import CardSuporte from '../../modules/CardSuporte';
import Icon from '../../assets/img/central-de-ajuda.png';
import './App.css';
import socket from '../../context/Socket';



const OperadorView = ({ user, baseUrl }) => {
    const [filas, setFilas] = useState([]);
    const [filaSelecionada, setFilaSelecionada] = useState('');
    const [suporte, setSuporte] = useState(null); // Dados do suporte ativo
    const [erroFilas, setErroFilas] = useState(false);
    const [tempoEspera, setTempoEspera] = useState('00:00:00');
    const [botaoSolicitarVisivel, setBotaoSolicitarVisivel] = useState(true); // Controle do botão "Solicitar Suporte"
    const [cardVisivel, setCardVisivel] = useState(false); // Controle do card de suporte
    const [botaoCancelarDesabilitado, setBotaoCancelarDesabilitado] = useState(false); // Desabilitar botão "Cancelar"
    const [mostrarAvaliador, setMostrarAvaliador] = useState(false);
    const [armazenaSuporte, setArmazenaSuporte] = useState(null);


    // Buscar as filas disponíveis ao carregar o componente
    useEffect(() => {
        const fetchFilas = async () => {
            try {

                const response = await fetch(`${baseUrl}/suporte-api/api/filas/gerais`);
                // const response = await fetch(`http://localhost:3000/api/filas/gerais`);
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
    }, [baseUrl]);

    // Gerenciar eventos recebidos do socket
    useEffect(() => {
        socket.on('atualizar_suporte', (response) => {
            try {
                if (suporte && suporte.gerarSuporte && response.chamado.id_suporte === suporte.gerarSuporte.id_suporte) {
                    if (response.action === 'finalizar') {
                        // console.log('Suporte finalizado');
                        setArmazenaSuporte(suporte)
                        setSuporte(null);
                        setBotaoSolicitarVisivel(true); // Reexibe o botão "Solicitar Suporte"
                        setCardVisivel(false); // Oculta o card de suporte
                        setBotaoCancelarDesabilitado(false)
                        setMostrarAvaliador(true)
                        
                        
                    }
                } else if (suporte && suporte.gerarSuporte && response.chamado.suporte.id_suporte === suporte.gerarSuporte.id_suporte) {
                    if (response.action === 'atender') {
                        // console.log('Chamado atendido');
                        setBotaoCancelarDesabilitado(true); // Substitui o botão por "Em Atendimento"
                    }
                } else if (suporte && suporte.gerarSuporte && response.chamado.gerarSuporte.id_suporte === suporte.gerarSuporte.id_suporte) {
                    if (response.action === 'abrir') {
                        // console.log('Suporte solicitado');
                        setBotaoSolicitarVisivel(false); // Oculta o botão "Solicitar Suporte"
                        setCardVisivel(true); // Exibe o card de suporte
                        setBotaoCancelarDesabilitado(false)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        });

        return () => {
            socket.off('atualizar_suporte');
        };
    }, [suporte]);

    // Manipula o botão "Solicitar Suporte"
    const handleSolicitarSuporte = async () => {
        if (!filaSelecionada) return;

       
        setBotaoSolicitarVisivel(false)
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
                        setBotaoSolicitarVisivel(true)
                    }
                }
            );
        } catch (error) {
            console.error('Erro ao solicitar suporte:', error);
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

    const handleMostrarAvaliador = (rating) =>{
        if(armazenaSuporte){
            const now = new Date();
            const hora_atual = now.toTimeString().split(' ')[0];
            
            socket.emit("avaliacao_suporte", {
                idSuporte: armazenaSuporte.idCancelamento,
                horario_avaliacao: hora_atual,
                avaliacao: rating
            });
            
            // console.log('Suporte:',armazenaSuporte.idCancelamento, "horario:", hora_atual, 'recebeu nota:', rating);
            setMostrarAvaliador(false);
            setArmazenaSuporte(null)
        }
    }

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
            if (botaoCancelarDesabilitado) {
                setTempoEspera(calcularTempoEspera());
            } else {
                intervalId = setInterval(() => {
                    setTempoEspera(calcularTempoEspera());
                }, 1000);
            }
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [cardVisivel, calcularTempoEspera, botaoCancelarDesabilitado]);

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
                    disabled={erroFilas || !botaoSolicitarVisivel}
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
                        disabled={!filaSelecionada || erroFilas}
                        className="btn-success text-white px-4 py-2"
                        style={{ width: 'fit-content', borderRadius: '4px' }}
                    >
                        Solicitar Suporte
                        <img
                            src={Icon}
                            alt="Icone de suporte"
                            style={{ width: '16px', height: '16px', marginLeft: '8px', verticalAlign: 'middle' }}
                        />
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
            {mostrarAvaliador && <StarRating onSalvar={handleMostrarAvaliador}/>}


            
        </div>
    );
};

export default OperadorView;
