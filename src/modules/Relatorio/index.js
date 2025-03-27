import React, {useState} from 'react';
import DataTable from 'react-data-table-component';
import './App.css';
import { CButton } from '@coreui/react';

const handleTableExport = (columns, data) => {
    let result = [];

    // Adicionar cabeçalhos
    let headers = columns.map(column => column.name);
    result.push(headers.join(","));

    // Adicionar dados
    data.forEach(row => {
        let rowData = [];
        columns.forEach(column => {
            let cell = column.selector(row);
            rowData.push(cell.toString().replace(/"/g, '""')); // Escapar aspas duplas
        });
        result.push(rowData.join(","));
    });

    downloadCSVFile(result.join("\n"), "Relatorio Suporte.csv");
};

// Função para baixar o arquivo CSV
const downloadCSVFile = (csv, filename) => {
    let csv_file = new Blob([csv], { type: "text/csv" });
    let link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(csv_file);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpeza
};


const TabelaRelatorio = ({ dados, agruparPor }) => {

    const tabelaSuporte = [
        { name: "Suporte", selector: (row) => row.agrupamento1, sortable: true, width:'450px'},
        { name: "Gestor Suporte", selector: (row) => row.agrupamento2, sortable: true, width:'450px' },
        { name: "Atendidas", selector:(row) => row.quant, sortable:true, width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "TME", selector: (row) => row.tme, sortable: true},
        { name: "TMA", selector: (row) => row.tma, sortable: true},
        { name: "Media", selector: (row) => row.nota, sortable: true}
    ];

    const tabelaSupervisor = [
        { name: "Supervisor", selector: (row) => row.agrupamento1, sortable: true, width:'450px'},
        { name: "Coordenador", selector: (row) => row.agrupamento2, sortable: true, width:'450px' },
        { name: "Atendidas", selector:(row) => row.quant, sortable:true, width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "TME", selector: (row) => row.tme, sortable: true},
        { name: "TMA", selector: (row) => row.tma, sortable: true},
        { name: "Media", selector: (row) => row.nota, sortable: true}
    ];

    const tabelaCoordenador = [
        { name: "Coordenador", selector: (row) => row.agrupamento1, sortable: true, width:'450px' },
        { name: "Atendidas", selector:(row) => row.quant, sortable:true, width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "TME", selector: (row) => row.tme, sortable: true},
        { name: "TMA", selector: (row) => row.tma, sortable: true},
        { name: "Media", selector: (row) => row.nota, sortable: true}
    ];

    const tabelaFila = [
        { name: "Fila", selector: (row) => row.agrupamento1, sortable: true, width:'300px'},
        { name: "Segmento", selector: (row) => row.agrupamento2, sortable: true, width:'300x' },
        { name: "Recebidas", selector:(row) => row.quant, sortable:true,width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Atendidas", selector:(row) => row.somaAtendidas, sortable:true, width:'150px', sortFunction: (a, b) => a.somaAtendidas - b.somaAtendidas},
        { name: "Abandonadas", selector:(row) => row.somaAbandonadas, sortable:true, width:'150px', sortFunction: (a, b) => a.somaAbandonadas - b.somaAbandonadas},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "Media", selector: (row) => row.nota, sortable: true, width:'100px'},
        { name: "TME", selector: (row) => row.tme, sortable: true, width:'100px'},
        { name: "TMA", selector: (row) => row.tma, sortable: true, width:'100px'},
        { name: "SLA", selector:(row) => row.sla, sortable:true, width:'100px', sortFunction: (a, b) => a.sla - b.sla}
    ];

    const tabelaNs = [
        { name: "Data", selector: (row) => new Date(row.agrupamento1).toLocaleDateString(), sortable: true,  sortFunction: (a, b) => new Date(a.agrupamento1) - new Date(b.agrupamento1)},
        { name: "Recebidas", selector:(row) => row.quant, sortable:true, sortFunction: (a, b) => a.quant - b.quant},
        { name: "Atendidas", selector:(row) => row.somaAtendidas, sortable:true, sortFunction: (a, b) => a.somaAtendidas - b.somaAtendidas},
        { name: "atn_tme", selector:(row) => row.somaAtn_TME, sortable:true, sortFunction: (a, b) => a.somaAtn_TME - b.somaAtn_TME},
        { name: "Atn_Maior_TME", selector:(row) => row.somaAtn_maior_tme, sortable:true, sortFunction: (a, b) => a.somaAtn_maior_tme - b.somaAtn_maior_tme},
        { name: "Abandonadas", selector:(row) => row.somaAbandonadas, sortable:true, width:'150px', sortFunction: (a, b) => a.somaAbandonadas - b.somaAbandonadas},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'115px',sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "Notas", selector:(row) => row.nota, sortable:true,width:'90px', sortFunction: (a, b) => a.nota - b.nota},
        { name: "TME", selector:(row) => row.tme, sortable:true,width:'100px'},
        { name: "TMA", selector:(row) => row.tma, sortable:true,width:'100px'},
        { name: "SLA", selector:(row) => row.sla, sortable:true, width:'100px', sortFunction: (a, b) => a.sla - b.sla},
    ]

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#022954',
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: '14px',
                textAlign: 'center',
            },
        },
        rows: {
            style: {
                backgroundColor: '#f8f9fa',
                color: '#000000',
                fontSize: '14px',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#e9ecef',
                },
                '&:hover': {
                    backgroundColor: '#abaaaa',
                },
            },
        },
    };

    let columns;
    switch (agruparPor) {
        case 'suporte':
            columns = tabelaSuporte;
            break;
        case 'fila':
            columns = tabelaFila;
            break;
        case 'supervisor':
            columns = tabelaSupervisor;
            break;
        case 'coordenador':
            columns = tabelaCoordenador;
            break;
        case 'ns_suporte':
            columns = tabelaNs;
            break;
        default:
            columns = undefined;
            break;

    }



    const paginationOptions = {
        rowsPerPageText: 'Linhas por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };
    return (
        
        <div className="baseTabela" style={{ scale: '0.81'}}>
            <div className='botao-csv'>
                <CButton 
                    type="button" 
                    className="btn btn-primary" 
                    size='sm' 
                    style={{bottom:'160px'}}
                    onClick={() => handleTableExport(columns, dados)}
                >
                    Baixar CSV
                </CButton>
            </div>
            <DataTable
                columns={columns}
                data={dados}
                pagination
                highlightOnHover
                responsive
                striped
                fixedHeader
                dense
                paginationComponentOptions={paginationOptions}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]}
                fixedHeaderScrollHeight="600px"
                customStyles={customStyles}
                noDataComponent={<div style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>Nenhum dado disponível</div>}
                
            />
        </div>
   
    );
};

export default TabelaRelatorio;