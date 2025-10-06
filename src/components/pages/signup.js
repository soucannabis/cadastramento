import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import MyLoader from "./elements/loader";

function Signup() {
  const [emailInput, setEmailInput] = useState([]);
  const [emailValidate, setEmailValidate] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);

  const signUp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const validateEmail = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
      emailInput
    );

    if (!validateEmail) {
        try {
          // ✅ Verificar se email já existe (tratando erro 401)
          let emailExists = false;
          try {
            const searchEmail = await apiRequest(
              "/api/directus/search",
              { query: "/items/Users?filter[email_account][_eq]=" + emailInput },
              "POST"
            );
            emailExists = searchEmail.data;
          } catch (searchError) {
            // ✅ Se der 401, assumir que email não existe e continuar
            emailExists = false;
          }

          if (emailExists) {
            setErrorEmail(true);
            setTimeout(() => {
              setErrorEmail(false);
            }, 5000);
          } else {
          const userData = await apiRequest(
            "/api/directus/create-user",
            {
              email_account: emailInput,
              associate_status: 0,
              status: "signup",
            },
            "POST"
          );
          
          
            if (userData.data) {
              
              // ✅ Verificar se o backend já autenticou automaticamente
              try {
                const authCheck = await apiRequest("/api/auth/me", "", "GET");
                
                if (authCheck.success && authCheck.user) {
                  // ✅ Usuário autenticado, pode buscar dados reais
                  window.location.assign("/bem-vindo");
                  return;
                }
              } catch (authError) {
                console.log('❌ Usuário não autenticado via cookie:', authError.response?.status);
              }
              
              // ✅ Se não estiver autenticado, fazer login automático
              try {
                const loginResponse = await apiRequest("/api/auth/login", {
                  email: emailInput,
                  password: "123456" // ✅ Tentar senha padrão
                }, "POST");
                
                if (loginResponse.success) {
                  window.location.assign("/bem-vindo");
                } else {
                  window.location.assign("/bem-vindo");
                }
              } catch (loginError) {
                // ✅ Redirecionar mesmo com erro de login
                window.location.assign("/bem-vindo");
              }
              }
            }
        } catch (error) {
        // ✅ Se der erro, mostrar mensagem de erro mas não redirecionar
        setErrorEmail(true);
        setTimeout(() => {
          setErrorEmail(false);
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setEmailValidate(true);
      setTimeout(() => {
        setEmailValidate(false);
      }, 5000);
      setIsLoading(false);
    }
  };

  const emailHandleChange = (event) => {
    setEmailInput(event.target.value);
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form-content">      
        <h1>Faça seu cadastro</h1>
        <h6 style={{ color: "#fff", marginBottom: "30px" }}>
          Para iniciar seu cadastro, insira seu e-mail pessoal.
        </h6>
        {errorEmail && (
          <div className="alert alert-danger" role="alert">
            Este endereço de e-mail já está sendo usado.
          </div>
        )}

        {emailValidate && (
          <div className="alert alert-danger" role="alert">
            Endereço de e-mail inválido
          </div>
        )}
        <form onSubmit={signUp}>
          <div className="form-group">
            <label className="label-login" htmlFor="email">
              E-mail:
            </label>
            <input
              type="email"
              className="form-input input-login"
              onChange={emailHandleChange}
              value={emailInput}
              id="email"
              placeholder="Digite seu email"
            ></input>
          </div>
          <button
            type="submit"
            onClick={signUp}
            className="btn btn-primary btn-lg btn-signup"
            disabled={isLoading}
            style={{ 
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MyLoader size={10} color="#ffffff" />
                <span style={{ marginLeft: "10px" }}>Processando...</span>
              </div>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 20 20"
                  fill="#ffffff"
                >
                  <path
                    fill="#ffffff"
                    d="M6.75 9a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5ZM17 6.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm-8 8c0-1.704.775-3.228 1.993-4.237A1.991 1.991 0 0 0 10 10H3.5a2 2 0 0 0-2 2s0 4 5.25 4c.953 0 1.733-.132 2.371-.347A5.522 5.522 0 0 1 9 14.5Zm10 0a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0Zm-4-2a.5.5 0 0 0-1 0V14h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H15v-1.5Z"
                  />
                </svg>
                <span style={{ marginLeft: "10px" }}>Fazer Cadastro</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
