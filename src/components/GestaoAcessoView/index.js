import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';

import { useGestaoAcessoData } from '../../modules/GestaoAcesso/hooks/useGestaoAcessoData';
import { usePerfilManagement } from '../../modules/GestaoAcesso/hooks/usePerfilManagement';
import { useFilasManagement } from '../../modules/GestaoAcesso/hooks/useFilasManagement';

import { ModalPerfil } from '../../modules/GestaoAcesso/components/ModalPerfil';
import { ModalFilas } from '../../modules/GestaoAcesso/components/ModalFilas';

import './App.css';

const GestaoAcessoView = ({ user, baseUrl }) => {
    DataTable.use(DT);

    const {
        perfisDisponiveis,
        usuarios,
        setUsuarios,
        loading,
        filas,
        segmentos,
        matriculaLocal
    } = useGestaoAcessoData(user, baseUrl);

    const {
        showModal,
        selectedUser: selectedUserPerfil,
        modalType,
        novoPerfilId,
        isUpdating: isUpdatingPerfil,
        updateStatus: updateStatusPerfil,
        handleOpenModal: handleOpenPerfilModal,
        handleCloseModal: handleClosePerfilModal,
        handlePerfilChange,
        handleAlterarPerfil
    } = usePerfilManagement(usuarios, perfisDisponiveis, matriculaLocal, setUsuarios);

    const {
        showFilasModal,
        selectedUser: selectedUserFilas,
        isUpdating: isUpdatingFilas,
        updateStatus: updateStatusFilas,
        isAjuste,
        segmentoSelecionado,
        termoBuscaDisponiveisRaw,
        termoBuscaSelecionadasRaw,
        filasDisponiveis,
        filasSelecionadasFiltradas,
        selecionadasParaAdicionar,
        selecionadasParaRemover,
        setSegmentoSelecionado,
        setTermoBuscaDisponiveisRaw,
        setTermoBuscaSelecionadasRaw,
        adicionarFilas,
        removerFilas,
        toggleSelecaoAdicao,
        toggleSelecaoRemocao,
        selecionarTodasDisponiveis,
        selecionarTodasSelecionadas,
        handleOpenModal: handleOpenFilasModal,
        handleCloseModal: handleCloseFilasModal,
        handleCadastrarFilas,
        handleDrop,
        setFilasSelecionadasTemporarias
    } = useFilasManagement(filas, usuarios, setUsuarios, user);

    const handleOpenModal = (user, type) => {
        if (type === 'perfil') {
            handleOpenPerfilModal(user, type);
        } else if (type === 'filas') {
            handleOpenFilasModal(user, type);
        }
    };

    if (loading) {
        return <div className="loading">Carregando dados...</div>;
    }

    return (
        <main className="controle-acesso-container">
            <section>
                <DataTable
                    className='custom-datatable'
                    data={usuarios}
                    options={{
                        responsive: true,
                        paging: true,
                        pageLength: 25,
                        lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "Todos"]],
                        searching: true,
                        destroy: true,
                        scrollY: 'calc(100vh - 300px)',
                        scrollCollapse: true,
                        scroller: true,
                        deferRender: true,
                        language: {
                            lengthMenu: "Mostrar _MENU_ registros por página",
                            zeroRecords: "Nenhum registro encontrado",
                            info: "Mostrando página _PAGE_ de _PAGES_",
                            infoEmpty: "Nenhum registro disponível",
                            infoFiltered: "(filtrado de _MAX_ registros totais)",
                            search: "Pesquisar:"
                        },
                        columns: [
                            { data: 'matricula', title: 'Matrícula' },
                            { data: 'login', title: 'Login' },
                            { data: 'nome', title: 'Nome' },
                            { data: 'perfil', title: 'Perfil' },
                            { data: 'filas', title: 'Filas' },
                            {
                                data: null,
                                title: 'Ações',
                                render: (data, type, row) => `
                                    <button class="action-button ${row.filas === 'Cadastradas' ? 'primary-button' : 'warning-button'}"
                                        data-id="${row.idUsuario}"
                                        data-type="filas">
                                        ${row.filas === 'Cadastradas' ? 'Ajustar Filas' : 'Cadastrar Filas'}
                                    </button>
                                    <button class="action-button secondary-button"
                                        data-id="${row.idUsuario}"
                                        data-type="perfil">
                                        Alterar Perfil
                                    </button>
                                `,
                                createdCell: (td, cellData, rowData) => {
                                    td.addEventListener('click', (e) => {
                                        if (e.target.tagName === 'BUTTON') {
                                            const type = e.target.getAttribute('data-type');
                                            const user = usuarios.find(u => u.idUsuario == rowData.idUsuario);
                                            handleOpenModal(user, type);
                                        }
                                    });
                                }
                            }
                        ]
                    }}
                />

                <ModalPerfil
                    showModal={showModal}
                    selectedUser={selectedUserPerfil}
                    novoPerfilId={novoPerfilId}
                    isUpdating={isUpdatingPerfil}
                    updateStatus={updateStatusPerfil}
                    perfisDisponiveis={perfisDisponiveis}
                    handleCloseModal={handleClosePerfilModal}
                    handlePerfilChange={handlePerfilChange}
                    handleAlterarPerfil={handleAlterarPerfil}
                />

                <DndProvider backend={HTML5Backend}>
                    <ModalFilas
                        showFilasModal={showFilasModal}
                        selectedUser={selectedUserFilas}
                        isUpdating={isUpdatingFilas}
                        updateStatus={updateStatusFilas}
                        isAjuste={isAjuste}
                        segmentos={segmentos} 
                        segmentoSelecionado={segmentoSelecionado}
                        termoBuscaDisponiveisRaw={termoBuscaDisponiveisRaw}
                        termoBuscaSelecionadasRaw={termoBuscaSelecionadasRaw}
                        filasDisponiveis={filasDisponiveis}
                        filasSelecionadasFiltradas={filasSelecionadasFiltradas}
                        selecionadasParaAdicionar={selecionadasParaAdicionar}
                        selecionadasParaRemover={selecionadasParaRemover}
                        setSegmentoSelecionado={setSegmentoSelecionado}
                        setTermoBuscaDisponiveisRaw={setTermoBuscaDisponiveisRaw}
                        setTermoBuscaSelecionadasRaw={setTermoBuscaSelecionadasRaw}
                        adicionarFilas={adicionarFilas}
                        removerFilas={removerFilas}
                        toggleSelecaoAdicao={toggleSelecaoAdicao}
                        toggleSelecaoRemocao={toggleSelecaoRemocao}
                        selecionarTodasDisponiveis={selecionarTodasDisponiveis}
                        selecionarTodasSelecionadas={selecionarTodasSelecionadas}
                        handleCloseModal={handleCloseFilasModal}
                        handleCadastrarFilas={handleCadastrarFilas}
                        handleDrop={handleDrop}
                        setFilasSelecionadasTemporarias={setFilasSelecionadasTemporarias}
                        usuarios={usuarios}
                        handleOpenModal={handleOpenFilasModal}
                    />
                </DndProvider>
            </section>
        </main>
    );
};

export default GestaoAcessoView;
