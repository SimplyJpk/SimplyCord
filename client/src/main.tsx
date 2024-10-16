// client/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import App from './App';
import MainLayout from './components/layouts/MainLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// Redirects
import ProtectedRoute from './components/layouts/redirects/ProtectedRoute';
import LoginRoute from './components/layouts/redirects/LoginRoute';
// Style
import { ThemeProvider } from './theme/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <App />
                  </ProtectedRoute>
                }
              />
              <Route
                path="login"
                element={
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                }
              />
              <Route
                path="register"
                element={
                  <LoginRoute>
                    <Register />
                  </LoginRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode >,
);