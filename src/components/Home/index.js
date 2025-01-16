import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';  // Importa o Navigate para redirecionamento
import OperadorView from '../OperadorView';
import SuporteView from '../SuporteView';
import './App.css'

const Home = () => {
    const { user } = useAuth();

    // Verifica se o user está disponível antes de acessar codfuncao
    if (!user) {
        return <Navigate to="/" />;  // Redireciona para a página de login
    }

    return (
        // || user.codfuncao === 1031
        <div className="home-container">
            {user.codfuncao === 1066 || user.codfuncao === 14936  ? (
                <OperadorView user={user} />
            ) : (
                <SuporteView user={user} />
            )}
        </div>
    );
};

export default Home;
