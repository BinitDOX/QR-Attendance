import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import HomePage from './pages/HomePage';
import StudentPage from './pages/StudentPage';
import ProfessorPage from './pages/ProfessorPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffdb1b',
    },
    secondary: {
      main: '#1f1f1f'
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/student' element={<StudentPage />} />
          <Route path='/professor' element={<ProfessorPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App;
