import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Logout from "../logout";
import LostPass from "./modals/lost-password";
import apiRequest from "../../modules/apiRequest";
import CryptoJS from 'crypto-js';

function decrypt(decrypt, secretKey) {
  const bytes = CryptoJS.AES.decrypt(decrypt, secretKey);
  decrypt = bytes.toString(CryptoJS.enc.Utf8);
  return decrypt;
}

function LoginForm() {
  const [emailInput, setEmailInput] = useState([]);
  const [passInput, setPassInput] = useState([]);
  const [loginSucess, setLoginSucess] = useState(false);
  const [loginErrorPass, setLoginErrorPass] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState(false);
  const [logged, setLogged] = useState(false);

  var verLogin = localStorage.getItem("user_code");

  useEffect(() => {
    if (verLogin) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);

  const userLogin = async event => {
    event.preventDefault();

    if (passInput == []) {
      setLoginEmailError(true);
    } else {
      await apiRequest("/api/directus/login", { email: emailInput, pass: passInput }, "POST")
        .then(async response => {        
         if(response.pass_account){
          var userPass = decrypt(response.pass_account, import.meta.env.VITE_PASS_ENCRYPT);
         }else{
          setLoginEmailError(true);
          setTimeout(() => {
            setLoginEmailError(false);
          }, 5000);
          setLogged(false);
          setTimeout(() => {
            setLoginEmailError(false);
          }, 5000);
  
          userPass = ""
         }
          
        if (!response) {
          setLoginEmailError(true);
          setTimeout(() => {
            setLoginEmailError(false);
          }, 5000);
          setLogged(false);
          setTimeout(() => {
            setLoginEmailError(false);
          }, 5000);
        } else {
          if (userPass == passInput) {
            localStorage.setItem("user_code", await response.user_code);
            setLogged(true);
            setLoginSucess(true);
            window.location.assign("/")
          } else {
            setLoginEmailError(true);
            setTimeout(() => {
              setLoginEmailError(false);
            }, 5000);

          }
        }
      });
    }
  };

  const emailHandleChange = event => {
    setEmailInput(event.target.value);
  };

  const passHandleChange = event => {
    setPassInput(event.target.value);
  };

  return (
    <div class="login-form-container">
      {loginSucess && <Navigate to="/" replace={true} />}
      {!logged && (
        <div class="login-form-content">
          {loginEmailError && (
            <div class="alert alert-danger" role="alert">
              E-mail ou senha inválidos
            </div>
          )}
          {loginErrorPass && (
            <div class="alert alert-danger" role="alert">
              Senha incorreta
            </div>
          )}
          <h1 class="sub-title">Preencha seus dados de acesso</h1>
          <form onSubmit={userLogin}>
            <div class="form-group">
              <label class="label-login" for="email">
                E-mail:
              </label>
              <input type="email" class="form-input input-login" onChange={emailHandleChange} value={emailInput} id="email" placeholder="Digite seu email"></input>
            </div>
            <div class="form-group">
              <label class="label-login" for="password">
                Senha:
              </label>
              <input type="password" class="form-input input-login" onChange={passHandleChange} value={passInput} id="password" placeholder="Digite sua senha"></input>
            </div>
            <LostPass />
            <button type="submit" onClick={userLogin} class="btn btn-success btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16" fill="#ffffff"><path fill="#ffffff" d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25v-1.5a.75.75 0 0 1 1.5 0v1.5A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2h1.5a.75.75 0 0 1 0 1.5h-1.5ZM8 2.75A.75.75 0 0 1 8.75 2h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V4.561l-3.22 3.22A.75.75 0 1 1 8.22 6.72l3.22-3.22H8.75A.75.75 0 0 1 8 2.75Z"/></svg>
               <span style={{marginLeft: "10px"}}>Entrar</span>
            </button>
          </form>
        </div>
      )}

      {logged && <Logout />}
    </div>
  );
}

export default LoginForm;
