import React, { useState, useEffect, useCallback } from 'react';
import socket from '../../context/Socket';
import Select from 'react-select';
import TabelaManager from '../../modules/TabelaManager';
import CardsDashboard from './CardsDashboard';
import TabelaDashboard from './TabelaDashboard';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import avatar1 from '../../assets/img/avatar.webp';

const ManagerView = ({ baseUrl, user }) => {
    const [filas, setFilas] = useState([]);
    const [segmentosSelecionados, setSegmentosSelecionados] = useState([]);
    const [filasSelecionadas, setFilasSelecionadas] = useState([]);
    const [dadosTabela, setDadosTabela] = useState([]);
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [usuariosLogados, setUsuariosLogados] = useState([]);
    const [dadosCards, setDadosCards] = useState([]);
    
    const formatarHora = (hora) => {
        if (!hora) return null;
        return hora.split('.')[0]; // Remove a parte dos milissegundos
    };
    const calcularTempoEspera = useCallback((horaInicio) => {
        if (!horaInicio) return '00:00:00';
        if (typeof horaInicio === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(horaInicio)) {
            const [horas, minutos, segundos] = horaInicio.split(':').map(Number);
            const agora = new Date();
            const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), horas, minutos, segundos);
            const diferenca = Math.floor((agora - inicio) / 1000);
            if (diferenca < 0) return '00:00:00';
            const horasCalculadas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
            const minutosCalculados = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
            const segundosCalculados = String(diferenca % 60).padStart(2, '0');
            return `${horasCalculadas}:${minutosCalculados}:${segundosCalculados}`;
        }
        const agora = new Date();
        const inicio = new Date(horaInicio);
        if (isNaN(inicio)) return '00:00:00';
        const diferenca = Math.floor((agora - inicio) / 1000);
        const horas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
        const minutos = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
        const segundos = String(diferenca % 60).padStart(2, '0');
        return `${horas}:${minutos}:${segundos}`;
    }, []);
    const calcularTempoDecorrido = (horaInicio) => {
        if (!horaInicio) return "00:00:00";
        if (typeof horaInicio === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(horaInicio)) {
            const [horas, minutos, segundos] = horaInicio.split(':').map(Number);
            const agora = new Date();
            const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), horas, minutos, segundos);
            const diferenca = Math.floor((agora - inicio) / 1000);
            if (diferenca < 0) return '00:00:00';
            const horasCalculadas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
            const minutosCalculados = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
            const segundosCalculados = String(diferenca % 60).padStart(2, '0');
            return `${horasCalculadas}:${minutosCalculados}:${segundosCalculados}`;
        }
        const inicio = new Date(horaInicio).getTime();
        const agora = new Date().getTime();
        const diferenca = Math.floor((agora - inicio) / 1000);
        const horas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
        const minutos = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
        const segundos = String(diferenca % 60).padStart(2, '0');
        return `${horas}:${minutos}:${segundos}`;
    };
    const tratarDados = useCallback((dados) => {
        return dados.map((usuario) => ({
            ...usuario,
            tempoEspera: usuario.nome_suporte ? usuario.tempo_aguardando_suporte : calcularTempoEspera(usuario.hora_solicitacao_suporte),
            tempAtendimento: usuario.hora_inicio_suporte ? calcularTempoDecorrido(usuario.hora_inicio_suporte) : null,
            status: usuario.nome_suporte ? 1 : 0
        }));
    }, [calcularTempoEspera]);
    useEffect(() => {
        const interval = setInterval(() => {
            setDadosTabela(prevDados => prevDados.map(usuario => ({
                ...usuario,
                tempAtendimento: usuario.hora_inicio_suporte ? calcularTempoDecorrido(usuario.hora_inicio_suporte) : null
            })));
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const processarDadosLogados = (dados) => {
        if (dados) {
            return dados.map((usuario) => ({
                ...usuario,
                fila: [...new Set(usuario.fila.split(','))], // Remove duplicatas
                mcdu: [...new Set(usuario.mcdu.split(','))], // Remove duplicatas
                segmento: [...new Set(usuario.segmento.split(','))], // Remove duplicatas
            }));
        }

    };
    const usuariosFiltrados = useCallback((dados, segmentosSelecionados, filasSelecionadas) => {
        return dados
        .filter((usuario) => {
            if (segmentosSelecionados.length > 0) {
                const segmentosValores = segmentosSelecionados.map((s) => s.value);
                return usuario.segmento.some((seg) => segmentosValores.includes(seg));
            }
            return true;
        })
        .filter((usuario) => {
            if (filasSelecionadas.length > 0) {
                const filasValores = filasSelecionadas.map((f) => f.value);
                return usuario.fila.some((f) => filasValores.includes(f));
            }
            return true;
        })
        .map((usuario) => {
            const horaInicio = formatarHora(usuario.hora_inicio_suporte);
            const horaFim = formatarHora(usuario.hora_fim_suporte);
            const hrLogin = formatarHora(usuario.hr_login);
            let status = 'success';
            if (horaInicio && hrLogin && horaFim) {
                if (horaInicio > hrLogin && horaInicio > horaFim) {
                    status = 'danger';
                }
            }
            return {
                ...usuario,
                avatar: avatar1,
                status,
            };
        });
    }, []);
    const filtrarResultado = (resultado, segmentosSelecionados, filasSelecionadas) => {
        return resultado.map(item => {
          const segmentosFiltrados = {};
          Object.keys(item.segmentos).forEach(segmento => {
            if (segmentosSelecionados.length === 0 || segmentosSelecionados.some(s => s.value === segmento)) {
              const filasFiltradas = {};
              Object.keys(item.segmentos[segmento].filas).forEach(fila => {
                if (filasSelecionadas.length === 0 || filasSelecionadas.some(f => f.value === fila)) {
                  filasFiltradas[fila] = item.segmentos[segmento].filas[fila];
                }
              });
      
              if (Object.keys(filasFiltradas).length > 0) {
                segmentosFiltrados[segmento] = {
                  filas: filasFiltradas
                };
              }
            }
          });
      
          return {
            ...item,
            segmentos: segmentosFiltrados
          };
        });
    };
    const calcularTempoMedioAtendimento = (resultadoFiltrado) => {
        let totalTempoEspera = 0;
        let totalAcionamentos = 0;
        resultadoFiltrado.forEach((hora) => {
            Object.values(hora.segmentos).forEach((segmento) => {
                Object.values(segmento.filas).forEach((fila) => {
                    totalTempoEspera += fila.tempoTotalEspera;
                    totalAcionamentos += fila.acionamentos;
                });
            });
        });
        const tempoMedioGlobal = totalAcionamentos > 0 ? totalTempoEspera / totalAcionamentos : 0;
        const tempoMedioPorHora = resultadoFiltrado.map((hora) => {
            let tempoEsperaHora = 0;
            let acionamentosHora = 0;
    
            Object.values(hora.segmentos).forEach((segmento) => {
                Object.values(segmento.filas).forEach((fila) => {
                    tempoEsperaHora += fila.tempoTotalEspera;
                    acionamentosHora += fila.acionamentos;
                });
            });
    
            return {
                horario: hora.horario,
                tempoMedio: acionamentosHora > 0 ? tempoEsperaHora / acionamentosHora : 0,
            };
        });
    
        return {
            tempoMedioGlobal,
            tempoMedioPorHora,
        };
    };
    useEffect(() => {
        const consultarLogados = () => {
            socket.emit('consultar_logados', (response) => {
                if (response.logados) {
                    const dadosProcessados = processarDadosLogados(response.logados);
                    const valores = usuariosFiltrados(dadosProcessados, segmentosSelecionados, filasSelecionadas);
                    setUsuariosLogados(valores);
                }
            });
        };
        consultarLogados();
        const interval = setInterval(() => {
            consultarLogados();
        }, 10000);
        return () => clearInterval(interval);
    }, [segmentosSelecionados, filasSelecionadas, usuariosFiltrados]);
    useEffect(() => {
        const atualizarDados = () => {
            socket.emit('atualizar_manager', (response) => {
                if (response.consulta) {
                    const dadosTratados = tratarDados(response.consulta);
                    setDadosTabela(dadosTratados);
                }
            });
        };
        atualizarDados();
        const interval = setInterval(() => {
            atualizarDados();
        }, 1000);
        return () => clearInterval(interval);
    }, [tratarDados]);
    useEffect(() => {
        const fetchFilas = async () => {
            try {
                const response = await fetch(`${baseUrl}/suporte-api/api/filas/gerais`);
                const data = await response.json();

                if (Array.isArray(data.filas)) {
                    setFilas(data.filas);
                } else {
                    console.error('Formato inesperado de dados:', data);
                }
            } catch (error) {
                console.error('Erro ao buscar filas:', error);
            }
        };
        fetchFilas();
    }, [baseUrl]);
    useEffect(() => {
        const filtrarDados = () => {
            let dados = [...dadosTabela];
            if (segmentosSelecionados.length > 0) {
                const segmentosValores = segmentosSelecionados.map((s) => s.value);
                dados = dados.filter((item) =>
                    filas.some((f) => segmentosValores.includes(f.segmento) && f.fila === item.fila)
                );
            }
            if (filasSelecionadas.length > 0) {
                const filasValores = filasSelecionadas.map((f) => f.value);
                dados = dados.filter((item) => filasValores.includes(item.fila));
            }
            setDadosFiltrados(dados);
        };
        filtrarDados();
    }, [segmentosSelecionados, filasSelecionadas, dadosTabela, filas]);
    const segmentosOptions = [
        ...new Set(filas.map((f) => f.segmento)),
    ].map((segmento) => ({ value: segmento, label: segmento }));
    const filasOptions = filas
        .filter((f) =>
            segmentosSelecionados.length === 0 ||
            segmentosSelecionados.some((segmento) => segmento.value === f.segmento)
        )
        .map((f) => ({
            value: f.fila,
            label: f.fila,
        }));
    useEffect(() => {
        const atualizarDadosCards = () => {
            socket.emit('cards_dashboard', (response) => {
                if (response.dadosDashboard) {
                    const { logados, resultado } = response.dadosDashboard;
                    const logadosFiltrados = logados.map((logado) => {
                        return {
                            ...logado,
                            usuarios: logado.usuarios.filter((usuario) => {
                                if (segmentosSelecionados.length > 0) {
                                    const segmentosValores = segmentosSelecionados.map((s) => s.value);
                                    return usuario.segmento.split(',').some((seg) => segmentosValores.includes(seg));
                                }
                                if (filasSelecionadas.length > 0) {
                                    const filasValores = filasSelecionadas.map((f) => f.value);
                                    return usuario.fila.split(',').some((f) => filasValores.includes(f));
                                }
                                return true; // Se nenhum filtro for aplicado, retorna todos
                            }),
                        };
                    });
    
                    // Filtra o resultado com base nos segmentos ou filas selecionados
                    const resultadoFiltrado = filtrarResultado(resultado, segmentosSelecionados, filasSelecionadas);
    
                    // Calcula o tempo médio de atendimento
                    const { tempoMedioGlobal, tempoMedioPorHora } = calcularTempoMedioAtendimento(resultadoFiltrado);
    
                    // Atualiza os dados dos cards com os logados, resultado filtrados e tempo médio
                    setDadosCards({
                        ...response.dadosDashboard,
                        logados: logadosFiltrados,
                        resultado: resultadoFiltrado,
                        tempoMedioGlobal,
                        tempoMedioPorHora,
                    });
                }
            });
        };
    
        atualizarDadosCards();
        const interval = setInterval(atualizarDadosCards, 60000); // Atualiza a cada 1 minuto
    
        return () => clearInterval(interval);
    }, [segmentosSelecionados, filasSelecionadas]);

    return (
        <div className="manager-view">
            {/* Cards do Dashboard */}
            <CardsDashboard dados={dadosCards} />
            {/* Filtros de Segmento e Fila */}
            <div className="filters">
                <div className="filter">
                <Select
                    options={segmentosOptions}
                    isMulti
                    placeholder="Selecione os segmentos"
                    onChange={(selected) => setSegmentosSelecionados(selected || [])}
                    className="select"
                    classNamePrefix="select"
                    menuPortalTarget={document.body}
                    menuPosition="absolute"
                    menuShouldScrollIntoView={false}
                />
                </div>

                <div className="filter">
                <Select
                    options={filasOptions}
                    isMulti
                    placeholder="Selecione as filas"
                    onChange={(selected) => setFilasSelecionadas(selected || [])}
                    className="select"
                    classNamePrefix="select"
                    isDisabled={segmentosSelecionados.length === 0 && filas.length === 0}
                    menuPortalTarget={document.body}
                    menuPosition="absolute"
                    menuShouldScrollIntoView={false}
                />
                </div>
            </div>

            <div className="tables">
                {/* Outras tabelas */}
                <TabelaManager dados={dadosFiltrados} user={user} socket={socket}/>

                {/* Tabela do Dashboard */}
                <TabelaDashboard dados={usuariosLogados} />
            </div>
        </div>
    );
};

export default ManagerView;