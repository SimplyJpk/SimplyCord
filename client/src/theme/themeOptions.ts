import { ThemeOptions } from '@mui/material/styles';

interface CustomThemeOptions extends ThemeOptions {
  palette: {
    mode: 'light' | 'dark';
    background: {
      default: string;
      paper: string;
    };
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
  };
  typography: {
    fontFamily: string;
  };
}

export default CustomThemeOptions;