import { useState, useEffect } from 'react';
import socket from '../../../context/Socket';

export const useGestaoAcessoData = (user, baseUrl) => {
    const matriculaLocal = user ? user.matricula : '';
    const [perfisDisponiveis, setPerfisDisponiveis] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filas, setFilas] = useState([]);
    const [segmentos, setSegmentos] = useState([]);

    useEffect(() => {
        socket.emit('consulta_cargos', (response) => {
            if (response.cargos) {
                const cargosFormatados = response.cargos.map(cargo => ({
                    id: cargo.co_funcao.replace(/^0+/, ''),
                    nome: cargo.de_funcao
                }));
                setPerfisDisponiveis(cargosFormatados);
            }
        });
    }, []);

    useEffect(() => {
        socket.emit('consulta_perfis', (response) => {
            if (response.perfis) {
                const usuariosFormatados = response.perfis.map(usuario => {
                    const filasUnicas = [...new Set(usuario.filas ? usuario.filas.split(',') : [])];
                    const mcduUnicos = [...new Set(usuario.mcdu ? usuario.mcdu.split(',') : [])];
                    const segmentosUnicos = [...new Set(usuario.segmentos ? usuario.segmentos.split(',') : [])];

                    return {
                        idUsuario: usuario.id_usuario,
                        matricula: usuario.matricula,
                        login: usuario.login,
                        nome: usuario.nome,
                        perfil: usuario.de_funcao,
                        filas: filasUnicas.length > 0 ? 'Cadastradas' : 'Não Cadastradas',
                        filasDetalhes: filasUnicas,
                        mcdu: mcduUnicos,
                        segmentos: segmentosUnicos
                    };
                });
                setUsuarios(usuariosFormatados);
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        const fetchFilas = async () => {
            try {
                const response = await fetch(`${baseUrl}/suporte-api/api/filas/gerais`);
                const data = await response.json();

                if (Array.isArray(data.filas)) {
                    setFilas(data.filas);
                    const segmentosUnicos = [...new Set(data.filas.map(f => f.segmento))];
                    setSegmentos([
                        { value: 'all', label: 'Todos os Segmentos' },
                        ...segmentosUnicos.map(s => ({ value: s, label: s }))
                    ]);
                }
            } catch (error) {
                console.error('Erro ao buscar filas:', error);
            }
        };
        fetchFilas();
    }, [baseUrl]);

    return {
        perfisDisponiveis,
        usuarios,
        setUsuarios,
        loading,
        filas,
        segmentos,
        matriculaLocal
    };
};
