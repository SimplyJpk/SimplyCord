import { createTheme } from '@mui/material/styles';
import CustomThemeOptions from './themeOptions';

const lightThemeOptions: CustomThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
};

const darkThemeOptions: CustomThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    primary: {
      main: '#bb86fc',
    },
    secondary: {
      main: '#03dac6',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
};

const lightTheme = createTheme(lightThemeOptions);
const darkTheme = createTheme(darkThemeOptions);

export { lightTheme, darkTheme };