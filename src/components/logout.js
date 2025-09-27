import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'
import SecureAuthentication from '../modules/SecureAuthentication';

function Logout() { 

  const [logout, setLogout] = useState(false);

  const logoutHandleChange = async (event) => {
    try {
      // ✅ Invalidar sessão no servidor (limpa cookie HttpOnly)
      await SecureAuthentication.logout();
      
      // ✅ Limpar apenas dados não sensíveis do localStorage
      localStorage.removeItem("user_folder"); // Manter se necessário para UX
      
      setLogout(true);
      // ✅ Redirecionar para login
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro no logout:', error);
      // ✅ Forçar redirecionamento mesmo com erro
      setLogout(true);
      window.location.href = '/login';
    }
  };
    
    return (
      <div>
      Usuario Logado! 
      <br></br>     
      <a  onClick={logoutHandleChange} className="btn btn-primary">Sair</a>
      </div>
     );
}

export default Logout;
