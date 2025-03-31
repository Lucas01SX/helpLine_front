import React, {useState} from 'react';
import DataTable from 'react-data-table-component';
import './App.css';
import { CButton } from '@coreui/react';
import * as XLSX from 'xlsx';

const handleTableExportXLSX = (columns, data) => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(row => {
            let obj = {};
            columns.forEach(column => {
                obj[column.name] = column.selector(row);
            });
            return obj;
        })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
    XLSX.writeFile(workbook, "Relatorio_Suporte.xlsx");
};

const TabelaRelatorio = ({ dados, agruparPor }) => {

    const tabelaSuporte = [
        { name: "Suporte", selector: (row) => row.agrupamento1, sortable: true, width:'450px'},
        { name: "Gestor Suporte", selector: (row) => row.agrupamento2, sortable: true, width:'450px' },
        { name: "Atendidas", selector:(row) => row.quant, sortable:true, width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "TME", selector: (row) => row.tme, sortable: true},
        { name: "TMA", selector: (row) => row.tma, sortable: true},
        { name: "Media", selector: (row) => row.nota, sortable: true,sortFunction: (a, b) => a.nota - b.nota}
    ];

    const tabelaSupervisor = [
        { name: "Supervisor", selector: (row) => row.agrupamento1, sortable: true, width:'450px'},
        { name: "Coordenador", selector: (row) => row.agrupamento2, sortable: true, width:'450px' },
        { name: "Atendidas", selector:(row) => row.quant, sortable:true, width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "TME", selector: (row) => row.tme, sortable: true},
        { name: "TMA", selector: (row) => row.tma, sortable: true},
        { name: "Media", selector: (row) => row.nota, sortable: true, sortFunction: (a, b) => a.nota - b.nota}
    ];

    const tabelaCoordenador = [
        { name: "Coordenador", selector: (row) => row.agrupamento1, sortable: true, width:'450px' },
        { name: "Atendidas", selector:(row) => row.quant, sortable:true, width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "TME", selector: (row) => row.tme, sortable: true},
        { name: "TMA", selector: (row) => row.tma, sortable: true},
        { name: "Media", selector: (row) => row.nota, sortable: true, sortFunction: (a, b) => a.nota - b.nota}
    ];

    const tabelaFila = [
        { name: "Fila", selector: (row) => row.agrupamento1, sortable: true, width:'300px'},
        { name: "Segmento", selector: (row) => row.agrupamento2, sortable: true, width:'300x' },
        { name: "Recebidas", selector:(row) => row.quant, sortable:true,width:'150px', sortFunction: (a, b) => a.quant - b.quant},
        { name: "Atendidas", selector:(row) => row.somaAtendidas, sortable:true, width:'150px', sortFunction: (a, b) => a.somaAtendidas - b.somaAtendidas},
        { name: "Abandonadas", selector:(row) => row.somaAbandonadas, sortable:true, width:'150px', sortFunction: (a, b) => a.somaAbandonadas - b.somaAbandonadas},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'150px', sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "Media", selector: (row) => row.nota, sortable: true, width:'100px',sortFunction: (a, b) => a.nota - b.nota},
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
    
    const tabelaData = [
        { name: "Data", selector: (row) => new Date(row.agrupamento1).toLocaleDateString(), sortable: true,  sortFunction: (a, b) => new Date(a.agrupamento1) - new Date(b.agrupamento1)},
        { name: "Recebidas", selector:(row) => row.quant, sortable:true, width:'200px',sortFunction: (a, b) => a.quant - b.quant},
        { name: "Atendidas", selector:(row) => row.somaAtendidas, sortable:true,width:'200px', sortFunction: (a, b) => a.somaAtendidas - b.somaAtendidas},
        { name: "Avaliadas", selector:(row) => row.totalNotas, sortable:true, width:'200px',sortFunction: (a, b) => a.totalNotas - b.totalNotas},
        { name: "Notas", selector:(row) => row.nota, sortable:true,width:'90px', sortFunction: (a, b) => a.nota - b.nota},
        { name: "TME", selector:(row) => row.tme, sortable:true,width:'100px'},
        { name: "TMA", selector:(row) => row.tma, sortable:true,width:'100px'},
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
        case 'data':
            columns = tabelaData;
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
                    onClick={() => handleTableExportXLSX(columns, dados)}
                >
                    Excel
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