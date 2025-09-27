import apiRequest from "./apiRequest";

async function User() {
  try {
    console.log('🔍 User.js: Tentando buscar dados via cookie HttpOnly...');
    // ✅ Tentar buscar dados via cookie HttpOnly
    const response = await apiRequest("/api/auth/me", "", "GET");
    
    console.log('🔍 User.js: Resposta do /api/auth/me:', response);
    
    if (response.success && response.user) {
      console.log('✅ User.js: Usuário autenticado via cookie, buscando dados completos...');
      // ✅ Buscar dados completos usando code_user do cookie
      const userData = await apiRequest("/api/directus/user", {
        code_user: response.user.user_code
      }, "POST");
      
      console.log('✅ User.js: Dados completos obtidos:', userData);
      
      // ✅ Retornar apenas os dados do usuário, não o objeto completo da resposta
      if (userData && userData.data) {
        console.log('✅ User.js: Retornando dados do usuário:', userData.data);
        return userData.data;
      }
      
      return null;
    }
    
    console.log('❌ User.js: Resposta não contém usuário autenticado');
    return null;
  } catch (error) {
    console.log('❌ User.js: Erro ao buscar usuário:', error.response?.status);
    
    // ✅ Se não estiver autenticado, retornar null (não forçar dados fictícios)
    console.log('❌ User.js: Usuário não autenticado, retornando null');
    return null;
  }
}

export default User;
