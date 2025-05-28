import React from 'react';

export const ModalPerfil = ({
    showModal,
    selectedUser,
    novoPerfilId,
    isUpdating,
    updateStatus,
    perfisDisponiveis,
    handleCloseModal,
    handlePerfilChange,
    handleAlterarPerfil
}) => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Alterar Perfil de {selectedUser?.nome}</h3>
                    <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                </div>
                <div className="modal-body">
                    {updateStatus ? (
                        <div className={`status-message ${updateStatus}`}>
                            {updateStatus === 'success'
                                ? 'Perfil alterado com sucesso, gentileza, solicite ao colaborador relogar no HelpLine para a alteração refletir!'
                                : 'Ocorreu um erro, por gentileza tente novamente'}
                        </div>
                    ) : (
                        <>
                            <select
                                value={novoPerfilId}
                                onChange={handlePerfilChange}
                                className="modal-select"
                                disabled={isUpdating}
                            >
                                <option value="">Selecione um perfil</option>
                                {perfisDisponiveis.map(perfil => (
                                    <option key={perfil.id} value={perfil.id}>
                                        {perfil.nome}
                                    </option>
                                ))}
                            </select>
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
                            onClick={handleAlterarPerfil}
                            disabled={!novoPerfilId || isUpdating}
                        >
                            {isUpdating ? 'Processando...' : 'Confirmar Alteração'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
