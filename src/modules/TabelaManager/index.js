import React from 'react';
import './App.css';

const TabelaManager = ({ usuarios }) => {
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
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario, index) => (
                        <tr key={index}>
                            <td>{usuario.login}</td>
                            <td>{usuario.nome}</td>
                            <td>{usuario.supervisor}</td>
                            <td>{usuario.fila}</td>
                            <td>{usuario.tempEspera}</td>
                            <td>{usuario.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaManager;
