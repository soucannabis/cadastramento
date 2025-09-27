import apiRequest from "./apiRequest";

// ✅ Módulo de logout seguro
class LogoutService {
  static async logout() {
    try {
      console.log('🔓 LogoutService: Iniciando processo de logout...');
      
      // ✅ Tentar fazer logout no backend
      try {
        await apiRequest('/api/auth/logout', {}, 'POST');
        console.log('✅ LogoutService: Logout realizado no backend');
      } catch (error) {
        console.log('⚠️ LogoutService: Erro no logout do backend:', error.response?.status);
        // Continuar mesmo com erro no backend
      }
      
      // ✅ Limpar todos os dados locais
      this.clearLocalData();
      
      console.log('✅ LogoutService: Logout concluído');
      return true;
      
    } catch (error) {
      console.error('❌ LogoutService: Erro no logout:', error);
      
      // ✅ Mesmo com erro, limpar dados locais
      this.clearLocalData();
      return false;
    }
  }
  
  static clearLocalData() {
    console.log('🗑️ LogoutService: Limpando dados locais...');
    
    // ✅ Limpar localStorage
    localStorage.removeItem("user_code");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user");
    
    // ✅ Limpar sessionStorage
    sessionStorage.clear();
    
    // ✅ Limpar cookies (se possível)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('✅ LogoutService: Dados locais limpos');
  }
  
  static async logoutAndRedirect(redirectPath = '/login') {
    await this.logout();
    window.location.assign(redirectPath);
  }
}

export default LogoutService;
