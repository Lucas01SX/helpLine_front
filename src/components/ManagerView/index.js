import React, { useState, useEffect } from 'react';
import './App.css';
import socket from '../../context/Socket';
import Select from 'react-select';
import TabelaManager from '../../modules/TabelaManager';



const ManagerView = ({user, baseUrl}) => {

    const [usuariosLogados, setUsuariosLogados] = useState([]);
    const [filas, setFilas] = useState([]);
    const [segmentosSelecionados, setSegmentosSelecionados] = useState([]);
    const [filasSelecionadas, setFilasSelecionadas] = useState([]);
    const [erroFilas, setErroFilas] = useState(false);

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
                    setErroFilas(true);
                }
            } catch (error) {
                console.error('Erro ao buscar filas:', error);
                setErroFilas(true);
            }
        };

        fetchFilas();
    }, [baseUrl]);

    // Atualizar lista de usuários logados em tempo real
    useEffect(() => {
        socket.on('usuarios_atualizados', (usuarios) => {
            setUsuariosLogados(usuarios);
        });

        return () => {
            socket.off('usuarios_atualizados');
        };
    }, []);

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

    // Filtrar usuários logados com base em segmentos e filas selecionados
    const usuariosFiltrados = usuariosLogados.filter((usuario) => {
        const usuarioFilas = usuario.filas || [];
        const segmentoValido =
            segmentosSelecionados.length === 0 ||
            segmentosSelecionados.some((segmento) =>
                filas.some((f) => f.segmento === segmento.value && usuarioFilas.includes(f.fila))
            );

        const filaValida =
            filasSelecionadas.length === 0 ||
            filasSelecionadas.some((fila) => usuarioFilas.includes(fila.value));

        return segmentoValido && filaValida;
    });

    return (
        <div className="manager-view">

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
                    />
                </div>
            </div>

            {/* Tabela de Usuários */}
            <TabelaManager usuarios={usuariosFiltrados} />

            {erroFilas && <p className="error">Erro ao carregar filas.</p>}
        </div>
    );
};

export default ManagerView;
