import React from 'react';
import { useDrop } from 'react-dnd';

export const DroppableArea = ({ children, onDrop, type }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'FILA',
        drop: item => onDrop(item),
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <div ref={drop} className={`lista-items ${isOver ? 'drop-over' : ''}`}>
            {children}
        </div>
    );
};
