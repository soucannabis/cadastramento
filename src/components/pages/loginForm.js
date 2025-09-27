import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Logout from "../logout";
import LostPass from "./modals/lost-password";
import SecureAuthentication from "../../modules/SecureAuthentication";

function LoginForm() {
  const [emailInput, setEmailInput] = useState([]);
  const [passInput, setPassInput] = useState([]);
  const [loginSucess, setLoginSucess] = useState(false);
  const [loginErrorPass, setLoginErrorPass] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState(false);

  const userLogin = async (event) => {
    event.preventDefault();

    if (!passInput || !emailInput) {
      setLoginEmailError(true);
      return;
    }

    try {
      const result = await SecureAuthentication.login(emailInput, passInput);
      console.log(result)
      if (result.success) {
        setLoginSucess(true);
        // ✅ Não armazenar dados sensíveis no localStorage
        window.location.assign("/");
      } else {
        setLoginEmailError(true);
        setTimeout(() => {
          setLoginEmailError(false);
        }, 5000);
      }
    } catch (error) {
            setLoginEmailError(true);
            setTimeout(() => {
              setLoginEmailError(false);
            }, 5000);
    }
  };

  const emailHandleChange = (event) => {
    setEmailInput(event.target.value);
  };

  const passHandleChange = (event) => {
    setPassInput(event.target.value);
  };

  return (
    <div className="login-form-container">
      {loginSucess && <Navigate to="/" replace={true} />}
      
        <div className="login-form-content">
          <h1 className="sub-title">Preencha seus dados de acesso</h1>
          <h6 style={{ color: "#fff", marginBottom: "30px" }}>
            Insira e-mail e senha definidos durante o cadastro de associado.
          </h6>
          {loginEmailError && (
              <div style={{marginTop:3}} className="alert alert-danger" role="alert">
               E-mail ou senha inválidos
              </div>
            )}
            {loginErrorPass && (
              <div className="alert alert-danger" role="alert">
                Senha incorreta
              </div>
            )}   
          <form onSubmit={userLogin}>
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
                autoComplete="username"
              ></input>
            </div>
            <div className="form-group">
              <label className="label-login" htmlFor="password">
                Senha:
              </label>
              <input
                type="password"
                className="form-input input-login"
                onChange={passHandleChange}
                value={passInput}
                id="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
              ></input>
            </div>
            <LostPass />                   
            <button
              type="submit"
              onClick={userLogin}
              className="btn btn-success btn-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 16 16"
                fill="#ffffff"
              >
                <path
                  fill="#ffffff"
                  d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25v-1.5a.75.75 0 0 1 1.5 0v1.5A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2h1.5a.75.75 0 0 1 0 1.5h-1.5ZM8 2.75A.75.75 0 0 1 8.75 2h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V4.561l-3.22 3.22A.75.75 0 1 1 8.22 6.72l3.22-3.22H8.75A.75.75 0 0 1 8 2.75Z"
                />
              </svg>
              <span style={{ marginLeft: "10px"}}>Entrar</span>
            </button>
          </form>
          
        </div>
    </div>
  );
}

export default LoginForm;
