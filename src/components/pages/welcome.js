import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import React, { useState, useEffect } from "react";

function Welcome() {
  return (
    <div className="homepage">
      <div>
        <h1 className="title">
          {" "}
          Olá, é um prazer receber você <br></br>{" "}
          {import.meta.env.VITE_WELCOME_TEXT}
        </h1>
        <br></br>
        <h2 style={{ textAlign: "center" }}>
          Siga todos os passos deste guia para se associar e contar com os
          benefícios da associação.
        </h2>
        <h2 style={{ textAlign: "center" }}>
          Você precisará informar seus dados pessoais, foto de documentos de
          identidade e comprovante de residência.
        </h2>
        <h2 style={{ textAlign: "center" }}>
          Se você tiver dúvidas e precisar de ajuda, clique no botão  <b style={{ color: "orange" }}>"Solicitar Contato"</b> no menu.
         
        </h2>
        <div className="d-flex justify-content-center align-items-center">
          <Link
            to="/cadastro-associado"
            className="btn btn-lg btn-primary btn-login"
            style={{
              fontSize: "20px",
              padding: "15px 30px",
              borderRadius: "10px",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              minWidth: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person-plus-fill"
              viewBox="0 0 16 16"
            >
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
            Iniciar Cadastro
          </Link>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
