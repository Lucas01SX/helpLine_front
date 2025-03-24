import React, { useEffect, useState, useCallback } from 'react';
import TabelaSuporte from '../../modules/TabelaSuporte';
import ModalSuporte from '../../modules/ModalSuporte';
import './App.css';
import socket from '../../context/Socket';
import BlocoSuporte from '../../modules/BlocoSuporte';

const SuporteView = ({ user, baseUrl }) => {
    const [chamados, setChamados] = useState([]);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [filasHabilitadas, setFilasHabilitadas] = useState([]);
    const matriculaLocal = user ? user.matricula : ''

    const [mostrarBlocoSuporte, setMostrarBlocoSuporte] = useState(false);
    const [chamadoEncerrado, setChamadoEncerrado] = useState(null);


    const calcularTempoEspera = useCallback((horaInicio) => {
        if (!horaInicio) return '00:00:00'; // Verificação defensiva

        // Caso a string seja do tipo HH:mm:ss
        if (typeof horaInicio === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(horaInicio)) {
            const [horas, minutos, segundos] = horaInicio.split(':').map(Number);

            // Cria um objeto Date para a hora de início com base no dia atual
            const agora = new Date();
            const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), horas, minutos, segundos);

            const diferenca = Math.floor((agora - inicio) / 1000);

            if (diferenca < 0) return '00:00:00';

            const horasCalculadas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
            const minutosCalculados = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
            const segundosCalculados = String(diferenca % 60).padStart(2, '0');

            return `${horasCalculadas}:${minutosCalculados}:${segundosCalculados}`;
        }

        // Para outros formatos (ex: timestamps), tenta criar um objeto Date diretamente
        const agora = new Date();
        const inicio = new Date(horaInicio);
        if (isNaN(inicio)) return '00:00:00';

        const diferenca = Math.floor((agora - inicio) / 1000);

        const horas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
        const minutos = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
        const segundos = String(diferenca % 60).padStart(2, '0');

        return `${horas}:${minutos}:${segundos}`;
    }, []);


    // Consulta as filas habilitadas para o suporte
    useEffect(() => {
        const fetchFilasHabilitadas = async () => {
            try {
                const response = await fetch(`${baseUrl}/suporte-api/api/filas/consulta/skill`, {
                 //const response = await fetch(`http://localhost:3000/api/filas/consulta/skill`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ matricula: matriculaLocal }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message === 'Consulta realizada com sucesso') {
                        setFilasHabilitadas(data.filas.fila.split(','));
                    }
                } else {
                    console.error('Erro ao carregar filas habilitadas.');
                }
            } catch (error) {
                console.error(`Erro na requisição: ${error}`);
            }
        };

        fetchFilasHabilitadas();
    }, [matriculaLocal, baseUrl]);

    useEffect(() => {
        // Função que consulta os chamados
        const consultarSuporte = () => {
            socket.emit('consultar_suporte', (response) => {
                if (response.message === "Dados de consulta atualizados" && response.consulta) {
                    setChamados(
                        response.consulta
                            .filter((chamado) => filasHabilitadas.includes(chamado.fila))
                            .map((chamado) => ({
                                id: chamado.id_suporte,
                                horaInicio: chamado.hora_solicitacao_suporte,
                                fila: chamado.fila,
                                loginOperador: chamado.login,
                                tempoEspera: calcularTempoEspera(chamado.hora_solicitacao_suporte),
                                status: 'pendente'
                            }))
                    );
                } else {
                    console.error("Erro do backend:", response.error || "Resposta inválida");
                }
            });
        };

        // Executa a consulta inicial
        if (filasHabilitadas.length > 0) {
            consultarSuporte();
        }
    }, [filasHabilitadas, calcularTempoEspera]);




    // Atualiza o tempo de espera a cada 1 segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setChamados((prevChamados) =>
                prevChamados.map((chamado) =>
                    chamado.status === "em atendimento"
                        ? chamado // Não recalcula o tempo de espera para chamados em atendimento
                        : {
                            ...chamado,
                            tempoEspera: calcularTempoEspera(chamado.horaInicio),
                        }
                )
            );
        }, 1000);

        return () => clearInterval(interval); // Limpeza ao desmontar
    }, [calcularTempoEspera]);


    // Atualizações em tempo real
    useEffect(() => {
        socket.on('atualizar_suporte', (response) => {
            if (response.chamado.message === "Erro em localizar os dados na request 2cx") return;

            try {
                if (response.action === "abrir") {
                    const novoChamado = response.chamado.gerarSuporte;
                    if (filasHabilitadas.includes(novoChamado.fila)) {
                        setChamados((prevChamados) => [
                            ...prevChamados,
                            {
                                id: novoChamado.id_suporte,
                                horaInicio: novoChamado.hora_solicitacao_suporte,
                                fila: novoChamado.fila,
                                loginOperador: novoChamado.login,
                                status: "pendente",
                                tempoEspera: calcularTempoEspera(novoChamado.hora_solicitacao_suporte),
                            },
                        ]);
                    }
                } else if (response.action === "atender") {
                    if (response.chamado.message === "Suporte atendido com sucesso") {
                        setChamados((prevChamados) =>
                            prevChamados.map((chamado) =>
                                chamado.id === response.chamado.suporte.id_suporte
                                    ? {
                                        ...chamado,
                                        status: "em atendimento"
                                    }
                                    : chamado
                            )
                        );
                    } else if (response.chamado.message === "Chamado já está sendo atendido") {
                        console.error("Chamado já está sendo atendido")
                    } else {
                        console.error("Erro não identificado.")
                    }
                } else if (response.action === "cancelar" || response.action === "finalizar") {
                    setChamados((prevChamados) =>
                        prevChamados.filter((chamado) => chamado.id !== response.chamado.id_suporte)
                    );
                }
            } catch (error) {
                console.error("Erro ao atualizar suporte:", error);
            }
        });

        return () => {
            socket.removeListener('atualizar_suporte');
        };
    }, [filasHabilitadas, calcularTempoEspera]);

    const handleAtenderSuporte = (idChamado) => {
        const chamado = chamados.find((ch) => ch.id === idChamado);
        if (!chamado) return;

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0];
        const tempoEspera = calcularTempoEspera(chamado.horaInicio);

        socket.emit('atender_chamado', {
            idSuporte: chamado.id,
            matSuporte: matriculaLocal,
            dtSuporte: date,
            hrSuporte: hora,
            tpAguardado: tempoEspera,
        },
            (response) => {
                if (response.suporte.matricula === matriculaLocal) {
                    const linkTeams = `msteams://teams.microsoft.com/l/call/0/0?users=${chamado.loginOperador}@corp.caixa.gov.br`;
                    window.open(linkTeams, '_blank');
                    setChamadoSelecionado(chamado);
                } else {
                    console.error(response.message)
                }
            });
    };

    const handleEncerrar = (chamado) => {
        if (chamado) {
            const now = new Date();
            const hora = now.toTimeString().split(' ')[0];

            socket.emit('finalizar_chamado', {
                idSuporte: chamado.id,
                matSuporte: matriculaLocal,
                hrSuporte: hora,
            });

            setChamados((prevChamados) => prevChamados.filter((ch) => ch.id !== chamado.id));
            setChamadoEncerrado(chamado)
            //setChamadoSelecionado(null);
            setMostrarBlocoSuporte(true);
            setChamadoSelecionado(null);
        }
    };

    const handleSalvarBloco = (texto) => {
        
        if(chamadoEncerrado){

            setChamados((prevChamados) => prevChamados.filter((ch) => ch.id !== chamadoEncerrado.id));
            
            //console.log('Chamado recebido:', chamadoEncerrado)
            const now = new Date();
            const hora_atual = now.toTimeString().split(' ')[0];
            socket.emit("demanda_suporte", {
                idSuporte: chamadoEncerrado.id,
                horario_descricao: hora_atual,
                descricao: texto
            });
        //console.log("info passada", chamadoEncerrado.id, " - ", hora_atual, " - ", texto)

        }
        
        else{
            console.error("Erro no cadastro de descrição de atendimento")
        }

        setMostrarBlocoSuporte(false);
        setChamadoEncerrado(null)
    }






    return (
        <div className="suporte-view">
            <TabelaSuporte chamados={chamados} onAtenderSuporte={handleAtenderSuporte} />
            <ModalSuporte chamado={chamadoSelecionado} onEncerrar={handleEncerrar} />
            {mostrarBlocoSuporte && <BlocoSuporte onSalvar={handleSalvarBloco}/>}
        </div>
    );
};

export default SuporteView;
