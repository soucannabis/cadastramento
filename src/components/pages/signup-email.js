import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import User from "../../modules/User";
import MyLoader from "./elements/loader";

function SignupEmail() {
  const [emailInput, setEmailInput] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();

    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (user.responsable_type == "another" && user.resposible_for == null) {
    window.location.assign("/cadastro-paciente");
  }

  if (user.associate_status == 0) {
    window.location.assign("/bem-vindo");
  }
  if (user.associate_status == 1) {
    window.location.assign("/cadastro-associado");
  }

  if (user.associate_status == 2) {
    window.location.assign("/cadastro-associado");
  }

  if (user.associate_status == 3 && user.responsable_type == "another" && user.resposible_for == null) {
    window.location.assign("/cadastro-paciente");
  } else if (user.associate_status == 3) {
    window.location.assign("/documentos");
  }

  if (user.associate_status == 4) {
    window.location.assign("/consulta");
  }
  if (user.associate_status == 5) {
    window.location.assign("/cadastro");
  }
  if (user.associate_status >= 6) {
    window.location.assign("/cadastro");
  }

  const signUp = async event => {
    event.preventDefault();
    setIsLoading(true);
    
    const validateEmail = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailInput);

    if (!validateEmail) {
      try {
        const serchEmail = await apiRequest("/api/directus/search", { query: "/items/Users?filter[email_account][_eq]=" + emailInput }, "POST");

        if (serchEmail) {
          setErrorEmail(true);
        } else {
          const userData = await apiRequest("/api/directus/create-user", { email_account: emailInput, associate_status: 0 }, "POST");
          // ✅ Não armazenar dados sensíveis no localStorage - usar autenticação segura
          // localStorage.setItem("user_code", await userData.user_code);
          if (userData) {
            window.location.assign("/bem-vindo");
          }
        }
      } catch (error) {
        console.log("Erro no cadastro:", error);
        setErrorEmail(true);
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

  const emailHandleChange = event => {
    setEmailInput(event.target.value);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <img className="logo" src={import.meta.env.VITE_ASSOCIATION_LOGO}></img>
      </div>
      <h1 className="title" style={{ marginTop: "30px" }}>
        Cadastro de associado
      </h1>
      <div className="row justify-content-center">
        <div className="col-md-6 form-signup">
          {errorEmail && (
            <div className="alert alert-danger" role="alert">
              Este endereço de e-mail já está sendo usado. Se você ja se preencheu seus dados, por favor, <a href="/login">FAÇA LOGIN AQUI</a>
            </div>
          )}
          {emailValidate && (
            <div className="alert alert-danger" role="alert">
              Endereço de e-mail inválido
            </div>
          )}

          <h1 className="sub-title">Preencha seu e-mail abaixo para iniciar seu cadastro de associado.</h1>
          <form onSubmit={signUp}>
            <div className="form-group">
              <input type="email" className="form-input input-login"  onChange={emailHandleChange} value={emailInput} id="email" placeholder="Digite seu email"></input>
            </div>
            <br />
            <a href="/login" style={{color:"white", fontSize:"17px"}} className="btn">
              Fazer login
            </a>
            <button 
              type="submit" 
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
                "Iniciar cadastro"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupEmail;
