import React, { useState } from 'react';
import { CRow, CCol, CAvatar, CCard, CCardBody, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import Select from 'react-select';


const TabelaDashboard = ({ dados }) => {
    const [funcoesSelecionadas, setFuncoesSelecionadas] = useState([]);
    //console.log(dados)
    const extrairFuncoesUnicas = (dados) => {
        const funcoesUnicas = new Set(); // Usamos um Set para garantir valores únicos

        dados.forEach((usuario) => {
            if (usuario.codfuncao && usuario.de_funcao) {
                funcoesUnicas.add(JSON.stringify({
                    value: usuario.codfuncao,
                    label: usuario.de_funcao
                }));
            }
        });

        // Converte o Set de volta para um array de objetos
        return Array.from(funcoesUnicas).map((item) => JSON.parse(item));
    };


    // Extrai as funções únicas dos dados
    const departamentos = extrairFuncoesUnicas(dados);

    // Função para filtrar os dados com base nas funções selecionadas
    const filtrarDados = () => {
        if (funcoesSelecionadas.length === 0) {
            return dados; // Se nenhuma função estiver selecionada, retorna todos os dados
        }

        // Filtra os dados para incluir apenas usuários com as funções selecionadas
        return dados.filter((usuario) =>
            funcoesSelecionadas.some((funcao) => funcao.value === usuario.codfuncao)
        );
    };

    // Dados filtrados para exibir na tabela
    const dadosFiltrados = filtrarDados();

    return (
        <CCard className="mb-0" style={{ overflowY: 'auto', maxHeight: '589px', padding: '10px', backgroundColor: '#6495ed' }}>
            <CRow>
                <CCol >
                    <h4 id="traffic" className="card-title mb-0" style={{ textAlign: 'center', color: '#FFF' }}>
                        Usuarios Logados
                    </h4>
                    <div className="filter">
                        <Select
                            options={departamentos}
                            isMulti
                            placeholder="Departamento"
                            onChange={(selected) => setFuncoesSelecionadas(selected || [])}
                            className="select"
                            classNamePrefix="select"
                            // isDisabled={segmentosSelecionados.length === 0 && filas.length === 0}
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
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {dadosFiltrados.map((item, index) => (
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
