import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tooltip,
  Slider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { WorkoutSegment, IntervalSegment, RampSegment, SteadySegment } from '../types/workout';
import { styled } from '@mui/material/styles';
import { powerZones } from '../utils/powerZones';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface EditSegmentDialogProps {
  open: boolean;
  segment: WorkoutSegment;
  onClose: () => void;
  onSave: (segment: WorkoutSegment) => void;
}

interface ZoneButtonProps {
  bgColor: string;
}

const ZoneButton = styled(Button)<ZoneButtonProps>(({ theme, bgColor }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5),
  backgroundColor: bgColor,
  color: theme.palette.getContrastText(bgColor),
  '&:hover': {
    backgroundColor: bgColor,
    opacity: 0.9,
  },
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  margin: theme.spacing(0.5),
}));

const PowerInput = ({
  value,
  onChange,
  error,
  helperText,
}: {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
  helperText?: string;
}) => {
  const adjustPower = (delta: number) => {
    const newValue = value + delta;
    if (newValue >= 0) {
      onChange(newValue);
    }
  };

  return (
    <TextField
      fullWidth
      label="Power %"
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      error={error}
      helperText={helperText || ' '}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              size="small"
              onClick={() => adjustPower(-5)}
            >
              <RemoveIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => adjustPower(5)}
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          '& .MuiInputAdornment-root': {
            marginRight: 0,
            marginLeft: 0,
          },
          '& input': {
            textAlign: 'center',
            paddingLeft: 0,
            paddingRight: 0,
          }
        }
      }}
      inputProps={{ min: 0, max: 200 }}
    />
  );
};

