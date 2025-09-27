import apiRequest from "./apiRequest";

// ✅ Sistema de autenticação seguro com cookies HttpOnly
class SecureAuthentication {
  static async login(email, password) {
    try {
      const response = await apiRequest('/api/auth/login', {
        email: email,
        password: password
      }, 'POST');
      
      if (response.success) {
        // ✅ Cookie HttpOnly é definido automaticamente pelo servidor
        // ✅ Dados do usuário retornados sem informações sensíveis
        return {
          success: true,
          user: response.user
        };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      console.log('🔍 SecureAuthentication: Tentando obter usuário atual...');
      const response = await apiRequest('/api/auth/me', '', 'GET');
      console.log('✅ SecureAuthentication: Resposta recebida:', response);
      return response.user;
    } catch (error) {
      console.log('❌ SecureAuthentication: Erro ao obter usuário:', error.response?.status, error.message);
      // ✅ Não logar erro 401 como erro, é comportamento esperado quando não autenticado
      if (error.response?.status !== 401) {
        console.error('Erro ao obter usuário atual:', error);
      }
      return null;
    }
  }

  static async logout() {
    try {
      await apiRequest('/api/auth/logout', {}, 'POST');
      // ✅ Cookie é limpo automaticamente pelo servidor
      return true;
    } catch (error) {
      console.error('Erro no logout:', error);
      return false;
    }
  }

  static async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      // ✅ Se o backend não estiver implementado, retornar false sem erro
      return false;
    }
  }
}

export default SecureAuthentication;
