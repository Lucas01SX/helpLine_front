import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';  // Importa o Navigate para redirecionamento
import OperadorView from '../OperadorView';
import SuporteView from '../SuporteView';
import ManagerView from '../ManagerView';
import './App.css'

const Home = () => {
    const { user } = useAuth();

    const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
    const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';

    // Verifica se o user está disponível antes de acessar codfuncao
    if (!user) {
        return <Navigate to="/" />;  // Redireciona para a página de login
    }

    let ComponentToRender;

    switch (user.codfuncao) {
        case 1066:
        case 14936:
            ComponentToRender = <OperadorView user={user} baseUrl={baseUrl} />;
            break;
        case 1031:
            ComponentToRender = <ManagerView user={user} baseUrl={baseUrl} />;
            break;
        default:
            ComponentToRender = <SuporteView user={user} baseUrl={baseUrl} />;
            break;
    }

    return (
        <div className="home-container">
            {ComponentToRender}
        </div>
    );
};

export default Home;
