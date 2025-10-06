import apiRequest from "./apiRequest";

async function User() {
  try {
    // ✅ Tentar buscar dados via cookie HttpOnly
    const response = await apiRequest("/api/auth/me", "", "GET");    
    
    if (response.success && response.user) {
      // ✅ Buscar dados completos usando code_user do cookie
      const userData = await apiRequest("/api/directus/user", {
        code_user: response.user.user_code
      }, "POST");      
      
      // ✅ Retornar apenas os dados do usuário, não o objeto completo da resposta
      if (userData && userData.data) {
        return userData.data;
      }
      
      return null;
    }

    return null;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export default User;
