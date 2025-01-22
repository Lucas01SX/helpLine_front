import React, { useEffect, useState } from 'react';
import TabelaSuporte from '../../modules/TabelaSuporte';
import ModalSuporte from '../../modules/ModalSuporte';
import './App.css';
import socket from '../../context/Socket';

const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';

const SuporteView = ({ user }) => {
    const [chamados, setChamados] = useState([]);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [filasHabilitadas, setFilasHabilitadas] = useState([]);

    // Consulta as filas habilitadas para o suporte
    useEffect(() => {
        const fetchFilasHabilitadas = async () => {
            try {
                const response = await fetch(`${baseUrl}/suporte-api/api/filas/consulta/skill`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ matricula: user.matricula }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message === 'Consulta realizada com sucesso') {
                        setFilasHabilitadas(data.filas.fila.split(',')); // Divide as filas por vírgula
                    }
                } else {
                    console.error('Erro ao carregar filas habilitadas.');
                }
            } catch (error) {
                console.error(`Erro na requisição: ${error}`);
            }
        };

        fetchFilasHabilitadas();
    }, [user.matricula]);

    // Consulta os chamados e filtra pelas filas habilitadas
    useEffect(() => {
        const consultarSuporte = () => {
            socket.emit('consultar_suporte', (response) => {
                if (response.message === "Dados de consulta atualizados" && response.consulta) {
                    setChamados(
                        response.consulta
                            .filter((chamado) => filasHabilitadas.includes(chamado.fila)) // Filtra pelas filas habilitadas
                            .map((chamado) => ({
                                id: chamado.id_suporte,
                                horaInicio: chamado.hora_solicitacao_suporte,
                                fila: chamado.fila,
                                loginOperador: chamado.login,
                            }))
                    );
                } else {
                    console.error("Erro do backend:", response.error || "Resposta inválida");
                }
            });
        };

        // Apenas consulta suporte se as filas habilitadas estiverem carregadas
        if (filasHabilitadas.length > 0) {
            consultarSuporte();
        }
    }, [filasHabilitadas]);

    useEffect(() => {
        socket.on('atualizar_suporte', (response) => {
            if (response.chamado.message === "Erro em localizar os dados na request 2cx") return;
            console.log(response)
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
                            },
                        ]);
                    }
                } else if (response.action === "atender") {
                    const idChamadoAtendido = response.chamado.id_suporte;
                    setChamados((prevChamados) =>
                        prevChamados.map((chamado) =>
                            chamado.id === idChamadoAtendido
                                ? { ...chamado, status: "em atendimento" }
                                : chamado
                        )
                    );
                } else if (response.action === "cancelar") {
                    const idChamadoCancelado = response.chamado.id_suporte;
                    setChamados((prevChamados) =>
                        prevChamados.filter((chamado) => chamado.id !== idChamadoCancelado)
                    );
                } else if (response.action === 'finalizar') {
                    const idChamadoFinalizado = response.chamado.id_suporte;
                    setChamados((prevChamados) =>
                        prevChamados.filter((chamado) => chamado.id !== idChamadoFinalizado)
                    );
                }
            } catch (error) {
                console.error("Erro ao atualizar suporte:", error);
            }
        });

        return () => {
            socket.removeListener('atualizar_suporte');
        };
    }, [filasHabilitadas]);

    const handleAtenderSuporte = (idChamado) => {
        const chamado = chamados.find((ch) => ch.id === idChamado);
        if (!chamado) return;

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0];

        const [hours, minutes, seconds] = chamado.horaInicio.split(':').map(Number);
        const inicio = new Date(now);
        inicio.setHours(hours, minutes, seconds, 0);

        const diferencaSegundos = Math.floor((now - inicio) / 1000);
        const tempoEspera = new Date(diferencaSegundos * 1000).toISOString().substr(11, 8);

        socket.emit('atender_chamado', {
            idSuporte: chamado.id,
            matSuporte: user.matricula,
            dtSuporte: date,
            hrSuporte: hora,
            tpAguardado: tempoEspera,
        });

        const linkTeams = `https://teams.microsoft.com/l/call/0/0?users=${chamado.loginOperador}@corp.caixa.gov.br`;
        window.open(linkTeams, '_blank');

        setChamadoSelecionado(chamado);
    };

    const handleEncerrar = (chamado) => {
        if (chamado) {
            const now = new Date();
            const hora = now.toTimeString().split(' ')[0];

            socket.emit('finalizar_chamado', {
                idSuporte: chamado.id,
                matSuporte: user.matricula,
                hrSuporte: hora,
            });

            setChamados((prevChamados) => prevChamados.filter((ch) => ch.id !== chamado.id));
            setChamadoSelecionado(null);
        }
    };

    return (
        <div className="suporte-view">
            <TabelaSuporte chamados={chamados} onAtenderSuporte={handleAtenderSuporte} />
            <ModalSuporte chamado={chamadoSelecionado} onEncerrar={handleEncerrar} />
        </div>
    );
};

export default SuporteView;
