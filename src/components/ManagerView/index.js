import React, { useState, useEffect, useCallback } from 'react';
import socket from '../../context/Socket';
import Select from 'react-select';
import TabelaManager from '../../modules/TabelaManager';
import CardsDashboard from './CardsDashboard';
import TabelaDashboard from './TabelaDashboard';
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import avatar1 from '../../assets/img/avatar.webp';

const ManagerView = ({ baseUrl }) => {
    const [filas, setFilas] = useState([]);
    const [segmentosSelecionados, setSegmentosSelecionados] = useState([]);
    const [filasSelecionadas, setFilasSelecionadas] = useState([]);
    const [dadosTabela, setDadosTabela] = useState([]);
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [usuariosLogados, setUsuariosLogados] = useState([]);

    // Função para calcular o tempo de espera
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

    // Função para tratar os dados recebidos
    const tratarDados = useCallback((dados) => {
        return dados.map((usuario) => ({
            ...usuario,
            tempoEspera: usuario.nome_suporte ? usuario.tempo_aguardando_suporte : calcularTempoEspera(usuario.hora_solicitacao_suporte),
            tempAtendimento: usuario.hora_inicio_suporte ? calcularTempoDecorrido(usuario.hora_inicio_suporte) : null,
            status: usuario.nome_suporte ? 1 : 0
        }));
    }, [calcularTempoEspera]);

    const usuariosFiltrados = useCallback((dados) => {
        return dados.map((users) => ({
            ...users,
            avatar: avatar1,
            status: 'success',
        }));
    }, []);

    // Atualizar o tempo de atendimento a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setDadosTabela(prevDados => prevDados.map(usuario => ({
                ...usuario,
                tempAtendimento: usuario.hora_inicio_suporte ? calcularTempoDecorrido(usuario.hora_inicio_suporte) : null
            })));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Consulta os Logados a cada 5 minutos
    useEffect(() => {
        socket.emit('consultar_logados', (response) => {
            if (response.logados) {
                const valores = usuariosFiltrados(response.logados);
                setUsuariosLogados(valores);
            }
        });

        const interval = setInterval(() => {
            socket.emit('consultar_logados', (response) => {
                if (response.logados) {
                    const valores = usuariosFiltrados(response.logados);
                    setUsuariosLogados(valores);
                }
            });
        }, 300000);

        return () => clearInterval(interval);
    }, [usuariosFiltrados]);

    // Consulta os chamados iniciais e trata os dados
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

    // Buscar as filas disponíveis ao carregar o componente
    useEffect(() => {
        const fetchFilas = async () => {
            try {
                const response = await fetch(`${baseUrl}/suporte-api-dev/api/filas/gerais`);
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

    // Atualizar os dados filtrados com base nos filtros selecionados
    useEffect(() => {
        const filtrarDados = () => {
            let dados = [...dadosTabela];

            // Filtro por segmentos
            if (segmentosSelecionados.length > 0) {
                const segmentosValores = segmentosSelecionados.map((s) => s.value);
                dados = dados.filter((item) =>
                    filas.some((f) => segmentosValores.includes(f.segmento) && f.fila === item.fila)
                );
            }

            // Filtro por filas
            if (filasSelecionadas.length > 0) {
                const filasValores = filasSelecionadas.map((f) => f.value);
                dados = dados.filter((item) => filasValores.includes(item.fila));
            }

            setDadosFiltrados(dados);
        };

        filtrarDados();
    }, [segmentosSelecionados, filasSelecionadas, dadosTabela, filas]);

    // Obter opções de segmentos
    const segmentosOptions = [
        ...new Set(filas.map((f) => f.segmento)),
    ].map((segmento) => ({ value: segmento, label: segmento }));

    // Obter opções de filas filtradas com base no(s) segmento(s) selecionado(s)
    const filasOptions = filas
        .filter((f) =>
            segmentosSelecionados.length === 0 ||
            segmentosSelecionados.some((segmento) => segmento.value === f.segmento)
        )
        .map((f) => ({
            value: f.fila,
            label: f.fila,
        }));

    return (
        <div className="manager-view">
            {/* Cards do Dashboard */}
            <CardsDashboard />

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
                <TabelaManager dados={dadosFiltrados} />

                {/* Tabela do Dashboard */}
                <TabelaDashboard dados={usuariosLogados} />
            </div>
        </div>
    );
};

export default ManagerView;