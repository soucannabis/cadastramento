import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';

const GenderSelect = ({ handleChangeInput, value, name }) => {
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
            id="gender"
            name="gender"
            value={currentValue}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            <option value="homem-cis">Homem Cis</option>
            <option value="mulher-cis">Mulher Cis</option>
            <option value="homem-trans">Homem Trans</option>
            <option value="mulher-trans">Mulher Trans</option>
            <option value="travesti">Travesti</option>
            <option value="nao-binario">Não binário</option>
            <option value="outro">Outro Gênero</option>
          </select>
          <br></br>
          <br></br>
          {hiddenInput && (
            <input   
              className="form-input" 
              type="text" 
              name="gender" 
              placeholder="Digite o gênero que se identifica"  
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

export default GenderSelect;
