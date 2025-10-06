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
      const response = await apiRequest('/api/auth/me', '', 'GET');
      return response.user;
    } catch (error) {
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
