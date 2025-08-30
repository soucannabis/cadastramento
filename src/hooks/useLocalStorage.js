import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar dados no localStorage
 * @param {string} key - Chave para armazenar no localStorage
 * @param {any} initialValue - Valor inicial caso não exista no localStorage
 * @returns {Array} [storedValue, setValue] - Valor armazenado e função para atualizar
 */
export const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Tenta obter do localStorage
      const item = window.localStorage.getItem(key);
      // Retorna o item parseado ou o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Em caso de erro, retorna o valor inicial
      console.error(`Erro ao ler do localStorage: ${error}`);
      return initialValue;
    }
  });

  // Função para atualizar o valor no localStorage e no estado
  const setValue = (value) => {
    try {
      // Permite que value seja uma função para ter a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salva no estado
      setStoredValue(valueToStore);
      
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage: ${error}`);
    }
  };

  // Função para limpar dados específicos do localStorage
  const clearValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao limpar localStorage: ${error}`);
    }
  };

  // Função para limpar apenas os dados do formulário específico
  const clearFormData = () => {
    try {
      // Remove apenas a chave específica do formulário atual
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao limpar dados do formulário: ${error}`);
    }
  };

  return [storedValue, setValue, clearValue, clearFormData];
};

/**
 * Hook específico para formulários que salva automaticamente no localStorage
 * @param {string} formKey - Chave única para o formulário
 * @param {object} initialFormData - Dados iniciais do formulário
 * @returns {Array} [formData, setFormData, clearFormData] - Dados do formulário e funções de controle
 */
export const useFormLocalStorage = (formKey, initialFormData) => {
  const [formData, setFormData, clearValue, clearFormData] = useLocalStorage(
    `form_${formKey}`, 
    initialFormData
  );

  // Função para atualizar um campo específico
  const updateField = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Função para atualizar múltiplos campos
  const updateMultipleFields = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Função para resetar o formulário para os valores iniciais
  const resetForm = () => {
    setFormData(initialFormData);
  };

  return [
    formData, 
    setFormData, 
    updateField, 
    updateMultipleFields, 
    resetForm, 
    clearFormData
  ];
};
