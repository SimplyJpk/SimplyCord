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
import ProtectedLayout from './components/layouts/redirects/ProtectedLayout';
import UnAuthLayout from './components/layouts/redirects/UnAuthLayout';
// Style
import { ThemeProvider } from './theme/ThemeContext';
import './index.css';
// Pages
import NotFoundPage from './pages/error/NotFoundPage';
import AvailableServers from './pages/discovery/ServerExplore';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<UnAuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<App />} />
                <Route path="explore" element={<AvailableServers />} />


                <Route path="servers/:serverId" element={<App />} />
                <Route path="servers/:serverId/channel/:channelId" element={<App />} />

                {/* <Route path="servers/:serverId" element={<ServerView />}>
                  <Route path="channels/:channelId" element={<ChannelView />} />
                </Route> */}
                {/* <Route path="settings" element={<SettingsView />} /> */}
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode >,
);