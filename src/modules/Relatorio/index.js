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

    const tabelaGeral = [
        { name: "Data", selector: (row) => new Date(row.data).toLocaleDateString(), sortable: true,  sortFunction: (a, b) => new Date(a.agrupamento1) - new Date(b.agrupamento1)},
        { name: "ID Suporte", selector: (row) => row.id, sortable: true,width:'125px'},
        { name: "Operador", selector: (row) => row.operador, sortable: true, width:'400px'},
        { name: "Suporte", selector: (row) => row.suporte, sortable: true, width:'400px'},
        { name: "Gestor Suporte", selector: (row) => row.gestor, sortable: true, width:'350px' },
        { name: "Fila", selector: (row) => row.fila, sortable: true, width:'300px'},
        { name: "Segmento", selector: (row) => row.segmento, sortable: true, width:'180px' },
        { name: "Unique ID", selector:(row) => row.unique_id_ligacao, sortable:true, width:'160px'},
        { name: "Hora Início", selector: (row) => row.hora_inicio_suporte, sortable: true,width:'125px'},
        { name: "Hora Fim", selector: (row) => row.hora_fim_suporte, sortable: true,width:'125px'},
        {
            name: "Tempo em Atendimento",
            selector: (row) => {
                if (!row.hora_inicio_suporte || !row.hora_fim_suporte) return '';
        
                const [h1 = 0, m1 = 0, s1 = 0] = row.hora_inicio_suporte.split(':').map(Number);
                const [h2 = 0, m2 = 0, s2 = 0] = row.hora_fim_suporte.split(':').map(Number);
        
                const inicio = new Date(0, 0, 0, h1, m1, s1);
                const fim = new Date(0, 0, 0, h2, m2, s2);
        
                const diff = fim - inicio;
                if (isNaN(diff) || diff < 0) return 'Inválido';
        
                const totalSeconds = Math.floor(diff / 1000);
                const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                const seconds = String(totalSeconds % 60).padStart(2, '0');
        
                return `${hours}:${minutes}:${seconds}`;
            },
            sortable: true,
            width: '125px',
            sortFunction: (a, b) => {
                const toSeconds = (hms) => {
                    if (!hms) return 0;
                    const [h = 0, m = 0, s = 0] = hms.split(':').map(Number);
                    return h * 3600 + m * 60 + s;
                };
        
                const duracaoA = toSeconds(a.hora_fim_suporte) - toSeconds(a.hora_inicio_suporte);
                const duracaoB = toSeconds(b.hora_fim_suporte) - toSeconds(b.hora_inicio_suporte);
        
                return duracaoA - duracaoB;
            }
        },
        { name: "Nota", selector:(row) => row.avaliacao, sortable:true,width:'90px', sortFunction: (a, b) => a.avaliacao - b.avaliacao},
        { name: "Descrição", selector:(row) => row.descricao, width:'1500px'},
    ]

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
        case 'geral':
            columns = tabelaGeral;
            break;
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
                columns={columns || []}
                data={columns ? dados : []}
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