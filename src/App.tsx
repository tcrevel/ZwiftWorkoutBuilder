import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WorkoutBuilder from './components/WorkoutBuilder';
import NavigationBar from './components/NavigationBar';
import Features from './components/Features';
import ChangeLog from './components/ChangeLog';
import { Workout } from './types/workout';
import { loadCurrentWorkout, saveCurrentWorkout } from './utils/workoutStorage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B00', // Zwift orange
    },
  },
});

function App() {
  const [workout, setWorkout] = useState<Workout>(() => {
    return loadCurrentWorkout() || {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      segments: [],
    };
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    saveCurrentWorkout(workout);
  }, [workout]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        <NavigationBar />
        <Box component="main" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Box id="builder">
            <Container 
              maxWidth="xl" 
              disableGutters 
              sx={{ 
                py: { xs: 2, sm: 4 },
                px: { xs: 0.5, sm: 2 },
                overflow: 'hidden'
              }}
            >
              <WorkoutBuilder workout={workout} onWorkoutChange={setWorkout} />
            </Container>
          </Box>
          <Box sx={{ bgcolor: 'grey.50', overflow: 'hidden' }}>
            <Container maxWidth="lg" disableGutters sx={{ overflow: 'hidden' }}>
              <Features />
            </Container>
          </Box>
          <Container maxWidth="lg" disableGutters sx={{ overflow: 'hidden' }}>
            <ChangeLog />
          </Container>
        </Box>

        <Zoom in={showScrollTop}>
          <Box
            role="presentation"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1,
            }}
          >
            <Fab
              color="primary"
              size="small"
              aria-label="scroll back to top"
              onClick={handleScrollTop}
              sx={{
                backgroundColor: '#ff4d00',
                '&:hover': {
                  backgroundColor: '#ff6a00',
                },
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Box>
        </Zoom>
      </Box>
    </ThemeProvider>
  );
}

export default App;
