import React, { createContext, useContext, useState, useEffect } from 'react';
import User from '../modules/User';
import LogoutService from '../modules/Logout';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);

  // ✅ Cache de 30 segundos para evitar chamadas desnecessárias
  const CACHE_DURATION = 30000; // 30 segundos

  const fetchUser = async (forceRefresh = false) => {
    const now = Date.now();
    
    // ✅ Se não for refresh forçado e os dados ainda estão em cache, não fazer nova requisição
    if (!forceRefresh && user && (now - lastFetch) < CACHE_DURATION) {
      return user;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userData = await User();
      
      if (userData) {
        setUser(userData);
        setLastFetch(now);
        return userData;
      } else {
        setUser(null);
        setLastFetch(now);
        return null;
      }
    } catch (err) {
      console.error('❌ UserContext: Erro ao buscar usuário:', err);
      setError(err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    return fetchUser(true);
  };

  const clearUser = () => {
    setUser(null);
    setLastFetch(0);
    setError(null);
  };

  const logout = async () => {
    
    // ✅ Usar o LogoutService para fazer logout completo
    await LogoutService.logout();
    
    // ✅ Limpar estado do contexto
    clearUser();
    
    // ✅ Forçar reload da página para garantir limpeza completa
    window.location.href = "/login";
  };

  // ✅ Buscar dados do usuário na inicialização (exceto em rotas públicas)
  useEffect(() => {
    const currentPath = window.location.pathname;
    const publicRoutes = [
      '/cadastro',
      '/login', 
      '/iniciar-cadastro',
      '/nova-senha',
      '/loja',
      '/seu-cadastro'
    ];
    
    // ✅ Só tentar buscar usuário se não estiver em rota pública
    if (!publicRoutes.includes(currentPath)) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    fetchUser,
    refreshUser,
    clearUser,
    logout,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
