import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import OperadorView from '../OperadorView';
import SuporteView from '../SuporteView';
import ManagerView from '../ManagerView';
import './App.css';

const Home = ({ page }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
    const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';

    // ✅ Garante que o hook SEMPRE seja chamado
    useEffect(() => {
        const checkTimeAndLogout = () => {
            const now = new Date();
            if (now.getHours() === 22) {
                logout();
                navigate("/"); // ✅ Redireciona corretamente
            }
        };
        const interval = setInterval(checkTimeAndLogout, 60 * 1000);
        return () => clearInterval(interval);
    }, [logout, navigate]); 

    // Se o usuário não estiver autenticado, faz o redirecionamento
    if (!user) {
        return <Navigate to="/" />;
    }

    const hasPermission = (requiredCodFuncao) => {
        return requiredCodFuncao.includes(user.codfuncao);
    };

    const permissions = {
        OperadorView: [1066, 14936],
        ManagerView: [1031, 935, 14942, 15264, 828, 572, 574, 15],
        SuporteView: [1031, 935, 14942, 15264, 828, 572, 574, 944, 15],
    };

    let ComponentToRender;
    let classe = 'home-container';

    if (page && permissions[page] && hasPermission(permissions[page])) {
        switch (page) {
            case 'OperadorView':
                ComponentToRender = <OperadorView user={user} baseUrl={baseUrl} />;
                classe = 'operador-container';
                break;
            case 'ManagerView':
                ComponentToRender = <ManagerView user={user} baseUrl={baseUrl} />;
                break;
            case 'SuporteView':
                ComponentToRender = <SuporteView user={user} baseUrl={baseUrl} />;
                break;
            default:
                return <Navigate to="/" />;
        }
    } else {
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
            case 828:
            case 572:
            case 574:
            case 15:
                ComponentToRender = <ManagerView user={user} baseUrl={baseUrl} />;
                break;
            default:
                ComponentToRender = <SuporteView user={user} baseUrl={baseUrl} />;
                classe = 'home-container';
                break;
        }
    }

    return <div className={classe}>{ComponentToRender}</div>;
};

export default Home;
