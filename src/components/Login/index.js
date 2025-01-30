import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
            ? `create`
            : isUpdate
                ? `update`
                : `login_chamado`;

        const bodyData = isCadastro || isUpdate
            ? { matricula, senha, confirmarSenha }
            : { matricula, senha };


        try {
            socket.emit(`${url}`,
                bodyData,
                (response) => {
                    console.log(response);
                    // Tratamento de mensagens retornadas pela API
                    if (response.message === 'Usuário não encontrado') {
                        setErro('Usuário não cadastrado. Por favor, crie uma conta.');
                        setIsCadastro(true);
                    } else if (response.message === 'Usuário cadastrado com sucesso!') {
                        setErro('Usuário cadastrado com sucesso. Faça o login.');
                        limparCampos();
                        setIsCadastro(false);
                    } else if (response.message === 'Não há senha cadastrada, por gentileza cadastre sua senha!') {
                        setErro('Por favor, crie uma senha.');
                        setIsUpdate(true);
                    } else if (response.message === 'Senha cadastrada com sucesso!') {
                        setErro('Senha cadastrada com sucesso. Faça o login.');
                        limparCampos();
                        setIsUpdate(false);
                    } else if (response.message === 'Senha inválida') {
                        setErro('Senha inválida. Tente novamente.');
                    } else if (response.message === 'As senhas não conferem, por gentileza verifique!') {
                        setErro('As senhas não conferem, por gentileza verifique!');
                        setSenha('');
                        setConfirmarSenha('');
                        return;
                    }
                    else if (response.message === 'Autenticação bem-sucedida!') {
                        login(response.user);
                        socket.connect();
                        navigate('/home');
                    } else {
                        setErro(response.message)
                    }
                }
            )


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
                    <label>Matrícula Plansul</label>
                    <input
                        autoComplete='matricula'
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Senha</label>
                    <input
                        autoComplete="current-password"
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
                            autoComplete="new-password"
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </div>
                )}
                {erro && <span className="error-message">{erro}</span>}
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
