import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho para o local correto
import { useNavigate } from 'react-router-dom'; // Hook para navegação
import './App.css';
import socket from '../../context/Socket'

const Login = () => {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isCadastro, setIsCadastro] = useState(false); // Controla se estamos em processo de cadastro de usuário
    const [isUpdate, setIsUpdate] = useState(false); // Controla se estamos em processo de cadastro de senha
    const { login } = useAuth(); // Acessando a função de login do contexto
    const navigate = useNavigate();


    const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
    const baseUrl = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');

        if ((isCadastro || isUpdate) && senha !== confirmarSenha) {
            setErro('As senhas não conferem, por gentileza verifique!');
            setSenha('');
            setConfirmarSenha('');
            return;
        }

        // Define a URL dinamicamente
        const url = isCadastro
            ? `${baseUrl}/suporte-api/api/users/create`
            : isUpdate
                ? `${baseUrl}/suporte-api/api/users/update`
                : `${baseUrl}/suporte-api/api/users/login`;

        const bodyData = isCadastro || isUpdate
            ? { matricula, senha, confirmarSenha }
            : { matricula, senha };


        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            // Tratamento de mensagens retornadas pela API
            if (data.message === 'Usuário não encontrado') {
                setErro('Usuário não cadastrado. Por favor, crie uma conta.');
                setIsCadastro(true);
            } else if (data.message === 'Usuário cadastrado com sucesso!') {
                setErro('Usuário cadastrado com sucesso. Faça o login.');
                limparCampos();
                setIsCadastro(false);
            } else if (data.message === 'Não há senha cadastrada, por gentileza cadastre sua senha!') {
                setErro('Por favor, crie uma senha.');
                setIsUpdate(true);
            } else if (data.message === 'Senha cadastrada com sucesso!') {
                setErro('Senha cadastrada com sucesso. Faça o login.');
                limparCampos();
                setIsUpdate(false);
            } else if (data.message === 'Senha inválida') {
                setErro('Senha inválida. Tente novamente.');
            } else if (data.message === 'As senhas não conferem, por gentileza verifique!') {
                setErro('As senhas não conferem, por gentileza verifique!');
                setSenha('');
                setConfirmarSenha('');
                return;
            }
            else if (data.message === 'Autenticação bem-sucedida!') {
                login(data.user);
                socket.connect();
                navigate('/home');
            } else {
                setErro(data.message)
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setErro('Erro ao conectar com o servidor.');
        }
    };

    const limparCampos = () => {
        setMatricula('');
        setSenha('');
        setConfirmarSenha('');
    };

    return (
        <div className="login-container">
            <h2>
                {isCadastro
                    ? 'Criação de Conta'
                    : isUpdate
                        ? 'Cadastrando Senha'
                        : 'Login'}
            </h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Matrícula</label>
                    <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                {(isCadastro || isUpdate) && (
                    <div className="input-group">
                        <label>Confirme sua Senha</label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </div>
                )}
                {erro && <p className="error-message">{erro}</p>}
                <button className="btnLogin" type="submit">
                    {isCadastro
                        ? 'Cadastrar'
                        : isUpdate
                            ? 'Cadastrar Senha'
                            : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

export default Login;
