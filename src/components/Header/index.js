import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './App.css';
import socket from '../../context/Socket';

const Header = () => {
    const { user, logout } = useAuth();  // Obtendo os dados do usuário logado e a função de logout
    const navigate = useNavigate();

    const handleLogout = () => {
        socket.emit('logoff',
            (response) => {
                console.log(response)
                if (response.message === 'Logoff realizado' || 'seção não encontrado') {
                    logout();
                    navigate('/');
                }
            }
        )

    };

    return (
        <header className="header">
            <div className="header-left">
                {/* Exibindo o nome do usuário logado */}
                {user ? <span>{user.nome}</span> : <span>Usuário não autenticado</span>}
            </div>
            <nav className="header-right">
                <button className='btnSair' onClick={handleLogout}>Sair</button>
            </nav>
        </header>
    );
};

export default Header;
