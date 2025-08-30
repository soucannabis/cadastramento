import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';

const NationalityInput = ({ handleChangeInput, value, name }) => {
  const [hiddenInput, setHiddenInput] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');

  // Sincroniza com o valor recebido via props
  useEffect(() => {
    setCurrentValue(value || '');
    if (value && value !== 'outro') {
      setHiddenInput(false);
    } else if (value === 'outro') {
      setHiddenInput(true);
    }
  }, [value]);

  function handleChange(e){
    const newValue = e.target.value;
    setCurrentValue(newValue);
    
    if (newValue === 'outro') {
      setHiddenInput(true);
    } else {
      setHiddenInput(false);
    }
    
    // Chama a função de callback para atualizar o localStorage
    handleChangeInput(e);
  }

  return (
        <form>
          <select
            className="form-input" 
            as="select"
            id="nationality"
            name="nationality"
            value={currentValue}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            <option value="brasileiro(a)">Brasileiro(a)</option>
            <option value="outro">Outra nacionalidade</option>
          </select>
          <br></br>
          <br></br>
          {hiddenInput && (
            <input 
              placeholder='Digite sua nacionalidade'  
              className="form-input" 
              type="text"  
              name="nationality" 
              value={currentValue === 'outro' ? '' : currentValue}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                handleChangeInput(e);
              }}
            />
          )}
        </form>
  );
};

export default NationalityInput;
