import axios from "axios";

async function apiRequest(query, body, method, headers) {
  var requestData = [];

  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_SERVER_URL + query,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    withCredentials: true, // ✅ Inclui cookies HttpOnly automaticamente
  };

  if (headers) {
    config.headers = { ...config.headers, ...headers };
  }

  try {
    console.log(
      `🚀 API Request: ${method} ${import.meta.env.VITE_SERVER_URL + query}`
    );
    console.log("📦 Config:", config);
    
    // ✅ Log detalhado sobre cookies e CORS
    console.log("🍪 withCredentials:", config.withCredentials);
    console.log("🌐 Origin:", window.location.origin);
    console.log("🎯 Target URL:", config.url);
    console.log("📋 Headers enviados:", config.headers);

    const response = await axios.request(config);
    requestData = response.data;

    // ✅ Log detalhado da resposta
    console.log(
      `✅ API Response: ${method} ${query} - Status: ${response.status}`,
      requestData
    );
    
    // ✅ Log sobre cookies na resposta
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      console.log("🍪 Cookies recebidos do servidor:", setCookieHeader);
    } else {
      console.log("❌ Nenhum cookie recebido do servidor");
    }
    
    // ✅ Log sobre headers de CORS
    console.log("🌐 CORS Headers:", {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    });

    return requestData;
  } catch (error) {
    console.error(`❌ API Error: ${method} ${query}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    
    // ✅ Log detalhado sobre erro de CORS
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error("🚫 Erro de CORS detectado:", {
        message: error.message,
        code: error.code,
        config: error.config
      });
    }

    // ✅ Tratar erro 401 (não autorizado) - evitar redirecionamentos desnecessários
    if (error.response?.status === 401) {
      console.log("🔒 Erro 401 - Usuário não autenticado");
      console.log("🍪 Verificando se cookies estão sendo enviados...");
      
      // ✅ Verificar se cookies estão sendo enviados
      const cookies = document.cookie;
      console.log("🍪 Cookies disponíveis no navegador:", cookies);
      
      // Só redirecionar se não estiver em páginas públicas
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/cadastro") &&
        !window.location.pathname.includes("/bem-vindo")
      ) {
        console.log("🔄 Redirecionando para login...");
        window.location.href = "/login";
      } else {
        console.log("📍 Página pública, não redirecionando");
      }
    }

    throw error;
  }
}

export default apiRequest;
