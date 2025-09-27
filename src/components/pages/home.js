import React, { useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

function Home() {
  const { user, loading } = useUser();

  // ✅ Debug: Verificar dados do usuário
  useEffect(() => {
    console.log('🔍 Home: Dados do usuário:', user);
    console.log('🔍 Home: Associate Status:', user?.associate_status);
    console.log('🔍 Home: Responsable Type:', user?.responsable_type);
  }, [user]);

  // ✅ Lógica de redirecionamento baseada no status do usuário
  useEffect(() => {
    if (!user || loading) {
      console.log('⏳ Home: Aguardando dados do usuário...');
      return;
    }

    const status = user.associate_status;
    console.log('🔄 Home: Verificando redirecionamento para status:', status);

    switch (status) {
      case 0:
        console.log('🔄 Home: Redirecionando para /bem-vindo');
        window.location.assign("/bem-vindo");
        break;
      
      case 1:
      case 2:
        console.log('🔄 Home: Redirecionando para /cadastro-associado');
        window.location.assign("/cadastro-associado");
        break;
      
      case 3:
        if (user.responsable_type === "another" && user.responsible_for === null) {
          console.log('🔄 Home: Redirecionando para /cadastro-paciente (responsável por outro)');
          window.location.assign("/cadastro-paciente");
        } else {
          console.log('🔄 Home: Redirecionando para /documentos');
          window.location.assign("/documentos");
        }
        break;
      
      case 4:
        console.log('🔄 Home: Redirecionando para /consulta');
        window.location.assign("/consulta");
        break;
      
      case 5:
        console.log('🔄 Home: Redirecionando para /cadastro-concluido');
        window.location.assign("/cadastro-concluido");
        break;
      
      default:
        if (status >= 6) {
          console.log('🔄 Home: Redirecionando para /cadastro-concluido (status >= 6)');
          window.location.assign("/cadastro-concluido");
        } else {
          console.log('⚠️ Home: Status desconhecido:', status);
        }
        break;
    }
  }, [user, loading]);

  // ✅ Mostrar loading enquanto dados estão sendo carregados
  if (loading) {
    return (
      <div className="container vertical-center">
        <img src="logo.svg" width="5%" className="logo-load" />
        <p className="loading-text">carregando...</p>
      </div>
    );
  }

  // ✅ Se não há usuário, mostrar mensagem
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
