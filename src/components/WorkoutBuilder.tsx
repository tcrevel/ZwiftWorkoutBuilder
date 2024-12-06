import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, Grid, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { Workout, WorkoutSegment } from '../types/workout';
import WorkoutTimeline from './WorkoutTimeline';
import WorkoutForm from './WorkoutForm';
import EditSegmentDialog from './EditSegmentDialog';
import { generateZwoFile, parseZwoFile } from '../utils/zwoGenerator';
import { saveWorkoutToLibrary } from '../utils/storage';

const STORAGE_KEY = 'zwift_workout_builder_state';
const HISTORY_LIMIT = 20;
const AUTO_SAVE_DELAY = 1000; // 1 second delay for auto-save

interface WorkoutHistory {
  past: Workout[];
  present: Workout;
  future: Workout[];
}

interface WorkoutBuilderProps {
  workout: Workout;
  onWorkoutChange: (workout: Workout) => void;
  zwiftId: string;
  onZwiftIdChange: (id: string) => void;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ 
  workout, 
  onWorkoutChange,
  zwiftId,
  onZwiftIdChange,
}) => {
  const [history, setHistory] = useState<WorkoutHistory>(() => ({
    past: [],
    present: workout,
    future: [],
  }));
  const [editingSegment, setEditingSegment] = useState<{ index: number; segment: WorkoutSegment } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [instructionsDialog, setInstructionsDialog] = useState<{
    open: boolean;
    path: string;
    fileName: string;
  }>({
    open: false,
    path: '',
    fileName: ''
  });

  // Save entire history state to local storage whenever it changes
  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.error('Failed to save workout state:', e);
      }
    };

    saveState();

    // Also save when user leaves/refreshes the page
    window.addEventListener('beforeunload', saveState);
    return () => window.removeEventListener('beforeunload', saveState);
  }, [history]);

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) { // metaKey for Mac
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            // Ctrl+Shift+Z or Cmd+Shift+Z for Redo
            handleRedo();
          } else {
            // Ctrl+Z or Cmd+Z for Undo
            handleUndo();
          }
        } else if (e.key === 'y') {
          // Ctrl+Y or Cmd+Y for Redo
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]);

  // Add this effect to handle auto-save
  useEffect(() => {
    // Only auto-save if the workout has a name and segments
    if (history.present.name && history.present.segments.length > 0) {
      // Clear any existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          saveWorkoutToLibrary(history.present);
          setNotification({
            open: true,
            message: 'Workout auto-saved',
            severity: 'success'
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
          setNotification({
            open: true,
            message: 'Auto-save failed',
            severity: 'error'
          });
        }
      }, AUTO_SAVE_DELAY);
    }

    // Cleanup timeout on unmount or when workout changes
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [history.present]); // Re-run effect when workout changes

  const updateWorkout = (newWorkout: Workout) => {
    // Add current state to past before updating
    setHistory(prev => ({
      past: [...prev.past, prev.present].slice(-HISTORY_LIMIT),
      present: newWorkout,
      future: [],
    }));
    onWorkoutChange(newWorkout);
  };

  const handleUndo = () => {
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    setHistory(prev => ({
      past: newPast,
      present: previous,
      future: [prev.present, ...prev.future],
    }));
    onWorkoutChange(previous);
  };

  const handleRedo = () => {
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: next,
      future: newFuture,
    }));
    onWorkoutChange(next);
  };

  const handleAddSegment = (segment: WorkoutSegment) => {
    updateWorkout({
      ...history.present,
      segments: [...history.present.segments, segment],
    });
  };

  const handleRemoveSegment = (index: number) => {
    updateWorkout({
      ...history.present,
      segments: history.present.segments.filter((_, i) => i !== index),
    });
  };

  const handleEditSegment = (index: number) => {
    setEditingSegment({
      index,
      segment: history.present.segments[index],
    });
  };

  const handleUpdateSegment = (updatedSegment: WorkoutSegment) => {
    if (editingSegment === null) return;

    updateWorkout({
      ...history.present,
      segments: history.present.segments.map((segment, index) =>
        index === editingSegment.index ? updatedSegment : segment
      ),
    });
    setEditingSegment(null);
  };

  const handleReorderSegments = (startIndex: number, endIndex: number) => {
    const newSegments = Array.from(history.present.segments);
    const [removed] = newSegments.splice(startIndex, 1);
    newSegments.splice(endIndex, 0, removed);

    updateWorkout({
      ...history.present,
      segments: newSegments,
    });
  };

  const handleExportZwo = () => {
    if (!zwiftId) {
      setNotification({
        open: true,
        message: 'Please enter your Zwift ID first',
        severity: 'error'
      });
      return;
    }

    try {
      const blob = generateZwoFile(history.present);
      const fileName = `${history.present.name || 'workout'}.zwo`;
      
      // Get Windows username from localStorage or prompt
      let windowsUsername = localStorage.getItem('windows_username');
      
      if (!windowsUsername) {
        // Show a more user-friendly prompt
        windowsUsername = window.prompt(
          'Please enter your Windows username (the name of your user folder in C:\\Users\\)',
          ''
        );
        
        if (!windowsUsername) {
          setNotification({
            open: true,
            message: 'Windows username is required to create the correct path',
            severity: 'error'
          });
          return;
        }
        
        // Save for future use
        localStorage.setItem('windows_username', windowsUsername);
      }

      const zwiftPath = `C:\\Users\\${windowsUsername}\\Documents\\Zwift\\Workouts\\${zwiftId}`;

      // Create a temporary download link
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      // Show instructions
      setNotification({
        open: true,
        message: `Please save the file to:\n${zwiftPath}\n\nIf the folder doesn't exist, please create it.`,
        severity: 'success'
      });

      setInstructionsDialog({
        open: true,
        path: zwiftPath,
        fileName: fileName
      });
    } catch (error) {
      console.error('Failed to export workout:', error);
      setNotification({
        open: true,
        message: 'Failed to export workout',
        severity: 'error'
      });
    }
  };

  const handleUpdateField = (field: keyof Workout, value: any) => {
    updateWorkout({
      ...history.present,
      [field]: value,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedWorkout = await parseZwoFile(file);
      updateWorkout(importedWorkout);
    } catch (error) {
      console.error('Failed to import workout:', error);
      // You might want to add proper error handling/user notification here
    }

    // Reset the file input
    event.target.value = '';
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSaveToLibrary = () => {
    if (!history.present.name) {
      setNotification({
        open: true,
        message: 'Please give your workout a name before saving',
        severity: 'error'
      });
      return;
    }
    
    try {
      saveWorkoutToLibrary(history.present);
      setNotification({
        open: true,
        message: 'Workout saved manually',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to save workout:', error);
      setNotification({
        open: true,
        message: 'Failed to save workout to library',
        severity: 'error'
      });
    }
  };

  const handleLoadWorkout = (loadedWorkout: Workout) => {
    updateWorkout(loadedWorkout);
  };

  const handleClearSegments = () => {
    if (window.confirm('Are you sure you want to clear all segments?')) {
      updateWorkout({
        ...history.present,
        segments: []
      });
      setNotification({
        open: true,
        message: 'All segments cleared',
        severity: 'success'
      });
    }
  };

  const InstructionsDialog = () => (
    <Dialog
      open={instructionsDialog.open}
      onClose={() => setInstructionsDialog(prev => ({ ...prev, open: false }))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Save Workout File</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          To use this workout in Zwift, please follow these steps:
        </Typography>
        <Typography component="div">
          <ol>
            <li>When the file download starts, choose "Save As"</li>
            <li>Navigate to this exact folder:
              <Box sx={{ 
                bgcolor: 'grey.100', 
                p: 1, 
                my: 1, 
                borderRadius: 1,
                fontFamily: 'monospace'
              }}>
                {instructionsDialog.path}
              </Box>
            </li>
            <li>If the folder doesn't exist:
              <ul>
                <li>Create the "Zwift" folder in your Documents</li>
                <li>Create a "Workouts" folder inside "Zwift"</li>
                <li>Create a folder with your Zwift ID ({zwiftId}) inside "Workouts"</li>
              </ul>
            </li>
            <li>Save the file as "{instructionsDialog.fileName}"</li>
            <li>Start Zwift and you'll find the workout in your custom workouts</li>
          </ol>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setInstructionsDialog(prev => ({ ...prev, open: false }))}>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ 
      px: { xs: 0, sm: 2 }, 
      pt: { xs: 1, sm: 1 },
      pb: { xs: 1, sm: 2 },
      width: '100%',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        px: { xs: 1, sm: 0 },
        flexWrap: 'wrap',
        gap: 1,
      }}>
        <Typography variant="h4" sx={{ 
          flex: 1,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
        }}>
          Zwift Workout Builder
        </Typography>
        <Button
          variant="contained"
          onClick={handleImportClick}
          startIcon={<UploadIcon />}
          sx={{
            backgroundColor: '#ff4d00',
            '&:hover': {
              backgroundColor: '#ff6a00',
            },
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            height: '36px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Import
        </Button>
      </Box>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zwo"
        style={{ display: 'none' }}
      />

      <Paper sx={{ 
        p: { xs: 0.75, sm: 2 }, 
        mb: 2, 
        mx: { xs: 0.5, sm: 0 } 
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Workout Name"
              value={history.present.name}
              onChange={(e) => handleUpdateField('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              label="Description"
              value={history.present.description}
              onChange={(e) => handleUpdateField('description', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 },
        flexDirection: { xs: 'column', md: 'row' },
        flex: 1,
        px: { xs: 0.5, sm: 0 },
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          width: { xs: '100%', md: '33.33%' },
          minWidth: { md: '300px' },
        }}>
          <WorkoutForm 
            onAddSegment={handleAddSegment}
            onExport={handleExportZwo}
            onSaveToLibrary={handleSaveToLibrary}
            onClearSegments={handleClearSegments}
            hasSegments={history.present.segments.length > 0}
            canUndo={history.past.length > 0}
            canRedo={history.future.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onLoadWorkout={handleLoadWorkout}
            zwiftId={zwiftId}
            onZwiftIdChange={onZwiftIdChange}
          />
        </Box>
        <Box sx={{ 
          width: { xs: '100%', md: '66.67%' },
        }}>
          <WorkoutTimeline 
            workout={history.present} 
            onRemoveSegment={handleRemoveSegment}
            onReorderSegments={handleReorderSegments}
            onEditSegment={handleEditSegment}
          />
        </Box>
      </Box>

      <Box sx={{ 
        mt: 4, 
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '0.875rem',
        pb: 2
      }}>
        Made with ❤️ by Thibault Crevel
      </Box>

      {editingSegment && (
        <EditSegmentDialog
          open={true}
          segment={editingSegment.segment}
          onClose={() => setEditingSegment(null)}
          onSave={handleUpdateSegment}
        />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={notification.severity === 'success' ? 2000 : 4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <InstructionsDialog />
    </Box>
  );
};

export default WorkoutBuilder; 