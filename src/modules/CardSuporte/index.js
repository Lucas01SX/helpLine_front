import React from 'react';
import { CButton } from '@coreui/react';
import './App.css';

const CardSuporte = ({ tempoEspera, fila, handleCancelarSuporte, botaoCancelarDesabilitado, textoBotao }) => {
    const { fila: filaName, idCancelamento } = fila; // Desestruturando os valores de fila

    return (
        <div className="cardOperador">
            <div className="suporte-card">
                <span>
                    Aguardando suporte {filaName} ...
                </span>
                <span style={{ animation: 'piscando 1s infinite' }}>
                    Tempo de Espera: {tempoEspera}
                </span>
                {botaoCancelarDesabilitado ? (
                    <span className="em-atendimento">Em Atendimento</span>
                ) : (
                    <CButton
                        className="btn-danger"
                        onClick={() => handleCancelarSuporte(idCancelamento)}
                    >
                        {textoBotao || "Cancelar Suporte"}
                    </CButton>
                )}
            </div>
        </div>
    );
};

export default CardSuporte;
