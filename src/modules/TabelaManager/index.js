import React from 'react';
import DataTable from 'react-data-table-component';
import './App.css';

const TabelaManager = ({ dados }) => {
    // Definição das colunas
    const columns = [
        {
            name: "Login",
            selector: (row) => row.login || 'N/A',
            sortable: true,
            width: '100px',
        },
        {
            name: "Nome",
            selector: (row) => row.nome || 'N/A',
            sortable: true,
            width: '250px',
        },
        {
            name: "Supervisor",
            selector: (row) => row.nome_super || 'N/A',
            sortable: true,
            width: '250px',
        },
        {
            name: "Fila",
            selector: (row) => row.fila || 'N/A',
            sortable: true,
            width: '200px',
        },
        {
            name: "TE",
            selector: (row) => row.tempoEspera || 'N/A',
            sortable: true,
            width: '100px',
        },
        {
            name: "TA",
            selector: (row) => row.tempAtendimento || 'N/A',
            sortable: true,
            width: '100px',
        },
        {
            name: "Nome Suporte",
            selector: (row) => row.nome_suporte || 'N/A',
            sortable: true,
            width: '250px',
        },
        {
            name: "Status",
            selector: (row) => (row.status === 1 ? 'Em Atendimento' : 'Em Espera') || 'N/A',
            cell: (row) => (
                <span
                    style={{
                        color: row.status === 1 ? '#28a745' : '#dc3545',
                        fontWeight: 'bold',
                    }}
                >
                    {row.status === 1 ? 'Em Atendimento' : 'Em Espera'}
                </span>
            ),
            sortable: true,
            width: '150px',
        },
    ];

    // Estilos personalizados para a tabela
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#022954', // Cor do cabeçalho
                color: '#FFFFFF', // Texto branco
                fontWeight: 'bold',
                fontSize: '15px',
                textAlign: 'center',
                // height: '20px',
            },
        },
        rows: {
            style: {
                backgroundColor: '#f8f9fa', // Fundo das linhas
                color: '#000000', // Texto das linhas
                '&:nth-of-type(odd)': {
                    backgroundColor: '#e9ecef', // Fundo para linhas ímpares (contraste)
                },
                '&:hover': {
                    backgroundColor: '#dee2e6', // Fundo ao passar o mouse
                },
                // height: '20px',
            },
        },


    };

    // Configurações de paginação em português
    const paginationOptions = {
        rowsPerPageText: 'Linhas por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    return (
        <div style={{ borderRadius: '5px', maxWidth: '75%', border: '1px solid #FFF' }}>
            <DataTable
                columns={columns}
                data={dados}
                pagination
                highlightOnHover
                responsive
                striped
                fixedHeader
                fixedHeaderScrollHeight="600px" // Altura do scroll
                paginationComponentOptions={paginationOptions} // Traduções
                paginationRowsPerPageOptions={[25, 50, 100]} // Opções de linhas
                customStyles={customStyles} // Estilos personalizados
                noDataComponent={<div style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>Nenhum dado disponível</div>} // Mensagem quando não há dados
            />
        </div>
    );
};

export default TabelaManager;
