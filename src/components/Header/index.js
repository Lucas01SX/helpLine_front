import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './App.css';
import Dropdown from '../../modules/Dropdown'; // Importando o Dropdown
import socket from '../../context/Socket';
import ModalAlert from '../../modules/ModalAlert';

const Header = () => {
    const { user, logout } = useAuth();
    const [message, setMessage] = useState('');
    const [modalVisivel, setModalVisivel] = useState(false);
    const navigate = useNavigate();


    const handleLogout = () => {
        socket.emit('logoff',
            { token: user.token },
            (response) => {
                if (response.message === 'Logoff realizado' || response.message === 'seção não encontrado') {
                    logout();
                    navigate('/');
                }
            });
    };

    useEffect(() => {
        if (user) {
            socket.emit('atualizar_token', { token: user.token }, (response) => {
                if (response.message === "Token não atualizado") {
                    logout();
                    navigate('/');
                }
            });
    
            const interval = setInterval(() => {
                socket.emit('atualizar_token', { token: user.token }, (response) => {
                    console.log(response.message);
                    if (response.message === "Token não atualizado") {
                        logout();
                        navigate('/');
                    }
                });
            }, 60000);
    
            return () => clearInterval(interval);
        }
    }, [user, logout, navigate]); // ✅ Incluindo logout e navigate
    

    
    
    useEffect(() => {
        // Escutando a resposta do socket
        socket.on('aviso', (data) => {
            console.log(data);
            setMessage(data.message);
            setModalVisivel(true);
        });

        return () => {
            socket.off('aviso');
        };
    }, []);


    return (
        <header className="header-page">
            <div className="header-left">
                {user ? <span>{user.nome}</span> : <span>Usuário não autenticado</span>}
            </div>
            <nav className="header-right">
                {/* <button className="btnSair" onClick={handleLogout}>Sair</button> */}
                <Dropdown user={user} onLogout={handleLogout} />
            </nav>
            {modalVisivel && <ModalAlert message={message} />}
        </header>
    );
};

export default Header;
