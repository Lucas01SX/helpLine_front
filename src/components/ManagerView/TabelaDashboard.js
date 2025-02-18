import React, { useState, useEffect, useRef } from 'react';
import { CRow, CCol, CAvatar, CCard, CCardBody, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import Select from 'react-select';

const TabelaDashboard = ({ dados }) => {
    const [funcoesSelecionadas, setFuncoesSelecionadas] = useState([]);
    const [tempoDecorrido, setTempoDecorrido] = useState({});
    const [ordenacao, setOrdenacao] = useState({ coluna: 'tempo', direcao: 'asc' }); // Adiciona estado de ordenação
    const intervalRef = useRef(null); // Referência para armazenar o intervalo

    // Extrai funções únicas para o filtro
    const extrairFuncoesUnicas = (dados) => {
        const funcoesUnicas = new Set();
        dados.forEach((usuario) => {
            if (usuario.codfuncao && usuario.de_funcao) {
                funcoesUnicas.add(JSON.stringify({
                    value: usuario.codfuncao,
                    label: usuario.de_funcao
                }));
            }
        });
        return Array.from(funcoesUnicas).map((item) => JSON.parse(item));
    };

    const departamentos = extrairFuncoesUnicas(dados);

    // Filtra usuários com base nas funções selecionadas
    const filtrarDados = () => {
        if (funcoesSelecionadas.length === 0) return dados;
        return dados.filter((usuario) =>
            funcoesSelecionadas.some((funcao) => funcao.value === usuario.codfuncao)
        );
    };

    const dadosFiltrados = filtrarDados();

    // Função para calcular o tempo decorrido
    const calcularTempoDecorrido = (horaReferencia) => {
        if (!horaReferencia) return "00:00:00";

        const agora = new Date();
        const [hora, minuto, segundo] = horaReferencia.split(':').map(Number);
        const referencia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), hora, minuto, segundo);

        if (isNaN(referencia.getTime())) return "00:00:00";

        const diffEmSegundos = Math.floor((agora - referencia) / 1000);
        const horas = Math.floor(diffEmSegundos / 3600);
        const minutos = Math.floor((diffEmSegundos % 3600) / 60);
        const segundos = diffEmSegundos % 60;

        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    };

    // Função para determinar o horário base para cálculo
    const definirHorarioExibido = (horaInicio, horaFim, hrLogin) => {
        const formatarHora = (hora) => hora ? hora.split('.')[0] : null;
        const horaInicioFormatada = formatarHora(horaInicio);
        const horaFimFormatada = formatarHora(horaFim);
        const hrLoginFormatada = formatarHora(hrLogin);

        if (horaInicioFormatada && hrLoginFormatada && horaFimFormatada) {
            if (horaInicioFormatada > horaFimFormatada && horaInicioFormatada > hrLoginFormatada) {
                return horaInicioFormatada;
            }
            if (horaFimFormatada > hrLoginFormatada) {
                return horaFimFormatada;
            }
        }
        return hrLoginFormatada || "00:00:00";
    };

    // Atualiza o tempo decorrido a cada segundo
    useEffect(() => {
        // Evita múltiplos intervalos
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setTempoDecorrido((prevTempos) => {
                const novosTempos = {};
                dados.forEach((item) => {
                    const horarioBase = definirHorarioExibido(item.hora_inicio_suporte, item.hora_fim_suporte, item.hr_login);
                    novosTempos[item.login] = calcularTempoDecorrido(horarioBase);
                });
                return { ...prevTempos, ...novosTempos };
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [dados]); // Agora a atualização ocorre independentemente da seleção de filtros

    // Função para ordenar os dados
    const ordenarDados = (dados) => {
        return dados.sort((a, b) => {
            const tempoA = tempoDecorrido[a.login] || "00:00:00";
            const tempoB = tempoDecorrido[b.login] || "00:00:00";
            const [horaA, minutoA, segundoA] = tempoA.split(':').map(Number);
            const [horaB, minutoB, segundoB] = tempoB.split(':').map(Number);

            const segundosA = horaA * 3600 + minutoA * 60 + segundoA;
            const segundosB = horaB * 3600 + minutoB * 60 + segundoB;

            if (ordenacao.direcao === 'asc') {
                return segundosA - segundosB;
            } else {
                return segundosB - segundosA;
            }
        });
    };

    // Ordenar os dados filtrados
    const dadosOrdenados = ordenarDados(dadosFiltrados);

    // Alterar a direção de ordenação ao clicar no cabeçalho da coluna "Tempo"
    const handleOrdenacao = () => {
        setOrdenacao((prev) => ({
            coluna: 'tempo', // Pode ser expandido para mais colunas no futuro
            direcao: prev.direcao === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <CCard className="mb-0" style={{ overflowY: 'auto', maxHeight: '589px', padding: '10px', backgroundColor: '#6495ed' }}>
            <CRow>
                <CCol>
                    <h4 id="traffic" className="card-title mb-0" style={{ textAlign: 'center', color: '#FFF' }}>
                        Usuários Logados
                    </h4>
                    <div className="filter">
                        <Select
                            options={departamentos}
                            isMulti
                            placeholder="Departamento"
                            onChange={(selected) => setFuncoesSelecionadas(selected || [])}
                            className="select"
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            menuPosition="absolute"
                            menuShouldScrollIntoView={false}
                        />
                    </div>
                </CCol>
                <CCardBody style={{ maxHeight: '589px', borderRadius: '5px' }}>
                    <CTable align="middle" className="mb-0 border" hover responsive>
                        <CTableHead className="text-nowrap">
                            <CTableRow>
                                <CTableHeaderCell className="bg-body-tertiary text-center"><CIcon icon={cilPeople} /></CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary">Login</CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                                <CTableHeaderCell
                                    className="bg-body-tertiary"
                                    onClick={handleOrdenacao} // Adiciona o evento de clique
                                    style={{ cursor: 'pointer' }}
                                >
                                    Tempo
                                    {ordenacao.direcao === 'asc' ? ' ↑' : ' ↓'}
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {dadosOrdenados.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell className="text-center">
                                        <CAvatar size="md" src={item.avatar} status={item.status} />
                                    </CTableDataCell>
                                    <CTableDataCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <div>{item.login}</div>
                                    </CTableDataCell>
                                    <CTableDataCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <div>{item.nome}</div>
                                    </CTableDataCell>
                                    <CTableDataCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <div>{tempoDecorrido[item.login] || "00:00:00"}</div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CRow>
        </CCard>
    );
};

export default TabelaDashboard;
