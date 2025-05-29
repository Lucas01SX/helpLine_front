import React from 'react';
import './App.css';

const ModalSuporte = ({ chamado, onEncerrar }) => {
    if (!chamado) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-suporte">
                <h2>Prestando suporte para fila {chamado.fila}</h2>
                <div className="modal-buttons">
                    <button className="close-button" onClick={() => onEncerrar(chamado)}>Encerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalSuporte;
