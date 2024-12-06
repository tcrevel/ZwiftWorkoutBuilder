import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  ButtonGroup,
  IconButton,
  InputAdornment,
  Tooltip,
  Slider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { WorkoutSegment, Workout } from '../types/workout';
import WorkoutLibrary from './WorkoutLibrary';
import { powerZones } from '../utils/powerZones';
import { styled } from '@mui/material/styles';

interface WorkoutFormProps {
  onAddSegment: (segment: WorkoutSegment) => void;
  onExport: () => void;
  onSaveToLibrary: () => void;
  onClearSegments: () => void;
  hasSegments: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onLoadWorkout: (workout: Workout) => void;
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

const PresetButton = styled(Button)(({ theme }) => ({
  minWidth: '42px',
  height: '28px',
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0.5),
  borderRadius: '14px',
  fontSize: '0.8125rem',
  fontWeight: 500,
  textTransform: 'none',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
  },
}));

const DURATION_PRESETS = [1, 2, 3, 5, 10, 15, 20, 30];
const SECONDS_PRESETS = [0, 10, 15, 30];

const WorkoutForm: React.FC<WorkoutFormProps> = ({ 
  onAddSegment, 
  onExport,
  onSaveToLibrary,
  onClearSegments,
  hasSegments,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onLoadWorkout,
}) => {
  const [segmentType, setSegmentType] = useState<WorkoutSegment['type']>('steady');
  
  // Regular segment state
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('0');
  const [power, setPower] = useState('75');
  const [startPower, setStartPower] = useState('75');
  const [endPower, setEndPower] = useState('75');
  
  // Interval-specific state
  const [powerTarget1, setPowerTarget1] = useState('100');
  const [powerTarget2, setPowerTarget2] = useState('50');
  const [repetitions, setRepetitions] = useState('5');
  const [onMinutes, setOnMinutes] = useState('1');
  const [onSeconds, setOnSeconds] = useState('0');
  const [offMinutes, setOffMinutes] = useState('1');
  const [offSeconds, setOffSeconds] = useState('0');
  
  // Common state
  const [cadence, setCadence] = useState<string>('');

  // Update power values when segment type changes
  useEffect(() => {
    if (segmentType === 'cooldown') {
      setStartPower('75');
      setEndPower('55');
    } else if (segmentType === 'warmup') {
      setStartPower('55');
      setEndPower('75');
    }
  }, [segmentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (segmentType === 'interval') {
      const onDuration = (parseInt(onMinutes) * 60) + parseInt(onSeconds);
      const offDuration = (parseInt(offMinutes) * 60) + parseInt(offSeconds);
      
      onAddSegment({
        type: 'interval',
        duration: (onDuration + offDuration) * parseInt(repetitions),
        powerTarget1Percent: Number(powerTarget1),
        powerTarget2Percent: Number(powerTarget2),
        repetitions: Number(repetitions),
        onDuration,
        offDuration,
        cadence: cadence ? Number(cadence) : undefined,
      });
    } else if (segmentType === 'steady') {
      onAddSegment({
        type: 'steady',
        duration: (parseInt(minutes) * 60) + parseInt(seconds),
        powerPercent: Number(power),
        cadence: cadence ? Number(cadence) : undefined,
      });
    } else {
      // warmup or cooldown
      onAddSegment({
        type: segmentType,
        duration: (parseInt(minutes) * 60) + parseInt(seconds),
        startPowerPercent: Number(startPower),
        endPowerPercent: Number(endPower),
        cadence: cadence ? Number(cadence) : undefined,
      });
    }

    // Reset form
    if (segmentType === 'interval') {
      setPowerTarget1('100');
      setPowerTarget2('50');
      setRepetitions('5');
      setOnMinutes('1');
      setOnSeconds('0');
      setOffMinutes('1');
      setOffSeconds('0');
    } else {
      setMinutes('5');
      setSeconds('0');
      setPower('75');
      setStartPower('75');
      setEndPower('75');
    }
    setCadence('');
  };

  const handleMinutesChange = (value: string, setter: (value: string) => void) => {
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  const handleSecondsChange = (value: string, setter: (value: string) => void) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) < 60)) {
      setter(value);
    }
  };

  const adjustMinutes = (amount: number, currentValue: string, setter: (value: string) => void) => {
    const newValue = Math.max(0, parseInt(currentValue || '0') + amount);
    setter(newValue.toString());
  };

  const adjustSeconds = (amount: number, currentValue: string, setter: (value: string) => void) => {
    let newValue = parseInt(currentValue || '0') + amount;
    if (newValue < 0) newValue = 59;
    if (newValue >= 60) newValue = 0;
    setter(newValue.toString().padStart(2, '0'));
  };

  const handlePowerChange = (value: string, setter: (value: string) => void) => {
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = parseInt(value || '0');
      if (numValue <= 200) {
        setter(value);
      }
    }
  };

  const adjustPower = (amount: number, currentValue: string, setter: (value: string) => void) => {
    const newValue = Math.max(0, Math.min(200, parseInt(currentValue || '0') + amount));
    setter(newValue.toString());
  };

  const DurationInput = ({ 
    minutesValue, 
    setMinutes, 
    secondsValue, 
    setSeconds,
    label = ''
  }: {
    minutesValue: string;
    setMinutes: (value: string) => void;
    secondsValue: string;
    setSeconds: (value: string) => void;
    label?: string;
  }) => (
    <>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Minutes"
          value={minutesValue}
          onChange={(e) => handleMinutesChange(e.target.value, setMinutes)}
          inputProps={{ 
            inputMode: 'numeric', 
            pattern: '[0-9]*',
            style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 }
          }}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={() => adjustMinutes(-1, minutesValue, setMinutes)}
                >
                  <RemoveIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => adjustMinutes(1, minutesValue, setMinutes)}
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              '& .MuiInputAdornment-root': {
                marginRight: 0,
                marginLeft: 0,
              }
            }
          }}
        />
        <TextField
          label="Seconds"
          value={secondsValue}
          onChange={(e) => handleSecondsChange(e.target.value, setSeconds)}
          inputProps={{ 
            inputMode: 'numeric', 
            pattern: '[0-9]*',
            style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 }
          }}
          sx={{ flex: 1 }}
          error={parseInt(secondsValue) >= 60}
          helperText={parseInt(secondsValue) >= 60 ? 'Seconds must be less than 60' : ' '}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={() => adjustSeconds(-5, secondsValue, setSeconds)}
                >
                  <RemoveIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => adjustSeconds(5, secondsValue, setSeconds)}
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              '& .MuiInputAdornment-root': {
                marginRight: 0,
                marginLeft: 0,
              }
            }
          }}
        />
      </Box>
    </>
  );

  const PowerInput = ({
    label,
    value,
    setValue,
    error,
    helperText,
  }: {
    label: string;
    value: string;
    setValue: (value: string) => void;
    error?: boolean;
    helperText?: string;
  }) => (
    <TextField
      fullWidth
      label={label}
      type="text"
      value={value}
      onChange={(e) => handlePowerChange(e.target.value, setValue)}
      error={error}
      helperText={helperText || ' '}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              size="small"
              onClick={() => adjustPower(-5, value, setValue)}
            >
              <RemoveIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => adjustPower(5, value, setValue)}
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
    />
  );

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Paper sx={{ 
        p: { xs: 0.75, sm: 2 }, 
        mb: { xs: 1, sm: 2 },
        width: '100%',
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2 
        }}>
          <Typography variant="h6">Add Segment</Typography>
          <ButtonGroup size="small">
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <Button
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <UndoIcon />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <span>
                <Button
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <RedoIcon />
                </Button>
              </span>
            </Tooltip>
          </ButtonGroup>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 },
          mb: 2,
          flexWrap: 'nowrap',
        }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onExport}
            disabled={!hasSegments}
            startIcon={<DownloadIcon />}
            sx={{ 
              height: '36px',  // Make button thinner
              py: 0,  // Remove vertical padding
              backgroundColor: '#ff4d00',
              '&:hover': {
                backgroundColor: '#ff6a00',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255, 77, 0, 0.12)',
              }
            }}
          >
            Export
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={onSaveToLibrary}
            startIcon={<SaveIcon />}
            disabled={!hasSegments}
            sx={{ 
              height: '36px',  // Make button thinner
              py: 0  // Remove vertical padding
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClearSegments}
            disabled={!hasSegments}
            startIcon={<ClearIcon />}
            sx={{ 
              minWidth: 'auto',
              height: '36px',  // Make button thinner
              py: 0  // Remove vertical padding
            }}
          >
            Clear
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={segmentType}
              label="Type"
              onChange={(e) => setSegmentType(e.target.value as WorkoutSegment['type'])}
            >
              <MenuItem value="warmup">Warm Up</MenuItem>
              <MenuItem value="steady">Steady</MenuItem>
              <MenuItem value="interval">Interval</MenuItem>
              <MenuItem value="cooldown">Cool Down</MenuItem>
            </Select>
          </FormControl>

          {/* Duration for non-interval segments */}
          {segmentType !== 'interval' && (
            <>
              <DurationInput
                minutesValue={minutes}
                setMinutes={setMinutes}
                secondsValue={seconds}
                setSeconds={setSeconds}
              />
              
              {/* Duration presets */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      Minutes
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5,
                      justifyContent: 'flex-start',
                    }}>
                      {DURATION_PRESETS.map((preset) => (
                        <PresetButton
                          key={`min-${preset}`}
                          variant="outlined"
                          size="small"
                          onClick={() => setMinutes(preset.toString())}
                          sx={{
                            backgroundColor: minutes === preset.toString() ? 'primary.main' : 'transparent',
                            color: minutes === preset.toString() ? 'primary.contrastText' : 'inherit',
                            '&:hover': {
                              backgroundColor: minutes === preset.toString() ? 'primary.dark' : 'primary.main',
                            }
                          }}
                        >
                          {preset}m
                        </PresetButton>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      Seconds
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5,
                      justifyContent: 'flex-start',
                    }}>
                      {SECONDS_PRESETS.map((preset) => (
                        <PresetButton
                          key={`sec-${preset}`}
                          variant="outlined"
                          size="small"
                          onClick={() => setSeconds(preset.toString())}
                          sx={{
                            backgroundColor: seconds === preset.toString() ? 'primary.main' : 'transparent',
                            color: seconds === preset.toString() ? 'primary.contrastText' : 'inherit',
                            '&:hover': {
                              backgroundColor: seconds === preset.toString() ? 'primary.dark' : 'primary.main',
                            }
                          }}
                        >
                          {preset}s
                        </PresetButton>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {/* Power settings for steady segments */}
          {segmentType === 'steady' && (
            <>
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
                        onClick={() => setPower(zone.power.toString())}
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
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={Number(power)}
                    onChange={(_, value) => setPower(value.toString())}
                    min={50}
                    max={170}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <PowerInput
                  label="Power %"
                  value={power}
                  setValue={setPower}
                  error={parseInt(power) > 200}
                  helperText={parseInt(power) > 200 ? 'Power must be ≤ 200%' : ' '}
                />
              </Box>
            </>
          )}

          {/* Power settings for warmup/cooldown */}
          {(segmentType === 'warmup' || segmentType === 'cooldown') && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              mb: 2 
            }}>
              <PowerInput
                label="Start Power %"
                value={startPower}
                setValue={setStartPower}
                error={parseInt(startPower) > 200}
                helperText={parseInt(startPower) > 200 ? 'Power must be ≤ 200%' : ' '}
              />
              <PowerInput
                label="End Power %"
                value={endPower}
                setValue={setEndPower}
                error={parseInt(endPower) > 200}
                helperText={parseInt(endPower) > 200 ? 'Power must be ≤ 200%' : ' '}
              />
            </Box>
          )}

          {/* Interval settings */}
          {segmentType === 'interval' && (
            <>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 2 
              }}>
                <PowerInput
                  label="Work Power %"
                  value={powerTarget1}
                  setValue={setPowerTarget1}
                  error={parseInt(powerTarget1) > 200}
                  helperText={parseInt(powerTarget1) > 200 ? 'Power must be ≤ 200%' : ' '}
                />
                <PowerInput
                  label="Rest Power %"
                  value={powerTarget2}
                  setValue={setPowerTarget2}
                  error={parseInt(powerTarget2) > 200}
                  helperText={parseInt(powerTarget2) > 200 ? 'Power must be ≤ 200%' : ' '}
                />
              </Box>

              <TextField
                fullWidth
                label="Number of Repetitions"
                type="text"
                value={repetitions}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setRepetitions(value);
                  }
                }}
                sx={{ mb: 2 }}
              />

              <DurationInput
                minutesValue={onMinutes}
                setMinutes={setOnMinutes}
                secondsValue={onSeconds}
                setSeconds={setOnSeconds}
                label="Work Interval"
              />

              <DurationInput
                minutesValue={offMinutes}
                setMinutes={setOffMinutes}
                secondsValue={offSeconds}
                setSeconds={setOffSeconds}
                label="Rest Interval"
              />
            </>
          )}

          <Box sx={{ mt: 'auto', pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Add Segment
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper sx={{ 
        p: { xs: 0.75, sm: 2 }, 
        width: '100%',
        overflow: 'hidden',
      }}>
        <Typography variant="h6" gutterBottom>
          Workout Library
        </Typography>
        <WorkoutLibrary onLoadWorkout={onLoadWorkout} />
      </Paper>
    </Box>
  );
};

export default WorkoutForm; 