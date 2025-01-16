import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Importando o hook useAuth
import './App.css';

const Header = () => {
    const { user, logout } = useAuth();  // Obtendo os dados do usuário logado e a função de logout
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();  // Limpar o usuário do contexto
        navigate('/');  // Redirecionar para a página de login
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