const EditSegmentDialog: React.FC<EditSegmentDialogProps> = ({
  open,
  segment,
  onClose,
  onSave,
}) => {
  const [editedSegment, setEditedSegment] = useState<WorkoutSegment>(segment);

  useEffect(() => {
    setEditedSegment(segment);
  }, [segment]);

  const handleSave = () => {
    onSave(editedSegment);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return { minutes, seconds: remainingSeconds };
  };

  const handleDurationChange = (value: { minutes: number; seconds: number }, field: 'duration' | 'onDuration' | 'offDuration') => {
    const totalSeconds = (value.minutes * 60) + value.seconds;
    setEditedSegment(prev => ({
      ...prev,
      [field]: totalSeconds,
    }));
  };

  if (editedSegment.type === 'interval') {
    const intervalSegment = editedSegment as IntervalSegment;
    const onDuration = formatDuration(intervalSegment.onDuration);
    const offDuration = formatDuration(intervalSegment.offDuration);

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Interval Segment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Work Power %"
                type="number"
                value={intervalSegment.powerTarget1Percent}
                onChange={(e) => setEditedSegment(prev => ({
                  ...prev,
                  powerTarget1Percent: Number(e.target.value),
                }))}
                inputProps={{ min: 0, max: 200 }}
              />
              <TextField
                fullWidth
                label="Rest Power %"
                type="number"
                value={intervalSegment.powerTarget2Percent}
                onChange={(e) => setEditedSegment(prev => ({
                  ...prev,
                  powerTarget2Percent: Number(e.target.value),
                }))}
                inputProps={{ min: 0, max: 200 }}
              />
            </Box>

            <TextField
              fullWidth
              label="Repetitions"
              type="number"
              value={intervalSegment.repetitions}
              onChange={(e) => setEditedSegment(prev => ({
                ...prev,
                repetitions: Number(e.target.value),
              }))}
              inputProps={{ min: 1 }}
            />

            <Typography variant="subtitle2">Work Interval</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Minutes"
                type="number"
                value={onDuration.minutes}
                onChange={(e) => handleDurationChange({
                  minutes: Number(e.target.value),
                  seconds: onDuration.seconds,
                }, 'onDuration')}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Seconds"
                type="number"
                value={onDuration.seconds}
                onChange={(e) => handleDurationChange({
                  minutes: onDuration.minutes,
                  seconds: Number(e.target.value),
                }, 'onDuration')}
                inputProps={{ min: 0, max: 59 }}
              />
            </Box>

            <Typography variant="subtitle2">Rest Interval</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Minutes"
                type="number"
                value={offDuration.minutes}
                onChange={(e) => handleDurationChange({
                  minutes: Number(e.target.value),
                  seconds: offDuration.seconds,
                }, 'offDuration')}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Seconds"
                type="number"
                value={offDuration.seconds}
                onChange={(e) => handleDurationChange({
                  minutes: offDuration.minutes,
                  seconds: Number(e.target.value),
                }, 'offDuration')}
                inputProps={{ min: 0, max: 59 }}
              />
            </Box>

            <TextField
              fullWidth
              label="Cadence (optional)"
              type="number"
              value={intervalSegment.cadence || ''}
              onChange={(e) => setEditedSegment(prev => ({
                ...prev,
                cadence: e.target.value ? Number(e.target.value) : undefined,
              }))}
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // For steady segments
  if (editedSegment.type === 'steady') {
    const steadySegment = editedSegment as SteadySegment;
    const duration = formatDuration(steadySegment.duration);

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Steady Segment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Minutes"
                type="number"
                value={duration.minutes}
                onChange={(e) => handleDurationChange({
                  minutes: Number(e.target.value),
                  seconds: duration.seconds,
                }, 'duration')}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Seconds"
                type="number"
                value={duration.seconds}
                onChange={(e) => handleDurationChange({
                  minutes: duration.minutes,
                  seconds: Number(e.target.value),
                }, 'duration')}
                inputProps={{ min: 0, max: 59 }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Power Zones
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1 },
                mb: 2,
              }}>
                {powerZones.map((zone) => (
                  <Tooltip 
                    key={zone.name} 
                    title={`${zone.label} (${zone.power}%)`}
                    arrow
                  >
                    <ZoneButton
                      bgColor={zone.color}
                      onClick={() => setEditedSegment(prev => ({
                        ...prev,
                        powerPercent: zone.power,
                      }))}
                      variant="contained"
                    >
                      {zone.name}
                    </ZoneButton>
                  </Tooltip>
                ))}
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Power
              </Typography>
              <Box sx={{ px: 1, mb: 2 }}>
                <Slider
                  value={steadySegment.powerPercent}
                  onChange={(_, value) => setEditedSegment(prev => ({
                    ...prev,
                    powerPercent: Number(value),
                  }))}
                  min={50}
                  max={170}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Box>
            </Box>

            <PowerInput
              value={steadySegment.powerPercent}
              onChange={(value) => setEditedSegment(prev => ({
                ...prev,
                powerPercent: value,
              }))}
              error={steadySegment.powerPercent > 200}
              helperText={steadySegment.powerPercent > 200 ? 'Power must be ≤ 200%' : ' '}
            />

            <TextField
              fullWidth
              label="Cadence (optional)"
              type="number"
              value={steadySegment.cadence || ''}
              onChange={(e) => setEditedSegment(prev => ({
                ...prev,
                cadence: e.target.value ? Number(e.target.value) : undefined,
              }))}
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // For warmup/cooldown segments
  const rampSegment = editedSegment as RampSegment;
  const duration = formatDuration(rampSegment.duration);
  const type = rampSegment.type.charAt(0).toUpperCase() + rampSegment.type.slice(1);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit {type} Segment</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Minutes"
              type="number"
              value={duration.minutes}
              onChange={(e) => handleDurationChange({
                minutes: Number(e.target.value),
                seconds: duration.seconds,
              }, 'duration')}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Seconds"
              type="number"
              value={duration.seconds}
              onChange={(e) => handleDurationChange({
                minutes: duration.minutes,
                seconds: Number(e.target.value),
              }, 'duration')}
              inputProps={{ min: 0, max: 59 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Start Power %"
              type="number"
              value={rampSegment.startPowerPercent}
              onChange={(e) => setEditedSegment(prev => ({
                ...prev,
                startPowerPercent: Number(e.target.value),
              }))}
              inputProps={{ min: 0, max: 200 }}
            />
            <TextField
              fullWidth
              label="End Power %"
              type="number"
              value={rampSegment.endPowerPercent}
              onChange={(e) => setEditedSegment(prev => ({
                ...prev,
                endPowerPercent: Number(e.target.value),
              }))}
              inputProps={{ min: 0, max: 200 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Cadence (optional)"
            type="number"
            value={rampSegment.cadence || ''}
            onChange={(e) => setEditedSegment(prev => ({
              ...prev,
              cadence: e.target.value ? Number(e.target.value) : undefined,
            }))}
            inputProps={{ min: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSegmentDialog; 