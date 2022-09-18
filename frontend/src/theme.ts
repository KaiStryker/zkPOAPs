import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E6B19',
    },
    secondary: {
      main: '#2E6B19',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;