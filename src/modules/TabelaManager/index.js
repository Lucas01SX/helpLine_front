import React from 'react';
import './App.css';

const TabelaManager = ({ dados }) => {
    return (
        <div className="tabela-container">
            <table className="tabela-suporte">
                <thead>
                    <tr>
                        <th>Login</th>
                        <th>Nome</th>
                        <th>Supervisor</th>
                        <th>Fila</th>
                        <th>Tempo Espera</th>
                        <th>Tempo Atendimento</th>
                        <th>Nome Suporte</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((usuario, index) => (
                        <tr key={index}>
                            <td>{usuario.login}</td>
                            <td>{usuario.nomeOperador || 'N/A'}</td>
                            <td>{usuario.supervisor || 'N/A'}</td>
                            <td>{usuario.fila}</td>
                            <td>{usuario.tempEspera || 'N/A'}</td>
                            <td>{usuario.tempAtendimento || 'N/A'}</td>
                            <td>{usuario.nomeSuporte || 'N/A'}</td>
                            <td>{usuario.status || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaManager;
