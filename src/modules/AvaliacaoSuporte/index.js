import React, { useState } from 'react';
import './App.css'; // Certifique-se de ter um arquivo CSS para os estilos

const StarRating = ({ onSalvar }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSave = () => {
    onSalvar(rating);
    console.log("Nota para o atendimento: ",rating)
  };

  return (
    <div className='modal-overlay'>
      <div className='modal-content-rating'>
        <p>Avalie o seu suporte:</p>
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= rating ? "on" : "off"}
                onClick={() => handleRating(index)}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>
        <div className="modal-buttons">
          <button className="rating-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarRating;