import React from 'react';
import { Outlet } from 'react-router-dom';
// MUI Components
import Box from '@mui/material/Box';


const MainLayout: React.FC = () => {
  return (
    <Box>
      <nav>
      </nav>
      <main>
        <Outlet />
      </main>
    </Box>
  );
};

export default MainLayout;