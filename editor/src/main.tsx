import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    secondary: {
      light: '#8561c5',
      main: '#673ab7',
      dark: '#482880',
      contrastText: '#fff',
    },
    primary: {
      light: '#ffcf33',
      main: '#ffc400',
      dark: '#b28900',
      contrastText: '#000',
    },
    mode: 'dark'
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    

)
