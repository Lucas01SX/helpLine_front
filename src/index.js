import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Importando o AuthProvider
import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';


// Layout Wrapper para páginas com Header
const Layout = ({ children }) => (
  <>
    <Header />
    <div style={{ marginTop: '50px' }}>{children}</div> {/* Espaço abaixo do Header */}
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>  {/* Envolvendo com o AuthProvider */}
      <Router basename="/suporte">
        <Routes>
          {/* Página de Login sem Header */}
          <Route path="/" element={<Login />} />

          {/* Páginas com Header */}
          <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* Rota para redirecionar para "/" em caso de erro 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
