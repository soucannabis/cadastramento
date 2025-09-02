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
import SignupEmail from "./components/pages/signup-email";
import UploadComponent from "./components/pages/documents-upload";
import Home from "./components/pages/home";
import MedicalAppointment from "./components/pages/medical-appointment";
import Welcome from "./components/pages/welcome";
import LostPass from "./components/pages/lost-password";
import User from "./modules/User";
import "./styles/general.css";

// Componente para redirecionamento automático
function ProtectedRoute({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Se não estiver logado e não estiver em uma rota pública, redireciona para /cadastro
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
      navigate("/cadastro", { replace: true });
    }
    if (user && ["/cadastro"].includes(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return children;
}

function App() {
  const [user, setUser] = useState(false);
  const [userCode, setUserCode] = useState(false);
  const [hiddenButtons, setHiddenButtons] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hiddenLogin, setHiddenLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();

    if (localStorage.getItem("user_code")) {
      setUserCode(localStorage.getItem("user_code"));
    } else {
      setHiddenButtons(false);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const url = window.location.href;
    var page = url.split("/");
    page = page[3].split("?");
    page = page[0];

    if (page == "nova-senha" || page == "iniciar-cadastro") {
      setHiddenLogin(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="container vertical-center">
        <img src="logo.svg" width="5%" className="logo-load" />
        <p className="loading-text">carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <ProtectedRoute user={user}>
        {hiddenLogin && (
          <div>
            <Routes>
              <Route path="/iniciar-cadastro" element={<SignupEmail />} />
            </Routes>
            <div className="containe-login cal-center container">
              <div className="text-center login-div">
                <Routes>
                  <Route path="/nova-senha" element={<LostPass />} />
                </Routes>
              </div>
            </div>
          </div>
        )}
        {!user && (
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
                  </Routes>
                </div>
              </div>
            )}
          </div>
        )}

        {user && (
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
          {!user && (
            <Route path="/" element={<Navigate to="/cadastro" replace />} />
          )}
        </Routes>
      </ProtectedRoute>
    </Router>
  );
}

export default App;
