import React, { useState } from 'react';
import './App.css';

const BlocoSuporte = ({ onSalvar }) => {
    
    const [texto, setTexto] = useState('');

    const handleSave = () => {
        onSalvar(texto);
        // console.log("Info repassada:",texto)
    };
    return (
        <div className="modal-overlay">
            <div className="modal-bloco">
                <h5>Descreva abaixo a informação repassada para o operador:</h5>
                <h1> </h1>
                <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <div className="modal-buttons">
                    <button className="button-bloco" onClick={handleSave}>
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlocoSuporte;