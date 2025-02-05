import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';  // Importa o Navigate para redirecionamento
import OperadorView from '../OperadorView';
import SuporteView from '../SuporteView';
import ManagerView from '../ManagerView';
import './App.css'

const Home = ({ page }) => {
    const { user } = useAuth();
    const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
    const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';
    // Verifica se o user está disponível antes de acessar codfuncao
    if (!user) {
        return <Navigate to="/" />;  // Redireciona para a página de login
    }
    // Função para verificar se o usuário tem permissão para acessar uma página específica
    const hasPermission = (requiredCodFuncao) => {
        return requiredCodFuncao.includes(user.codfuncao);
    };
    // Define as permissões para cada página
    const permissions = {
        OperadorView: [1066, 14936],
        ManagerView: [1031, 935, 14942, 15264,828,572,574,15],
        SuporteView: [1031, 935, 14942, 15264,828,572,574,944,15],
    };
    let ComponentToRender;
    let classe = 'home-container';
    if (page && permissions[page] && hasPermission(permissions[page])) {
        // Se a prop `page` foi passada e o usuário tem permissão para acessá-la
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
                // Caso a página não seja reconhecida, redireciona para a página de login
                return <Navigate to="/" />;
        }
    } else {
        // Se a prop `page` não foi passada ou o usuário não tem permissão, usa o codfuncao para decidir
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
    return (
        <div className={classe}>
            {ComponentToRender}
        </div>
    );
};

export default Home;
