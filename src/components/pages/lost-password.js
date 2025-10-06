import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import apiRequest from "../../modules/apiRequest";
import CryptoJS from "crypto-js";

const LostPass = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [passError, setPassError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [formData, setFormData] = useState({
    passA: null,
    passB: null,
  });

  const [userId, setUserId] = useState(null);

  function decrypt(decrypt, secretKey) {
    const bytes = CryptoJS.AES.decrypt(decrypt, secretKey);
    decrypt = bytes.toString(CryptoJS.enc.Utf8);
    return decrypt;
  }

  // ✅ Remover chave de criptografia exposta - usar endpoint seguro do servidor
   const secretKey = import.meta.env.VITE_PASS_ENCRYPT;

  useEffect(() => {
    var url = window.location.href;
    var params = url.split("?");
    var date = params[1];
    const id = params[2];
    var timestamp = decrypt(date, secretKey);
    setUserId(decrypt(id, secretKey));
    var date = new Date().getTime();
    const validateTime = date - timestamp;
    if (validateTime > 600000) {
      setTimeError(true);
    }

    setTimeError(false);
  }, []);

  async function submit() {
    if (formData.passA != formData.passB) {
      setPassError(true);
    } else {

      await apiRequest(
        "/api/redefine-pass",
        { userId: userId, formData: { pass_account: formData.passA } },
        "POST"
      );
      window.location.assign("/login");
    }
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div
      className="container vertical-center"
      style={{
        width: "100%",
        background: "url('../images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="text-center"
        style={{ maxWidth: "500px", margin: "0 auto", padding: "50px" }}
      >
        <h1
          className="sub-title"
          style={{ color: "#fff", marginBottom: "15px" }}
        >
          Redefinir Senha
        </h1>
        <h6 style={{ color: "#fff", marginBottom: "30px" }}>
          Digite uma nova senha para sua conta abaixo:
        </h6>

        {passError && (
          <div className="alert alert-danger" role="alert">
            As senhas não correspondem
          </div>
        )}

        {timeError && (
          <div className="alert alert-danger" role="alert">
            Link inválido, tempo excedido. Tente recuperar sua senha novamente.
            <br></br>
            <a href={import.meta.env.VITE_URL}>Voltar</a>
          </div>
        )}

        {!timeError && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div
              className="form-group"
              style={{ textAlign: "left", marginBottom: "20px" }}
            >
              <label
                className="label-login"
                htmlFor="passA"
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Nova senha:
              </label>
              <input
                className="form-input input-login"
                name="passA"
                placeholder="Digite uma nova senha"
                onChange={handleChange}
                type="password"
                autoComplete="new-password"
                id="passA"
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "none",
                  borderRadius: "8px",
                  color: "#000",
                  fontSize: "16px",
                }}
              />
            </div>

            <div
              className="form-group"
              style={{ textAlign: "left", marginBottom: "20px" }}
            >
              <label
                className="label-login"
                htmlFor="passB"
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Repita a senha:
              </label>
              <input
                className="form-input input-login"
                name="passB"
                placeholder="Digite a senha novamente"
                onChange={handleChange}
                type="password"
                autoComplete="new-password"
                id="passB"
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "none",
                  borderRadius: "8px",
                  color: "#000",
                  fontSize: "16px",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg"
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "600",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 128 128"
              >
                <path
                  fill="#9E740B"
                  d="M107.77 15.16c-14.5-11.48-35.93-6.24-46.72 3.2c-12.08 10.56-12.42 27.25-6.13 40.88l-43.58 42.77c-1.77 1.74-3.59 14.19-3.5 16.64l5.9 4.12s9.99 2.99 14.34-.41s8.17-9.56 7.72-12.33c-.26-1.59.08-3.07 1.11-4.08c1.28-1.26 3.32-1.47 5.39-.78c1.59.53 3.36.08 4.55-1.09l.42-.41c1.69-1.58 1.88-3.42 1.55-4.96c-.51-2.39.36-4.37 1.7-6.12c1.16-1.52 3.36-2.16 5.28-2.19c3.46-.05 5.7-.79 8.15-3.19l6.38-6.24c14.36 6.4 31.97 3.51 43.4-8.68c14.66-15.64 10.91-43.77-5.96-57.13zm-8.64 33.35c-4 3.92-10.48 3.92-14.48 0s-4-10.29 0-14.21c4-3.92 10.48-3.92 14.48 0s4 10.29 0 14.21z"
                />
                <path
                  fill="#FFCA28"
                  d="M107.77 15.16c-14.88-14.88-39-14.88-53.88 0c-11.39 11.39-14.05 28.18-8.01 42.11L7.83 95.08a9.11 9.11 0 0 0-2.67 6.76l.44 11.75c2.17 1.22 2.24 5.07 2.24 5.07l9.9.76c2.53.08 4.98-.89 6.76-2.67l3.14-3.14c1.96-1.96 3.07-4.73 2.58-7.45c-.31-1.69.03-3.27 1.1-4.34c1.26-1.26 3.23-1.5 5.26-.87c1.69.53 3.53.19 4.79-1.06l.43-.43c1.71-1.63 1.9-3.52 1.57-5.1c-.51-2.46.37-4.49 1.71-6.29c1.17-1.57 3.4-2.22 5.33-2.25c3.49-.05 5.76-.81 8.23-3.28l5.98-5.95c14.13 6.65 31.49 4.14 43.17-7.54c14.86-14.89 14.86-39.01-.02-53.89zm-13.6 28.22c-4.04 4.04-10.59 4.04-14.62 0c-4.04-4.04-4.04-10.59 0-14.62c4.04-4.04 10.59-4.04 14.62 0c4.04 4.03 4.04 10.58 0 14.62z"
                />
                <path
                  fill="#DBA010"
                  d="M5.6 113.59s1.24.84 2.24 5.07l47.48-48.27c1.55-1.7-5.4-.82-7.48 1.25L5.6 113.59z"
                />
                <path
                  fill="#FFF59D"
                  d="M60.43 19.92c-3.9 2.12-8.3 7.8-9.51 16c-1.1 7.44-.63 12.61 1.87 16.96c2.83 4.91 6.68 2.31 5.13-2.47c-1.02-3.15-1.28-4.34-1.42-7.68c-.11-2.61.16-5.24.9-7.74c1.84-6.2 6.11-10.27 7.36-12.28c1.59-2.57-.92-4.66-4.33-2.79zm-27.38 59.8c-2.84 2.42.1-5.11 2.28-7.65C38.2 68.71 45 61.58 46.2 60.97c1.64-.83 1.54 3.75.87 4.59C44.69 68.5 35.9 77.3 33.05 79.72z"
                />
              </svg>
              <span style={{ marginLeft: "10px" }}>Redefinir senha</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LostPass;
