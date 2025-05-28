import React, { useEffect } from 'react'; // Adicione o useEffect aqui
import { DraggableFila } from './DraggableFila';
import { DroppableArea } from './DroppableArea';

export const ModalFilas = ({
    showFilasModal,
    selectedUser,
    isUpdating,
    updateStatus,
    isAjuste,
    segmentos,
    segmentoSelecionado,
    termoBuscaDisponiveisRaw,
    termoBuscaSelecionadasRaw,
    filasDisponiveis,
    filasSelecionadasFiltradas,
    selecionadasParaAdicionar,
    selecionadasParaRemover,
    setTermoBuscaDisponiveisRaw,
    setTermoBuscaSelecionadasRaw,
    handleCloseModal,
    handleCadastrarFilas,
    setSegmentoSelecionado,
    adicionarFilas,
    removerFilas,
    toggleSelecaoAdicao,
    toggleSelecaoRemocao,
    selecionarTodasDisponiveis,
    selecionarTodasSelecionadas,
    handleDrop,
    setFilasSelecionadasTemporarias,
    usuarios,
    handleOpenModal
}) => {
    useEffect(() => {
        if (selectedUser && showFilasModal) {
            const filasAtuais = selectedUser.filasDetalhes || [];
            const mcduAtuais = selectedUser.mcdu || [];
            const segmentosAtuais = selectedUser.segmentos || [];
            const filasCadastradas = filasAtuais.map((fila, idx) => ({
                fila,
                mcdu: mcduAtuais[idx] || '',
                segmento: segmentosAtuais[idx] || ''
            }));
            setFilasSelecionadasTemporarias(filasCadastradas);
        }
    }, [selectedUser, showFilasModal, setFilasSelecionadasTemporarias]);

    if (!showFilasModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content filas-modal">
                <div className="modal-header">
                    <h3>
                        {isAjuste
                            ? `Ajustar Filas de ${selectedUser?.nome}`
                            : `Cadastrar Filas para ${selectedUser?.nome}`}
                    </h3>
                    <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                </div>
                <div className="modal-body">
                    {updateStatus ? (
                        <div className={`status-message ${updateStatus}`}>
                            {updateStatus === 'success'
                                ? 'Operação realizada com sucesso, gentileza, solicite ao colaborador relogar no HelpLine para a alteração refletir'
                                : 'Ocorreu um erro, por gentileza tente novamente'}
                            <div className="modal-footer single-button">
                                <button
                                    className="modal-button primary-button"
                                    onClick={() => {
                                        handleCloseModal();
                                        setTimeout(() => {
                                            const user = usuarios.find(u => u.idUsuario === selectedUser.idUsuario);
                                            if (user) {
                                                handleOpenModal(user, 'filas');
                                            }
                                        }, 100);
                                    }}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="filtros-container">
                                <label htmlFor="segmento">Segmento:</label>
                                <select
                                    id="segmento"
                                    value={segmentoSelecionado}
                                    onChange={e => setSegmentoSelecionado(e.target.value)}
                                    className="filtro-select"
                                >
                                    {segmentos.map(seg => (
                                        <option key={seg.value} value={seg.value}>
                                            {seg.label}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="listas-container">
                                <div className="lista-disponiveis">
                                    <div className="lista-header">
                                        <h4>Filas Disponíveis</h4>
                                        <div className="lista-header-actions">
                                            <input
                                                type="text"
                                                value={termoBuscaDisponiveisRaw}
                                                onChange={e => setTermoBuscaDisponiveisRaw(e.target.value)}
                                                placeholder="Buscar filas..."
                                                className="busca-input"
                                            />
                                            <button onClick={selecionarTodasDisponiveis} className="selecionar-todas">
                                                {selecionadasParaAdicionar.length === filasDisponiveis.length
                                                    ? 'Desmarcar Todas'
                                                    : 'Marcar Todas'}
                                            </button>
                                        </div>
                                    </div>
                                    <DroppableArea onDrop={handleDrop} type="disponivel">
                                        {filasDisponiveis.length === 0 ? (
                                            <div className="nenhum-resultado">
                                                {termoBuscaDisponiveisRaw.trim()
                                                    ? 'Nenhuma fila encontrada'
                                                    : 'Nenhuma fila disponível'}
                                            </div>
                                        ) : (
                                            filasDisponiveis.map((fila) => (
                                                <DraggableFila
                                                    key={`disp-${fila.fila}`}
                                                    fila={fila}
                                                    type="disponivel"
                                                    isSelected={selecionadasParaAdicionar.includes(fila.fila)}
                                                    onToggle={toggleSelecaoAdicao}
                                                    selecionadasParaAdicionar={selecionadasParaAdicionar}
                                                    selecionadasParaRemover={selecionadasParaRemover}
                                                />
                                            ))
                                        )}
                                    </DroppableArea>
                                </div>

                                <div className="lista-botoes">
                                    <button
                                        className="botao-mover"
                                        onClick={adicionarFilas}
                                        disabled={selecionadasParaAdicionar.length === 0}
                                    >
                                        →
                                    </button>
                                    <button
                                        className="botao-mover"
                                        onClick={removerFilas}
                                        disabled={selecionadasParaRemover.length === 0}
                                    >
                                        ←
                                    </button>
                                </div>

                                <div className="lista-selecionadas">
                                    <div className="lista-header">
                                        <h4>Filas a Cadastrar</h4>
                                        <div className="lista-header-actions">
                                            <input
                                                type="text"
                                                value={termoBuscaSelecionadasRaw}
                                                onChange={e => setTermoBuscaSelecionadasRaw(e.target.value)}
                                                placeholder="Buscar filas..."
                                                className="busca-input"
                                            />
                                            <button onClick={selecionarTodasSelecionadas} className="selecionar-todas">
                                                {selecionadasParaRemover.length === filasSelecionadasFiltradas.length
                                                    ? 'Desmarcar Todas'
                                                    : 'Marcar Todas'}
                                            </button>
                                        </div>
                                    </div>
                                    <DroppableArea onDrop={handleDrop} type="selecionada">
                                        {filasSelecionadasFiltradas.length === 0 ? (
                                            <div className="nenhum-resultado">
                                                {termoBuscaSelecionadasRaw.trim()
                                                    ? 'Nenhuma fila encontrada'
                                                    : 'Nenhuma fila selecionada'}
                                            </div>
                                        ) : (
                                            filasSelecionadasFiltradas.map((fila) => (
                                                <DraggableFila
                                                    key={`sel-${fila.fila}`}
                                                    fila={fila}
                                                    type="selecionada"
                                                    isSelected={selecionadasParaRemover.includes(fila.fila)}
                                                    onToggle={toggleSelecaoRemocao}
                                                    selecionadasParaAdicionar={selecionadasParaAdicionar}
                                                    selecionadasParaRemover={selecionadasParaRemover}
                                                />
                                            ))
                                        )}
                                    </DroppableArea>
                                </div>
                            </div>

                            {isUpdating && <div className="loader">Processando...</div>}
                        </>
                    )}
                </div>
                {!updateStatus && (
                    <div className="modal-footer">
                        <button
                            className="modal-button secondary-button"
                            onClick={handleCloseModal}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </button>
                        <button
                            className="modal-button primary-button"
                            onClick={handleCadastrarFilas}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Processando...' : (isAjuste ? 'Atualizar Filas' : 'Cadastrar Filas')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
