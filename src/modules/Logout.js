import apiRequest from "./apiRequest";

// ✅ Módulo de logout seguro
class LogoutService {
  static async logout() {
    try {
      // ✅ Tentar fazer logout no backend
      try {
        await apiRequest("/api/auth/logout", {}, "POST");
      } catch (error) {
        console.log(error)
      }

      // ✅ Limpar todos os dados locais
      this.clearLocalData();

      return true;
    } catch (error) {
      console.log(error);

      // ✅ Mesmo com erro, limpar dados locais
      this.clearLocalData();
      return false;
    }
  }

  static clearLocalData() {

    // ✅ Limpar localStorage
    localStorage.removeItem("user_code");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // ✅ Limpar sessionStorage
    sessionStorage.clear();

    // ✅ Limpar cookies (se possível)
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  static async logoutAndRedirect(redirectPath = "/login") {
    await this.logout();
    window.location.assign(redirectPath);
  }
}

export default LogoutService;
