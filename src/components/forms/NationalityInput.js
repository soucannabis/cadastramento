import React, { useState, useRef, useEffect } from 'react';

const NationalityInput = ({ handleChangeInput, value, name }) => {
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
  const customInputRef = useRef(null);
  const selectRef = useRef(null);

  // Inicialização: verifica se deve mostrar o campo personalizado
  useEffect(() => {
    if (value && value !== 'brasileiro(a)' && value !== 'outro') {
      setIsCustomInputVisible(true);
    } else if (value === 'outro') {
      setIsCustomInputVisible(true);
    }
  }, []);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === 'outro') {
      setIsCustomInputVisible(true);
      // Foca no campo personalizado se já existe um valor
      if (customInputRef.current && customInputRef.current.value) {
        setTimeout(() => customInputRef.current.focus(), 100);
      }
    } else {
      setIsCustomInputVisible(false);
      // Atualiza o localStorage com o valor selecionado
      handleChangeInput(e);
    }
  };

  const handleCustomInputChange = (e) => {
    const newValue = e.target.value;
    
    // Cria um evento simulado para o localStorage
    const customEvent = {
      target: {
        name: 'nationality',
        value: newValue
      }
    };
    
    // Atualiza o localStorage
    handleChangeInput(customEvent);
  };

  const handleCustomInputBlur = () => {
    // Se o campo personalizado estiver vazio, volta para o select
    if (customInputRef.current && !customInputRef.current.value.trim()) {
      setIsCustomInputVisible(false);
      if (selectRef.current) {
        selectRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <select
        ref={selectRef}
        className="form-input" 
        id="nationality"
        name="nationality"
        value={isCustomInputVisible ? 'outro' : (value || '')}
        onChange={handleSelectChange}
      >
        <option value="">Selecione...</option>
        <option value="brasileiro(a)">Brasileiro(a)</option>
        <option value="outro">Outra nacionalidade</option>
      </select>
      
      <br />
      <br />
      
      {isCustomInputVisible && (
        <input 
          ref={customInputRef}
          placeholder='Digite sua nacionalidade'  
          className="form-input" 
          type="text"  
          name="nationality" 
          defaultValue={value && value !== 'brasileiro(a)' && value !== 'outro' ? value : ''}
          onChange={handleCustomInputChange}
          onBlur={handleCustomInputBlur}
        />
      )}
    </div>
  );
};

export default NationalityInput;
