import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import './App.css';

const TabelaManager = ({ dados, user, socket }) => {
    const [showModal, setShowModal] = useState(false);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, message: ''});

    const isTAMaiorQue10Minutos = (ta) => {
        if (!ta) return false;
        const [horas, minutos, segundos] = ta.split(':').map(Number);
        return horas > 0 || minutos >= 10; 
    };

    const abrirModalEncerramento = (row) => {
        setChamadoSelecionado(row);
        setShowModal(true);
        setFeedback({ show: false, message: ''}); 
    };

    const handleEncerrar = () => {
        if (!chamadoSelecionado) {
            alert('Nenhum chamado selecionado');
            return;
        }

        setIsLoading(true);
        setFeedback({ show: false, message: ''});

        const hora = new Date().toTimeString().split(' ')[0];

        socket.emit('finalizar_chamado', {
            idSuporte: chamadoSelecionado.id_suporte,
            matSuporte: user.matricula,
            hrSuporte: hora,
        })
        setTimeout(() => {
            setIsLoading(false);
            setFeedback({
                show: true,
                message: `Chamado finalizado com sucesso!`,
                success: true 
            });
        }, 3000); 
    };
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
            selector: (row) => (row.status === 1 ? 'Em Atendimento' : 'Em Espera'),
            cell: (row) => (
                <span style={{ color: row.status === 1 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                    {row.status === 1 ? 'Em Atendimento' : 'Em Espera'}
                </span>
            ),
            width: '150px',
        },
        {
            name: "Ações",
            cell: (row) => (
                row.status === 1 && isTAMaiorQue10Minutos(row.tempAtendimento) ? (
                    <button
                        onClick={() => abrirModalEncerramento(row)}
                        className="btn-finalizar"
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Finalizar
                    </button>
                ) : null
            ),
            width: '120px',
            ignoreRowClick: true,
        },
    ];
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#022954', 
                color: '#FFFFFF', 
                fontWeight: 'bold',
                fontSize: '15px',
                textAlign: 'center',
            },
        },
        rows: {
            style: {
                backgroundColor: '#f8f9fa', 
                color: '#000000', 
                '&:nth-of-type(odd)': {
                    backgroundColor: '#e9ecef', 
                },
                '&:hover': {
                    backgroundColor: '#dee2e6', 
                },
            },
        },


    };
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
                fixedHeaderScrollHeight="600px"
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[25, 50, 100]}
                customStyles={customStyles}
                noDataComponent={<div style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>Nenhum dado disponível</div>}
            />
            
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-manager">
                        <div className="modal-header">Confirmar Encerramento</div>
                        <div className="modal-body">
                            <p>Deseja realmente encerrar o chamado de <strong>{chamadoSelecionado?.nome}</strong>?</p>
                            <p>TA: {chamadoSelecionado?.tempAtendimento || '00:00:00'}</p>
                            
                            {/* Área de feedback */}
                            {feedback.show && (
                                <div 
                                    className="feedback-message"
                                    style={{
                                        marginTop: '15px',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        backgroundColor: feedback.isError ? '#f8d7da' : '#d4edda',
                                        color: feedback.isError ? '#721c24' : '#155724',
                                        border: `1px solid ${feedback.isError ? '#f5c6cb' : '#c3e6cb'}`
                                    }}
                                >
                                    {feedback.message}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                                {feedback.success ? (
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="modal-btn modal-btn-close"
                                >
                                    Fechar
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => !isLoading && setShowModal(false)}
                                        disabled={isLoading}
                                        className="modal-btn modal-btn-cancel"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleEncerrar}
                                        disabled={isLoading}
                                        className="modal-btn modal-btn-confirm"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                                Processando...
                                            </>
                                        ) : 'Confirmar Encerramento'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TabelaManager;