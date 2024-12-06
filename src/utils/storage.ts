import { Workout } from '../types/workout';

const STORAGE_KEY = 'zwift_workout_library';

// Add this custom event
const LIBRARY_UPDATED_EVENT = 'workoutLibraryUpdated';
const libraryUpdatedEvent = new Event(LIBRARY_UPDATED_EVENT);

export const saveWorkoutToLibrary = (workout: Workout): void => {
  if (!workout.name) {
    throw new Error('Workout must have a name');
  }

  const library = getWorkoutLibrary();
  
  // Look for existing workout with the same name
  const existingIndex = library.findIndex(w => w.name.toLowerCase() === workout.name.toLowerCase());
  if (existingIndex !== -1) {
    // Update existing workout but keep its original ID
    const existingId = library[existingIndex].id;
    library[existingIndex] = {
      ...workout,
      id: existingId
    };
  } else {
    // Add as new workout with a new ID
    library.push({
      ...workout,
      id: crypto.randomUUID()
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    // Dispatch the custom event after successful save
    window.dispatchEvent(libraryUpdatedEvent);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    throw new Error('Failed to save workout to library');
  }
};

export const getWorkoutLibrary = (): Workout[] => {
  try {
    const libraryString = localStorage.getItem(STORAGE_KEY);
    return libraryString ? JSON.parse(libraryString) : [];
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return [];
  }
};

export const deleteWorkoutFromLibrary = (workoutId: string): void => {
  try {
    const library = getWorkoutLibrary();
    const updatedLibrary = library.filter(workout => workout.id !== workoutId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLibrary));
    // Dispatch the custom event after successful delete
    window.dispatchEvent(libraryUpdatedEvent);
  } catch (error) {
    console.error('Failed to delete workout:', error);
    throw new Error('Failed to delete workout from library');
  }
};

export const loadWorkoutFromLibrary = (workoutId: string): Workout | undefined => {
  const library = getWorkoutLibrary();
  return library.find(workout => workout.id === workoutId);
}; 