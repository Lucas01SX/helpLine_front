import React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import './App.css';

const TabelaSuporte = ({ chamados, onAtenderSuporte }) => {
    const columnHelper = createColumnHelper();

    // Configurar colunas
    const columns = [
        columnHelper.accessor((_, index) => index + 1, {
            id: 'index',
            header: '#',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('fila', {
            header: 'Fila',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('tempoEspera', {
            header: 'Tempo de Espera',
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: 'acao',
            header: 'Ação',
            cell: ({ row }) => {
                const status = row.original.status; // Verifica se o status é "em atendimento"
                return (
                    <button
                        className={`btn-atender ${status === 'em atendimento' ? 'danger' : ''}`}
                        onClick={() => onAtenderSuporte(row.original.id)}
                        disabled={status === 'em atendimento'}
                    >
                        {status === 'em atendimento' ? 'Em atendimento' : 'Atender'}
                    </button>
                );
            },
        }),
    ];

    // Preparar os dados
    const data = React.useMemo(() => {
        const processData = chamados.map((chamado) => {
            const agora = new Date();
            const [hora, minuto, segundo] = chamado.horaInicio.split(':').map(Number);
            const inicio = new Date(agora);
            inicio.setHours(hora, minuto, segundo, 0);
            const diferenca = Math.floor((agora - inicio) / 1000); // Tempo de espera em segundos

            const horas = String(Math.floor(diferenca / 3600)).padStart(2, '0');
            const minutos = String(Math.floor((diferenca % 3600) / 60)).padStart(2, '0');
            const segundos = String(diferenca % 60).padStart(2, '0');

            return {
                ...chamado,
                tempoEspera: `${horas}:${minutos}:${segundos}`,
                tempoEsperaSegundos: diferenca, // Usado para ordenar
            };
        });

        // Ordenar os chamados
        return processData.sort((a, b) => {
           
            //1. Acionamentos acima de 3 min tem prioridade na tabela
            if (a.tempoEsperaSegundos >= 180 && b.tempoEsperaSegundos < 180) return -1;
            if (b.tempoEsperaSegundos >= 180 && a.tempoEsperaSegundos < 180) return 1;
    
            // 2. "Comercial Clientes" tem prioridade sobre outras filas (exceto chamadas com +3 minutos)
            if (a.fila === 'COMERCIAL_CLIENTES' && b.fila !== 'COMERCIAL_CLIENTES') return -1;
            if (b.fila === 'COMERCIAL_CLIENTES' && a.fila !== 'COMERCIAL_CLIENTES') return 1;
            // 3. Ordenar pelo status: "em atendimento" vai para o final
            if (a.status === 'em atendimento' && b.status !== 'em atendimento') return 1;
            if (a.status !== 'em atendimento' && b.status === 'em atendimento') return -1;

            // 4. Ordenar por maior tempo de espera
            return b.tempoEsperaSegundos - a.tempoEsperaSegundos;
        });
    }, [chamados]);

    // Configurar a tabela
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="tabela-container">
            <table className="tabela-suporte">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={
                                        header.column.getIsSorted() === 'asc'
                                            ? 'asc'
                                            : header.column.getIsSorted() === 'desc'
                                            ? 'desc'
                                            : ''
                                    }
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaSuporte;
