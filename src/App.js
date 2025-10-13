import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoginForm from "./components/pages/loginForm";
import SignupFinish from "./components/pages/signupFinish";
import Menu from "./components/pages/elements/menu";
import MenuMobile from "./components/pages/elements/menu-mobile";
import AssociateSignup from "./components/pages/associate-signup";
import PatientSignup from "./components/pages/patient-signup";
import Sidebar from "./components/pages/elements/sidebar";
import TopBarMobile from "./components/pages/elements/topBarMobile";
import Signup from "./components/pages/signup";
import UploadComponent from "./components/pages/documents-upload";
import Home from "./components/pages/home";
import MedicalAppointment from "./components/pages/medical-appointment";
import Welcome from "./components/pages/welcome";
import LostPass from "./components/pages/lost-password";
import { UserProvider, useUser } from "./contexts/UserContext";
import "./styles/general.css";



// Componente de redirecionamento
function RedirectToCadastro() {
  useEffect(() => {
    const inLogged = localStorage.getItem("isLoggedIn");
    console.log(inLogged);
    if (inLogged) {
      window.location.href = "/";
    } else {
      window.location.href = "/cadastro";
    }
  }, []);

  return null;
}

// Componente para redirecionamento automático
function ProtectedRoute({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Se não estiver logado e tentar acessar /bem-vindo, redirecionar para /login
    if (!user && location.pathname === "/bem-vindo") {
      navigate("/login", { replace: true });
      return;
    }

    // Se não estiver logado e não estiver em uma rota pública, redireciona para /login
    if (
      !user &&
      ![
        "/cadastro",
        "/login",
        "/iniciar-cadastro",
        "/nova-senha",
        "/loja",
        "/seu-cadastro",
      ].includes(location.pathname)
    ) {
      navigate("/login", { replace: true });
    }
    if (user && ["/cadastro", "/login"].includes(location.pathname)) {
      navigate("/bem-vindo", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return children;
}

// Componente interno que usa o contexto
function AppContent() {
  const { user, loading } = useUser();
  const [userCode, setUserCode] = useState(false);
  const [hiddenButtons, setHiddenButtons] = useState(true);
  const [hiddenLogin, setHiddenLogin] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (
      currentPath === "/cadastro-associado" ||
      currentPath === "/cadastro-paciente"
    ) {
      setHiddenButtons(false);
    } else if (currentPath === "/login" || currentPath === "/cadastro") {
      setHiddenButtons(false);
    } else {
      // ✅ Para outras páginas, verificar se usuário está autenticado
      if (user && user.user_code) {
        setUserCode(user.user_code);
        setHiddenButtons(false);
      } else {
        setHiddenButtons(false);
      }
    }

    const url = window.location.href;
    var page = url.split("/");
    page = page[3].split("?");
    page = page[0];

    if (page == "nova-senha" || page == "iniciar-cadastro") {
      setHiddenLogin(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container vertical-center">
        <img src="logo.svg" width="5%" className="logo-load" />
        <p className="loading-text">carregando...</p>
      </div>
    );
  }

  // ✅ Determinar se deve mostrar layout completo baseado no usuário ou página pública
  const shouldShowFullLayout =
    user ||
    window.location.pathname === "/cadastro-associado" ||
    window.location.pathname === "/cadastro-paciente";

  return (
    <Router>
      <ProtectedRoute user={user}>
        {hiddenLogin && (
          <div>
            <Routes>
              <Route
                path="/iniciar-cadastro"
                element={<RedirectToCadastro />}
              />
              <Route path="/nova-senha" element={<LostPass />} />
            </Routes>
          </div>
        )}
        {!shouldShowFullLayout && (
          <div>
            {window.innerWidth > 600 && (
              <div className="container vertical-center" hidden={hiddenLogin}>
                <div className="text-center login-div">
                  <img
                    src={import.meta.env.VITE_ASSOCIATION_LOGO}
                    style={{
                      width: import.meta.env.VITE_ASSOCIATION_LOGO_SIZE,
                      height: import.meta.env.VITE_ASSOCIATION_LOGO_SIZE,
                    }}
                  />
                  <br></br>
                  <div className="row">
                    <Link
                      to="/cadastro"
                      className="btn btn-lg btn-success"
                      hidden={hiddenButtons}
                    >
                      Se cadastrar como <strong>Associado</strong>
                    </Link>
                    <Link
                      to="/login"
                      className="btn btn-lg btn-primary btn-login"
                      hidden={hiddenButtons}
                    >
                      Login
                    </Link>
                  </div>
                </div>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/cadastro" element={<Signup />} />
                  <Route path="/bem-vindo" element={<Welcome />} />
                </Routes>
              </div>
            )}

            {window.innerWidth < 600 && (
              <div className="container mobile-login" hidden={hiddenLogin}>
                <div className="text-center">
                  <img
                    src="/logoSou.png"
                    style={{ width: "250px", height: "250px" }}
                  />
                  <div className="row">
                    <Link
                      to="/cadastro"
                      className="btn btn-lg btn-success"
                      hidden={hiddenButtons}
                    >
                      Se cadastrar como <strong>Associado</strong>
                    </Link>
                    <Link
                      to="/login"
                      className="btn btn-lg btn-primary btn-login"
                      hidden={hiddenButtons}
                    >
                      Login
                    </Link>
                  </div>
                </div>
                <div className="mobile-forms">
                  <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/cadastro" element={<Signup />} />
                    <Route path="/bem-vindo" element={<Welcome />} />
                  </Routes>
                </div>
              </div>
            )}
          </div>
        )}

        {shouldShowFullLayout && (
          <div>
            {window.innerWidth > 600 && (
              <div className="wrapper">
                <span>
                  <Menu />
                </span>
                <div className="sidebar">
                  <Sidebar />
                </div>
                <div className="content">
                  <Routes>
                    <Route path="/" element={<Home />} />,
                    <Route path="/bem-vindo" element={<Welcome />} />
                    <Route
                      path="/cadastro-associado"
                      element={<AssociateSignup />}
                    />
                    <Route
                      path="/cadastro-paciente"
                      element={<PatientSignup />}
                    />
                    <Route path="/documentos" element={<UploadComponent />} />
                    <Route path="/consulta" element={<MedicalAppointment />} />
                    <Route
                      path="/cadastro-concluido"
                      element={<SignupFinish />}
                    />
                  </Routes>
                </div>
              </div>
            )}

            {window.innerWidth < 600 && (
              <div className="wrapper">
                <MenuMobile />
                <TopBarMobile />
                <div className="">
                  <Routes>
                    <Route path="/" element={<Home />} />,
                    <Route path="/bem-vindo" element={<Welcome />} />
                    <Route
                      path="/cadastro-associado"
                      element={<AssociateSignup />}
                    />
                    <Route
                      path="/cadastro-paciente"
                      element={<PatientSignup />}
                    />
                    <Route path="/documentos" element={<UploadComponent />} />
                    <Route path="/consulta" element={<MedicalAppointment />} />
                    <Route
                      path="/cadastro-concluido"
                      element={<SignupFinish />}
                    />
                  </Routes>
                </div>
              </div>
            )}
          </div>
        )}
        <Routes>
          {!shouldShowFullLayout && (
            <Route path="/" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </ProtectedRoute>
    </Router>
  );
}

// Função App principal que envolve tudo com UserProvider
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
