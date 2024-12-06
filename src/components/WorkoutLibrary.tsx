import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Workout } from '../types/workout';
import { deleteWorkoutFromLibrary, getWorkoutLibrary } from '../utils/storage';

interface WorkoutLibraryProps {
  onLoadWorkout: (workout: Workout) => void;
}

export default function WorkoutLibrary({ onLoadWorkout }: WorkoutLibraryProps) {
  const [workouts, setWorkouts] = React.useState<Workout[]>([]);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zwift_workout_library') {
        setWorkouts(getWorkoutLibrary());
      }
    };

    const handleLibraryUpdate = () => {
      setWorkouts(getWorkoutLibrary());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('workoutLibraryUpdated', handleLibraryUpdate);

    setWorkouts(getWorkoutLibrary());

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('workoutLibraryUpdated', handleLibraryUpdate);
    };
  }, []);

  const handleDelete = (workoutId: string) => {
    deleteWorkoutFromLibrary(workoutId);
    setWorkouts(getWorkoutLibrary());
  };

  const handleLoad = (workout: Workout) => {
    onLoadWorkout(workout);
  };

  if (workouts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <ListItem>
          <ListItemText 
            secondary="No workouts saved in your library yet."
            sx={{ textAlign: 'center' }}
          />
        </ListItem>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {workouts.map((workout, index) => (
        <React.Fragment key={workout.id}>
          {index > 0 && <Divider />}
          <ListItem
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            secondaryAction={
              <Box>
                <Tooltip title="Load">
                  <IconButton 
                    edge="end" 
                    onClick={() => handleLoad(workout)}
                    size="small"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDelete(workout.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemText primary={workout.name} />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
} 