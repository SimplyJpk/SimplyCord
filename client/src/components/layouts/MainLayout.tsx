import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div>
      <nav>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;