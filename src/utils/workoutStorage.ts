import { Workout } from '../types/workout';

const CURRENT_WORKOUT_KEY = 'current_workout';

export const saveCurrentWorkout = (workout: Workout): void => {
  try {
    localStorage.setItem(CURRENT_WORKOUT_KEY, JSON.stringify(workout));
  } catch (error) {
    console.error('Failed to save current workout:', error);
  }
};

export const loadCurrentWorkout = (): Workout | null => {
  try {
    const savedWorkout = localStorage.getItem(CURRENT_WORKOUT_KEY);
    if (!savedWorkout) return null;

    const parsedWorkout = JSON.parse(savedWorkout) as Workout;
    
    // Validate the workout structure
    if (typeof parsedWorkout === 'object' 
        && 'id' in parsedWorkout 
        && 'name' in parsedWorkout 
        && 'description' in parsedWorkout 
        && 'segments' in parsedWorkout 
        && Array.isArray(parsedWorkout.segments)) {
      return parsedWorkout;
    }
    return null;
  } catch (error) {
    console.error('Failed to load current workout:', error);
    return null;
  }
}; 