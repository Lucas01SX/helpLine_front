import React, { useEffect, useState } from 'react';
import TabelaSuporte from '../../modules/TabelaSuporte';
import ModalSuporte from '../../modules/ModalSuporte';
import './App.css';
import socket from '../../context/Socket'

const SuporteView = ({ user }) => {
    const [chamados, setChamados] = useState([]);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

    // Função para lidar com o evento de atualizar suporte
    useEffect(() => {
        socket.on('atualizar_suporte', (response) => {
            if (response.chamado.message === "Erro em localizar os dados na request 2cx") {
                return;
            }

            try {
                if (response.action === "abrir") {
                    // Quando a ação for "abrir", adiciona o novo chamado na tabela
                    const novoChamado = response.chamado.gerarSuporte;
                    setChamados((prevChamados) => [
                        ...prevChamados,
                        {
                            id: novoChamado.id_suporte,
                            horaInicio: novoChamado.hora_solicitacao_suporte,
                            fila: novoChamado.fila,
                            loginOperador: novoChamado.login,
                            status: "pendente", // Status inicial
                        }
                    ]);
                } else if (response.action === "atender") {
                    // Quando a ação for "atender", atualiza o status do chamado para "em atendimento"
                    const idChamadoAtendido = response.chamado.id_suporte;
                    setChamados((prevChamados) =>
                        prevChamados.map((chamado) =>
                            chamado.id === idChamadoAtendido
                                ? { ...chamado, status: "em atendimento" }
                                : chamado
                        )
                    );
                } else if (response.action === "cancelar") {
                    // Quando a ação for "cancelar", remove o chamado da tabela
                    const idChamadoCancelado = response.chamado.id_suporte;
                    setChamados((prevChamados) =>
                        prevChamados.filter((chamado) => chamado.id !== idChamadoCancelado)
                    );
                }
            } catch (error) {

            }
        });

        return () => {
            socket.removeListener('atualizar_suporte');
        };
    }, []);

    useEffect(() => {
        const consultarSuporte = () => {
            socket.emit('consultar_suporte', (response) => {
                console.log(response.consulta)
                if (response.message === "Dados de consulta atualizados" && response.consulta) {
                    // Atualiza o estado substituindo diretamente pelos dados retornados
                    setChamados(
                        response.consulta.map((chamado) => ({
                            id: chamado.id_suporte,
                            horaInicio: chamado.hora_solicitacao_suporte,
                            fila: chamado.fila,
                            loginOperador: chamado.login
                        }))
                    );
                } else {
                    console.error("Erro do backend:", response.error || "Resposta inválida");
                }
            });
        };

        consultarSuporte();

        // Cleanup do socket ao desmontar o componente
        return () => {
            socket.removeListener('consultar_suporte');
        };
    }, []);


    useEffect(() => {
        // Atualizar o tempo de espera a cada 1 segundo
        const interval = setInterval(() => {
            setChamados((prevChamados) =>
                prevChamados.map((chamado) => {
                    const agora = new Date();
                    const inicio = new Date(chamado.horaInicio);
                    const diferenca = Math.floor((agora - inicio) / 1000); // em segundos
                    const horas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
                    const minutos = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
                    const segundos = String(diferenca % 60).padStart(2, '0');
                    return {
                        ...chamado,
                        tempoEspera: `${horas}:${minutos}:${segundos}`,
                    };
                })
            );
        }, 1000);

        return () => clearInterval(interval); // Limpeza do intervalo quando o componente desmonta
    }, []);

    const handleAtenderSuporte = (idChamado) => {
        const chamado = chamados.find((ch) => ch.id === idChamado);

        const now = new Date();
        const date = now.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        const hora = now.toTimeString().split(' ')[0]; // Formato: HH:mm:ss

        if (chamado) {
            // Convertendo a hora de início (string no formato "hh:mm:ss") para um Date válido
            const [hours, minutes, seconds] = chamado.horaInicio.split(':').map(Number);
            const inicio = new Date(now); // Usando a data atual
            inicio.setHours(hours, minutes, seconds, 0); // Ajustando a hora no objeto Date
            const diferencaSegundos = Math.floor((now - inicio) / 1000); // Tempo de espera em segundos

            // Convertendo a diferença de segundos para o formato "hh:mm:ss"
            const horas = String(Math.floor(diferencaSegundos / 3600)).padStart(2, '0');
            const minutos = String(Math.floor((diferencaSegundos % 3600) / 60)).padStart(2, '0');
            const segundos = String(diferencaSegundos % 60).padStart(2, '0');
            const tempoEspera = `${horas}:${minutos}:${segundos}`;

            // Envia os dados para o backend
            socket.emit('atender_chamado', {
                idSuporte: chamado.id,
                matSuporte: user.matricula,
                dtSuporte: date,
                hrSuporte: hora,
                tpAguardado: tempoEspera, // Tempo de espera no formato "hh:mm:ss"
            });

            const linkTeams = `https://teams.microsoft.com/l/call/0/0?users=${chamado.loginOperador}@corp.caixa.gov.br`;
            window.open(linkTeams, '_blank')

            setChamadoSelecionado(chamado);
        }
    };


    const handleEncerrar = (chamado) => {
        if (chamado) {
            const now = new Date();
            const hora = now.toTimeString().split(' ')[0]; // Formato: HH:mm:ss

            socket.emit('finalizar_chamado', {
                idSuporte: chamado.id,
                matSuporte: user.matricula,
                hrSuporte: hora,
            });
            console.log(`Encerrando suporte para chamado ID: ${chamado.id}`);
            setChamados((prevChamados) => prevChamados.filter((ch) => ch.id !== chamado.id));
            setChamadoSelecionado(null);
        }
    };

    return (
        <div className="suporte-view">
            <TabelaSuporte chamados={chamados} onAtenderSuporte={handleAtenderSuporte} />
            <ModalSuporte
                chamado={chamadoSelecionado}
                onEncerrar={handleEncerrar}
            />
        </div>
    );
};

export default SuporteView;
