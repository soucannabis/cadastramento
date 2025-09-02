import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';

const GenderSelect = ({ handleChangeInput, value, name }) => {
  const [hiddenInput, setHiddenInput] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const [customGenderValue, setCustomGenderValue] = useState('');

  useEffect(() => {

    const standardOptions = ['homem-cis', 'mulher-cis', 'homem-trans', 'mulher-trans', 'travesti', 'nao-binario', 'outro'];
    if (value && !standardOptions.includes(value)) {
      setCurrentValue('outro'); // Define o select como "outro"
      setCustomGenderValue(value);
      setHiddenInput(true);
    } else {
      setCurrentValue(value || '');
    }
    // Não altera o hiddenInput baseado no value para evitar fechar o input customizado
  }, [value]);

  function handleChange(e){
    const newValue = e.target.value;
    setCurrentValue(newValue);
    
    if (newValue === 'outro') {
      setHiddenInput(true);
    } else {
      setHiddenInput(false);
      // Chama a função de callback para atualizar o localStorage
      handleChangeInput(e);
    }
  }

  function handleCustomGenderChange(e) {
    const customValue = e.target.value;
    setCustomGenderValue(customValue);
    
    // Cria um evento sintético para passar o valor customizado
    const syntheticEvent = {
      target: {
        name: 'gender',
        value: customValue
      }
    };    
    handleChangeInput(syntheticEvent);
  }

  return (
        <div>
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
              value={customGenderValue}
              onChange={handleCustomGenderChange}
            />
          )}
        </div>
  );
};

export default GenderSelect;
