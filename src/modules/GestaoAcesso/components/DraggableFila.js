import React from 'react';
import { useDrag } from 'react-dnd';

export const DraggableFila = ({
    fila, type, isSelected,
    onToggle, selecionadasParaAdicionar, selecionadasParaRemover
}) => {
    const isMultiDrag = type === 'disponivel'
        ? selecionadasParaAdicionar.length > 1
        : selecionadasParaRemover.length > 1;

    const [{ isDragging }, drag] = useDrag({
        type: 'FILA',
        item: () => ({ fila, type, isSelected, isMultiDrag }),
        collect: monitor => ({ isDragging: monitor.isDragging() }),
        end: (item, monitor) => {
            if (monitor.didDrop() && !item.isMultiDrag && item.isSelected) {
                onToggle(item.fila.fila);
            }
        }
    });

    return (
        <div
            ref={drag}
            className={`lista-item ${isSelected ? 'selecionado' : ''} ${isDragging ? 'dragging' : ''}`}
            onClick={() => onToggle(fila.fila)}
        >
            <input type="checkbox" checked={isSelected} readOnly />
            <div className="fila-info">
                <span className="fila-nome">{fila.fila}</span>
                <span className="fila-mcdu">MCDU: {fila.mcdu}</span>
            </div>
        </div>
    );
};
