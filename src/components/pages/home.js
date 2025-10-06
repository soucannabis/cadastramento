import React, { useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

function Home() {
  const { user, loading } = useUser();

  // ✅ Lógica de redirecionamento baseada no status do usuário
  useEffect(() => {
    if (!user || loading) {
      return;
    }

    const status = user.associate_status;

    switch (status) {
      case 0:
        window.location.assign("/bem-vindo");
        break;
      
      case 1:
      case 2:
        window.location.assign("/cadastro-associado");
        break;
      
      case 3:
        if (user.responsable_type === "another" && user.responsible_for === null) {
          window.location.assign("/cadastro-paciente");
        } else {
          window.location.assign("/documentos");
        }
        break;
      
      case 4:
        window.location.assign("/consulta");
        break;
      
      case 5:
        window.location.assign("/cadastro-concluido");
        break;
      
      default:
        if (status >= 6) {
          window.location.assign("/cadastro-concluido");
        } else {
        }
        break;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="container vertical-center">
        <img src="logo.svg" width="5%" className="logo-load" />
        <p className="loading-text">carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container vertical-center">
        <p>Usuário não encontrado. Redirecionando...</p>
      </div>
    );
  }

  return <></>;
}

export default Home;
