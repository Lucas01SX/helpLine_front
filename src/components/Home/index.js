import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';  // Importa o Navigate para redirecionamento
import OperadorView from '../OperadorView';
import SuporteView from '../SuporteView';
import ManagerView from '../ManagerView';
import './App.css'

const Home = () => {
    const { user } = useAuth();

    // Verifica se o user está disponível antes de acessar codfuncao
    if (!user) {
        return <Navigate to="/" />;  // Redireciona para a página de login
    }

    let ComponentToRender;

    switch (user.codfuncao) {
        case 1066:
        case 14936:
            ComponentToRender = <OperadorView user={user} />;
            break;
        case 1031:
            ComponentToRender = <ManagerView user={user} />;
            break;
        default:
            ComponentToRender = <SuporteView user={user} />;
            break;
    }

    return (
        // || user.codfuncao === 1031
        <div className="home-container">
            {ComponentToRender}
        </div>
    );
};

export default Home;
