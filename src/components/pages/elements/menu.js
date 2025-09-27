import React from "react";
import { useUser } from '../../../contexts/UserContext';
import Contact from './contact'

const MenuTopo = () => {
  const { user, logout } = useUser();

  const logoutHandleChange = () => {
    logout();
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <img style={{width:"120px"}} src={import.meta.env.VITE_ASSOCIATION_LOGO_MENU}></img>
      <span className="name-logo">{import.meta.env.VITE_ASSOCIATION_NAME_LOGO_SHOW ? import.meta.env.VITE_ASSOCIATION_NAME : ''}</span>
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {user && (
                <span style={{marginRight: '10px'}} className="nav-link" href="#">
                  {user.email_account || user.email || 'Email não encontrado'}
                </span>
              )}
              {/* ✅ Debug: Mostrar dados do usuário */}
              {console.log('🔍 Menu Render - user:', user)}
              {console.log('🔍 Menu Render - user.email_account:', user?.email_account)}
            </li>
       
            <li className="nav-item">
              <button 
                onClick={logoutHandleChange}
                className="btn btn-link p-0"
                style={{ border: 'none', background: 'none' }}
                title="Sair"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ color: 'white', marginRight: '10px' }}  
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default MenuTopo;
