import React, { useState, useEffect } from 'react';
import './App.css';
import Select from 'react-select';
import socket from '../../context/Socket';
import '@coreui/coreui/dist/css/coreui.min.css';
import TabelaRelatorio from '../../modules/Relatorio';
import { CButton, CSpinner } from '@coreui/react';
import Export from "react-data-table-component"

const RelatorioView = ({baseUrl}) => {

    const today = new Date().toISOString().split('T')[0]
    const [dadosTabela, setDadosTabela] = useState([]);
    const [agruparPorSelecionado, setAgruparPorSelecionado] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filas, setFilas] = useState([]);
    const [segmentos, setSegmentos] = useState([]);
    const [demaisDados, setDemaisDados] = useState([]);


    const [filtros, setFiltros] = useState({
        suporte: null,
        gestor: null,
        coordenador: null,
        fila: null,
        segmento: null,
        dataInicio: today,
        dataFim: today,
        agruparPor: null,
    });

    const opcoesAgruparPor = [
        { value: 'suporte', label: 'Suporte' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'coordenador', label: 'Coordenador' },
        { value: 'fila', label: 'Fila' },
        { value: 'ns_suporte', label: 'Nivel de Serviço'}
    ];

    const handleFiltroChange = (selectedOption, { name }) => {
        setFiltros((prevState) => ({
            ...prevState,
            [name]: selectedOption ? selectedOption.value : null,
        }));
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        setFiltros((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const filteredDadosTabela = dadosTabela.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchKeyword.toLowerCase())
        )
    );

    const handlePesquisarClick = () => {
        setAgruparPorSelecionado(filtros.agruparPor);
        setIsLoading(true);
        socket.emit('relatorio_suporte', filtros, (response) => {
            setIsLoading(false);
            if (response && Array.isArray(response.dadosRelatorio)) {
                const dadosFiltrados = response.dadosRelatorio.filter(item => {
                    //VERIFICAITEMVAZIO
                    return Object.values(item).every(value => value !== null && value !== '');
                });
                setDadosTabela(dadosFiltrados);
            } else {
                console.error('Dados inválidos:', response);
            }
        });
    }
    useEffect(() => {
        socket.emit('consulta_dados', (response) => {
            //console.log('Dados recebidos do socket:', response);
            if (response && Array.isArray(response.dadosCP)) {
                setDemaisDados(response.dadosCP);
                //console.log("dadosfil", response.dadosCP);
            } else {
                console.error('Dados inválidos CP:', response);
            }
        });
    }, []);
    

    useEffect(() => {
        const fetchFilas = async () => {
            try {
                //const response = await fetch(`http://pr7399et2850:3000/api/filas/gerais`);
                //const response = await fetch(`http://10.98.32.40/api/filas/gerais`);
                const response = await fetch(`${baseUrl}/suporte-api/api/filas/gerais`);

                const data = await response.json();

                if (Array.isArray(data.filas)) {
                    setFilas(data.filas);
                    const uniqueSegmentos = [...new Set(data.filas.map(fila => fila.segmento))];
                    setSegmentos(uniqueSegmentos);
                } else {
                    console.error('Formato inesperado de dados:', data);
                }
            } catch (error) {
                console.error('Erro ao buscar filas:', error);
            }
        };
        fetchFilas();
    }, [baseUrl]);

    const getUnique = (field) => {
        const options = [...new Set(demaisDados.map(dado => dado[field]))];
        return [{ value: null, label: 'Selecione' }, ...options.map(option => ({ value: option, label: option }))];
    };

    const getFilaSegmento = (field) => {
        const options = [...new Set(filas.map(dado => dado[field]))];
        return [{ value: null, label: 'Selecione' }, ...options.map(option => ({ value: option, label: option }))];
    };

    return (
        <div className='overlay-rel'>
            <div className="relatorio-view">
                <div className="container-filtro">
                    <form className="form-filtro">
                        <label className="label-relatorio">
                            Suporte:
                            <Select
                                className="select-operador"
                                placeholder="Suporte"
                                name="suporte"
                                options={getUnique('nomeSuporte')}
                                onChange={handleFiltroChange}
                            />
                        </label>
                        <label className="label-relatorio">
                            Gestor:
                            <Select
                                className="select-operador"
                                placeholder="Gestor"
                                name="gestor"
                                options={getUnique('nomeGestor')}
                                onChange={handleFiltroChange}
                            />
                        </label>
                        <label className="label-relatorio">
                            Segmento:
                            <Select
                                className="select-segmento"
                                placeholder="Segmento"
                                name="segmento"
                                options={getFilaSegmento('segmento')}
                                onChange={handleFiltroChange}
                            />
                        </label>
                        <label className="label-relatorio">
                            Fila:
                            <Select
                                className="select-segmento"
                                placeholder="Fila"
                                name="fila"
                                options={getFilaSegmento('fila')}
                                onChange={handleFiltroChange}
                            />
                        </label>
                        <label className="label-relatorio">
                            Data Inicio:
                            <input
                                type="date"
                                name="dataInicio"
                                value={filtros.dataInicio}
                                max={today}
                                className="css-13cymwt-control custom-select"
                                onChange={handleDateChange}
                            />
                        </label>
                        <label className="label-relatorio">
                            Data Fim:
                            <input
                                type="date"
                                name="dataFim"
                                value={filtros.dataFim}
                                max={today}
                                className="css-13cymwt-control custom-select"
                                onChange={handleDateChange}
                            />
                        </label>
                        <label className="label-relatorio">
                            Agrupar por:
                            <Select
                                className="select-agrupar"
                                placeholder="Agrupar por"
                                name="agruparPor"
                                options={opcoesAgruparPor}
                                onChange={handleFiltroChange}
                            />
                        </label>
                        <input
                            type="text"
                            placeholder='Pesquisar...'
                            className="css-13cymwt-control"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        />
                        <CButton type="button" className="btn btn-primary" onClick={handlePesquisarClick}>
                            Pesquisar
                        </CButton>

                    </form>
                    
                </div>
                <div className='relatorio-tabela'>
                        {isLoading ? (
                            <div className='loading-rel'>
    
                            <CSpinner color='light' variant='grow' size='lg' />
                            </div>
                        ) : (
                            <TabelaRelatorio dados={filteredDadosTabela} agruparPor={agruparPorSelecionado}  />
                        )}
                </div>
            </div>
        </div>
    );
};

export default RelatorioView;