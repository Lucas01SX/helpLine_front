import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';  // Importa o Navigate para redirecionamento
import OperadorView from '../OperadorView';
import SuporteView from '../SuporteView';
import ManagerView from '../ManagerView';
import './App.css'

const Home = () => {
    const { user } = useAuth();

    const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost' || window.location.hostname === '172.32.1.73';
    const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';

    // Verifica se o user está disponível antes de acessar codfuncao
    if (!user) {
        return <Navigate to="/" />;  // Redireciona para a página de login
    }

    let ComponentToRender;
    let classe = 'home-container'
    switch (user.codfuncao) {
        case 1066:
        case 14936:
            ComponentToRender = <OperadorView user={user} baseUrl={baseUrl} />;
            classe = 'operador-container';
            break;
        case 1031:
        case 935:
        case 14942:
        case 15264:
            ComponentToRender = <ManagerView user={user} baseUrl={baseUrl} />;
            break;
        default:
            ComponentToRender = <SuporteView user={user} baseUrl={baseUrl} />;
            classe = 'home-container'
            break;
    }

    return (
        <div className={classe}>
            {ComponentToRender}
        </div>
    );
};

export default Home;
