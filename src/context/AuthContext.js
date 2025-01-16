import React, { createContext, useContext, useState, useEffect } from 'react';

// Criando o Contexto de Autenticação
const AuthContext = createContext();

// Componente Provider que vai envolver a aplicação
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Recuperar o usuário do localStorage se houver
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData); // Atualiza o estado com os dados do usuário

        localStorage.setItem('user', JSON.stringify(userData)); // Salva no localStorage
    };

    const logout = () => {
        setUser(null); // Limpa o estado do usuário
        localStorage.removeItem('user'); // Remove do localStorage
    };

    useEffect(() => {
        // Efeito que roda toda vez que o estado do usuário muda
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para acessar o AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};