// ✅ Sistema de logs para frontend
class FrontendLogger {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.actions = [];
    this.startTime = new Date().toISOString();
  }

  // ✅ Gerar ID de sessão único
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ✅ Detectar informações do dispositivo
  detectDeviceInfo() {
    const userAgent = navigator.userAgent;
    
    // ✅ Detectar navegador
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // ✅ Detectar dispositivo
    let device = 'Desktop';
    if (userAgent.includes('Mobile')) device = 'Mobile';
    else if (userAgent.includes('Tablet')) device = 'Tablet';
    else if (userAgent.includes('iPhone')) device = 'iPhone';
    else if (userAgent.includes('iPad')) device = 'iPad';
    else if (userAgent.includes('Android')) device = 'Android';

    // ✅ Detectar sistema operacional
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    else if (userAgent.includes('Android')) os = 'Android';

    // ✅ Detectar resolução da tela
    const screen = {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    };

    // ✅ Detectar viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    return {
      browser,
      device,
      os,
      userAgent,
      screen,
      viewport,
      timestamp: new Date().toISOString()
    };
  }

  // ✅ Log de ação do usuário
  logAction(action, data = {}) {
    const deviceInfo = this.detectDeviceInfo();
    const actionLog = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      action,
      data,
      deviceInfo: {
        browser: deviceInfo.browser,
        device: deviceInfo.device,
        os: deviceInfo.os,
        screen: deviceInfo.screen,
        viewport: deviceInfo.viewport
      }
    };

    this.actions.push(actionLog);
    console.log(`📝 [FRONTEND-LOG] ${action}:`, actionLog);
  }

  // ✅ Log de página acessada
  logPageAccess(page, data = {}) {
    this.logAction('PAGE_ACCESS', {
      page,
      url: window.location.href,
      referrer: document.referrer,
      ...data
    });
  }

  // ✅ Log de formulário preenchido
  logFormSubmission(formName, formData = {}) {
    this.logAction('FORM_SUBMISSION', {
      formName,
      formData: this.sanitizeFormData(formData),
      fieldsCount: Object.keys(formData).length
    });
  }

  // ✅ Log de campo preenchido
  logFieldInput(fieldName, value, formName = '') {
    this.logAction('FIELD_INPUT', {
      fieldName,
      value: this.sanitizeValue(value),
      formName
    });
  }

  // ✅ Log de erro
  logError(error, context = {}) {
    this.logAction('ERROR', {
      error: error.message || error,
      stack: error.stack,
      context
    });
  }

  // ✅ Log de sucesso
  logSuccess(successType, data = {}) {
    this.logAction('SUCCESS', {
      successType,
      data
    });
  }

  // ✅ Log de navegação
  logNavigation(from, to, method = 'click') {
    this.logAction('NAVIGATION', {
      from,
      to,
      method
    });
  }

  // ✅ Log de tempo gasto em página
  logTimeOnPage(page, timeSpent) {
    this.logAction('TIME_ON_PAGE', {
      page,
      timeSpent,
      timeSpentFormatted: this.formatTime(timeSpent)
    });
  }

  // ✅ Sanitizar dados do formulário
  sanitizeFormData(formData) {
    const sanitized = { ...formData };
    if (sanitized.password) sanitized.password = '[REDACTED]';
    if (sanitized.pass_account) sanitized.pass_account = '[REDACTED]';
    if (sanitized.confirmPassword) sanitized.confirmPassword = '[REDACTED]';
    return sanitized;
  }

  // ✅ Sanitizar valor individual
  sanitizeValue(value) {
    if (typeof value === 'string' && (value.includes('password') || value.includes('senha'))) {
      return '[REDACTED]';
    }
    return value;
  }

  // ✅ Formatar tempo
  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // ✅ Obter todos os logs
  getAllLogs() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: new Date().toISOString(),
      actions: this.actions,
      totalActions: this.actions.length
    };
  }

  // ✅ Enviar logs para o backend
  async sendLogsToBackend(email) {
    try {
      const logs = this.getAllLogs();
      const response = await fetch('/api/logs/user-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          logs
        })
      });
      
      if (response.ok) {
        console.log('📤 [FRONTEND-LOG] Logs enviados com sucesso para o backend');
      } else {
        console.error('❌ [FRONTEND-LOG] Erro ao enviar logs para o backend');
      }
    } catch (error) {
      console.error('❌ [FRONTEND-LOG] Erro ao enviar logs:', error);
    }
  }
}

// ✅ Instância global do logger
const frontendLogger = new FrontendLogger();

export default frontendLogger;
