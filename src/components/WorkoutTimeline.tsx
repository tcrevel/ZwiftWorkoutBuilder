import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Box, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {
  ComposedChart,
  ReferenceArea,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Workout, IntervalSegment, RampSegment, SteadySegment } from '../types/workout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BoltIcon from '@mui/icons-material/Bolt';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CategoryIcon from '@mui/icons-material/Category';
import HotelIcon from '@mui/icons-material/Hotel';

interface WorkoutTimelineProps {
  workout: Workout;
  onRemoveSegment: (index: number) => void;
  onReorderSegments: (startIndex: number, endIndex: number) => void;
  onEditSegment: (index: number) => void;
}

interface ChartDataPoint {
  startTime: number;
  endTime: number;
  power: number;
  endPower?: number;
}

interface PowerZone {
  name: string;
  min: number;
  max: number;
  color: string;
}

const POWER_ZONES: PowerZone[] = [
  { name: 'Z1 (Recovery)', min: 0, max: 55, color: '#CCCCCC' },
  { name: 'Z2 (Endurance)', min: 55, max: 75, color: '#59C3E2' },
  { name: 'Z3 (Tempo)', min: 75, max: 90, color: '#84CF2B' },
  { name: 'Z4 (Threshold)', min: 90, max: 105, color: '#F4C01A' },
  { name: 'Z5 (VO2 Max)', min: 105, max: 120, color: '#F37021' },
  { name: 'Z6 (Anaerobic)', min: 120, max: 150, color: '#D22E1F' },
];

const getPowerZoneColor = (power: number): string => {
  for (const zone of POWER_ZONES) {
    if (power >= zone.min && power <= zone.max) {
      return zone.color;
    }
  }
  return POWER_ZONES[0].color; // Default to Z1 color
};

export default function WorkoutTimeline({ 
  workout, 
  onRemoveSegment, 
  onReorderSegments,
  onEditSegment,
}: WorkoutTimelineProps) {
  // Initialize FTP from localStorage or default to 250
  const [ftp, setFtp] = React.useState<number>(() => {
    const savedFtp = localStorage.getItem('userFTP');
    return savedFtp ? parseInt(savedFtp) : 250;
  });

  const handleFtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFtp = parseInt(event.target.value) || 250;
    setFtp(newFtp);
    localStorage.setItem('userFTP', newFtp.toString());
  };

  const getChartData = () => {
    const data: ChartDataPoint[] = [];
    let currentTime = 0;

    workout.segments.forEach((segment) => {
      if (segment.type === 'interval') {
        // For intervals, create alternating work/rest bars for each repetition
        for (let i = 0; i < segment.repetitions; i++) {
          // Work interval
          data.push({
            startTime: currentTime / 60,
            endTime: (currentTime + segment.onDuration) / 60,
            power: segment.powerTarget1Percent,
          });
          currentTime += segment.onDuration;

          // Rest interval
          data.push({
            startTime: currentTime / 60,
            endTime: (currentTime + segment.offDuration) / 60,
            power: segment.powerTarget2Percent,
          });
          currentTime += segment.offDuration;
        }
      } else if (segment.type === 'steady') {
        // For steady state, create a single bar
        data.push({
          startTime: currentTime / 60,
          endTime: (currentTime + segment.duration) / 60,
          power: segment.powerPercent,
        });
        currentTime += segment.duration;
      } else {
        // For warmup and cooldown, create multiple points to show progression
        const rampSegment = segment as RampSegment;
        const steps = 60; // One point per second for smooth progression
        const timeStep = segment.duration / steps;
        const powerStep = (rampSegment.endPowerPercent - rampSegment.startPowerPercent) / (steps - 1);

        for (let i = 0; i < steps; i++) {
          const stepStartTime = currentTime + (i * timeStep);
          const stepEndTime = currentTime + ((i + 1) * timeStep);
          const currentPower = rampSegment.startPowerPercent + (i * powerStep);
          const nextPower = rampSegment.startPowerPercent + ((i + 1) * powerStep);

          data.push({
            startTime: stepStartTime / 60,
            endTime: stepEndTime / 60,
            power: currentPower,
            endPower: nextPower,
          });
        }
        currentTime += segment.duration;
      }
    });
    return data;
  };

  const getMaxPower = () => {
    let maxPower = 0;
    workout.segments.forEach((segment) => {
      if (segment.type === 'interval') {
        maxPower = Math.max(maxPower, segment.powerTarget1Percent, segment.powerTarget2Percent);
      } else if (segment.type === 'steady') {
        maxPower = Math.max(maxPower, segment.powerPercent);
      } else {
        maxPower = Math.max(maxPower, (segment as RampSegment).startPowerPercent, (segment as RampSegment).endPowerPercent);
      }
    });
    // Round up to the nearest 25
    return Math.ceil(maxPower / 25) * 25;
  };

  const getTotalDuration = () => {
    return workout.segments.reduce((acc, segment) => acc + segment.duration, 0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'} : ${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
    }
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
  };

  const formatMinutes = (minutes: number) => {
    const totalSeconds = Math.round(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'} : ${mins} ${mins === 1 ? 'min' : 'mins'}`;
    }
    return `${mins} ${mins === 1 ? 'min' : 'mins'}`;
  };

  const getTimeAxisTicks = () => {
    const totalMinutes = getTotalDuration() / 60;
    
    // Choose an appropriate interval based on workout duration
    let intervalMinutes: number;
    if (totalMinutes <= 30) intervalMinutes = 5; // 5-minute intervals for workouts up to 30 minutes
    else if (totalMinutes <= 60) intervalMinutes = 10; // 10-minute intervals for workouts up to 1 hour
    else if (totalMinutes <= 120) intervalMinutes = 15; // 15-minute intervals for workouts up to 2 hours
    else intervalMinutes = 30; // 30-minute intervals for longer workouts

    // Generate tick values at the chosen interval
    const ticks: number[] = [];
    for (let i = 0; i <= totalMinutes; i += intervalMinutes) {
      ticks.push(i);
    }
    // Always include the final duration if it's not already included
    const lastTick = ticks[ticks.length - 1];
    if (lastTick !== totalMinutes) {
      ticks.push(totalMinutes);
    }
    return ticks;
  };

  const getSegmentDescription = (segment: Workout['segments'][0], index: number) => {
    if (segment.type === 'interval') {
      const intervalSegment = segment as IntervalSegment;
      const workDuration = formatTime(intervalSegment.onDuration);
      const restDuration = formatTime(intervalSegment.offDuration);
      return `${index + 1}. Interval - ${intervalSegment.repetitions}x (${workDuration} @ ${intervalSegment.powerTarget1Percent}% / ${restDuration} @ ${intervalSegment.powerTarget2Percent}%)${intervalSegment.cadence ? ` @ ${intervalSegment.cadence} RPM` : ''}`;
    } else if (segment.type === 'steady') {
      const steadySegment = segment as SteadySegment;
      const duration = formatTime(steadySegment.duration);
      return `${index + 1}. Steady - ${duration} at ${steadySegment.powerPercent}% FTP${steadySegment.cadence ? ` @ ${steadySegment.cadence} RPM` : ''}`;
    } else {
      const rampSegment = segment as RampSegment;
      const type = rampSegment.type.charAt(0).toUpperCase() + rampSegment.type.slice(1);
      const duration = formatTime(rampSegment.duration);
      return `${index + 1}. ${type} - ${duration} at ${rampSegment.startPowerPercent}% → ${rampSegment.endPowerPercent}% FTP${rampSegment.cadence ? ` @ ${rampSegment.cadence} RPM` : ''}`;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    onReorderSegments(sourceIndex, destinationIndex);
  };

  const calculateTSS = () => {
    if (workout.segments.length === 0) return 0;

    let totalStress = 0;
    let totalSeconds = 0;

    workout.segments.forEach((segment) => {
      const duration = segment.duration;
      let intensity;

      if (segment.type === 'interval') {
        // For intervals, calculate weighted average intensity
        const onTime = segment.onDuration * segment.repetitions;
        const offTime = segment.offDuration * segment.repetitions;
        const totalTime = onTime + offTime;
        intensity = (onTime * Math.pow(segment.powerTarget1Percent / 100, 2) + 
                    offTime * Math.pow(segment.powerTarget2Percent / 100, 2)) / totalTime;
      } else if (segment.type === 'steady') {
        intensity = Math.pow(segment.powerPercent / 100, 2);
      } else {
        // For ramps (warmup/cooldown), use average power
        const avgPower = (segment.startPowerPercent + segment.endPowerPercent) / 2;
        intensity = Math.pow(avgPower / 100, 2);
      }

      totalStress += duration * intensity;
      totalSeconds += duration;
    });

    // TSS = (seconds × normalized power × intensity factor) ÷ (FTP × 3600) × 100
    const hourlyFactor = totalSeconds / 3600;
    const tss = (totalStress / totalSeconds) * hourlyFactor * 100;
    
    return Math.round(tss);
  };

  const calculateCHO2 = () => {
    if (workout.segments.length === 0) return { total: 0, hourlyRate: 0 };

    let totalCHO2 = 0;
    let weightedTimeIntensity = 0;
    let totalDurationHours = 0;
    
    workout.segments.forEach((segment) => {
      const durationHours = segment.duration / 3600;
      totalDurationHours += durationHours;
      let intensity;

      if (segment.type === 'interval') {
        // For intervals, use weighted average intensity
        const onTime = segment.onDuration * segment.repetitions;
        const offTime = segment.offDuration * segment.repetitions;
        const totalTime = onTime + offTime;
        intensity = (onTime * segment.powerTarget1Percent + offTime * segment.powerTarget2Percent) / totalTime;
      } else if (segment.type === 'steady') {
        intensity = segment.powerPercent;
      } else {
        // For ramps (warmup/cooldown), use average power
        intensity = (segment.startPowerPercent + segment.endPowerPercent) / 2;
      }

      weightedTimeIntensity += intensity * durationHours;

      // CHO2 calculation based on intensity
      // Below 50% FTP: ~30g/hour
      // 50-75% FTP: ~45g/hour
      // 75-85% FTP: ~60g/hour
      // Above 85% FTP: ~90g/hour
      let cho2Rate;
      if (intensity < 50) cho2Rate = 30;
      else if (intensity < 75) cho2Rate = 45;
      else if (intensity < 85) cho2Rate = 60;
      else cho2Rate = 90;

      totalCHO2 += cho2Rate * durationHours;
    });

    const averageIntensity = weightedTimeIntensity / totalDurationHours;
    let averageHourlyRate;
    if (averageIntensity < 50) averageHourlyRate = 30;
    else if (averageIntensity < 75) averageHourlyRate = 45;
    else if (averageIntensity < 85) averageHourlyRate = 60;
    else averageHourlyRate = 90;

    return {
      total: Math.round(totalCHO2),
      hourlyRate: averageHourlyRate
    };
  };

  const calculateNP = () => {
    if (workout.segments.length === 0) return 0;
    
    const powerValues: number[] = [];
    workout.segments.forEach(segment => {
      for (let i = 0; i < segment.duration; i++) {
        let power;
        if (segment.type === 'interval') {
          const cycleTime = segment.onDuration + segment.offDuration;
          const withinCycle = i % cycleTime;
          power = withinCycle < segment.onDuration ? segment.powerTarget1Percent : segment.powerTarget2Percent;
        } else if (segment.type === 'steady') {
          power = segment.powerPercent;
        } else { // ramp
          const progress = i / segment.duration;
          power = segment.startPowerPercent + (segment.endPowerPercent - segment.startPowerPercent) * progress;
        }
        // Convert percentage to watts using user's FTP
        powerValues.push(power * ftp / 100);
      }
    });

    // 30-second rolling average
    const rollingSize = 30;
    const rollingPowers: number[] = [];
    for (let i = 0; i <= powerValues.length - rollingSize; i++) {
      const avg = powerValues.slice(i, i + rollingSize).reduce((a, b) => a + b) / rollingSize;
      rollingPowers.push(Math.pow(avg, 4));
    }

    const avgPower = Math.pow(rollingPowers.reduce((a, b) => a + b) / rollingPowers.length, 0.25);
    return Math.round(avgPower);
  };

  const calculateIF = () => {
    const np = calculateNP();
    return Number((np / ftp).toFixed(2));
  };

  const calculateWork = () => {
    if (workout.segments.length === 0) return 0;
    
    let totalWork = 0;
    workout.segments.forEach(segment => {
      const durationHours = segment.duration / 3600;
      let avgPower;
      
      if (segment.type === 'interval') {
        const onTime = segment.onDuration * segment.repetitions;
        const offTime = segment.offDuration * segment.repetitions;
        const totalTime = onTime + offTime;
        avgPower = (onTime * segment.powerTarget1Percent + offTime * segment.powerTarget2Percent) / totalTime;
      } else if (segment.type === 'steady') {
        avgPower = segment.powerPercent;
      } else {
        avgPower = (segment.startPowerPercent + segment.endPowerPercent) / 2;
      }
      
      // Work (kJ) = Power (W) * Time (hours) * 3.6
      totalWork += (avgPower / 100) * durationHours * 3.6;
    });
    
    return Math.round(totalWork);
  };

  const classifyWorkout = () => {
    const if_ = calculateIF();
    const tss = calculateTSS();
    
    // Classification based on IF and duration
    let type = '';
    let energySystem = '';
    const ifValue = Number(if_);
    
    if (ifValue < 0.75) {
      type = 'Endurance';
      energySystem = 'Aerobic';
    } else if (ifValue < 0.85) {
      type = 'Tempo';
      energySystem = 'Aerobic + Lactate Threshold';
    } else if (ifValue < 0.95) {
      type = 'Threshold';
      energySystem = 'Lactate Threshold';
    } else if (ifValue < 1.05) {
      type = 'VO2max';
      energySystem = 'VO2max + Anaerobic';
    } else {
      type = 'Anaerobic';
      energySystem = 'Anaerobic + Neuromuscular';
    }

    // Recovery time based on TSS
    let recovery = '';
    if (tss < 100) {
      recovery = '12-24 hours';
    } else if (tss < 200) {
      recovery = '24-36 hours';
    } else if (tss < 300) {
      recovery = '36-48 hours';
    } else {
      recovery = '48+ hours';
    }

    return { type, energySystem, recovery };
  };

  const calculateTimeInZones = () => {
    if (workout.segments.length === 0) return new Array(POWER_ZONES.length).fill(0);
    
    const timeInZones = new Array(POWER_ZONES.length).fill(0);
    
    workout.segments.forEach(segment => {
      if (segment.type === 'interval') {
        // Handle intervals
        const totalCycles = segment.duration / (segment.onDuration + segment.offDuration);
        const onTime = segment.onDuration * totalCycles;
        const offTime = segment.offDuration * totalCycles;
        
        // Check on power
        POWER_ZONES.forEach((zone, index) => {
          if (segment.powerTarget1Percent >= zone.min && segment.powerTarget1Percent < zone.max) {
            timeInZones[index] += onTime;
          }
        });
        
        // Check off power
        POWER_ZONES.forEach((zone, index) => {
          if (segment.powerTarget2Percent >= zone.min && segment.powerTarget2Percent < zone.max) {
            timeInZones[index] += offTime;
          }
        });
      } else if (segment.type === 'steady') {
        // Handle steady state
        POWER_ZONES.forEach((zone, index) => {
          if (segment.powerPercent >= zone.min && segment.powerPercent < zone.max) {
            timeInZones[index] += segment.duration;
          }
        });
      } else {
        // Handle ramps by sampling points
        const samples = 10; // Number of points to sample along the ramp
        const timePerSample = segment.duration / samples;
        
        for (let i = 0; i < samples; i++) {
          const progress = i / samples;
          const power = segment.startPowerPercent + (segment.endPowerPercent - segment.startPowerPercent) * progress;
          
          POWER_ZONES.forEach((zone, index) => {
            if (power >= zone.min && power < zone.max) {
              timeInZones[index] += timePerSample;
            }
          });
        }
      }
    });
    
    return timeInZones;
  };

  const formatZoneTime = (seconds: number) => {
    if (seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateZonePercentages = (timeInZones: number[]) => {
    const totalTime = timeInZones.reduce((a, b) => a + b, 0);
    return timeInZones.map(time => ((time / totalTime) * 100).toFixed(1));
  };

  const maxPower = workout.segments.length > 0 ? getMaxPower() : 200;
  const totalDurationMinutes = getTotalDuration() / 60;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Workout Preview
          </Typography>
          <TextField
            label="FTP (watts)"
            type="number"
            value={ftp}
            onChange={handleFtpChange}
            size="small"
            sx={{ width: 120 }}
            inputProps={{
              min: 50,
              max: 500,
              step: 5
            }}
          />
        </Box>
        {workout.segments.length > 0 && (
          <>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              mb: 2
            }}>
              {/* First Row - Duration and Power Metrics */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: { xs: 1, sm: 2 }, 
                '& > *': { 
                  flex: { xs: '1 1 auto', sm: '0 0 auto' } 
                }
              }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Total Duration:</Box> {formatTime(getTotalDuration())}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SpeedIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>TSS:</Box> {calculateTSS()}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BoltIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>NP:</Box> {calculateNP()}W • 
                  <Box component="span" sx={{ fontWeight: 'bold', ml: 1 }}>IF:</Box> {calculateIF()} • 
                  <Box component="span" sx={{ fontWeight: 'bold', ml: 1 }}>Work:</Box> {calculateWork()}kJ
                </Typography>
              </Box>

              {/* Second Row - Workout Characteristics */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: { xs: 1, sm: 2 }, 
                '& > *': { 
                  flex: { xs: '1 1 auto', sm: '0 0 auto' } 
                }
              }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CategoryIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Type:</Box> {classifyWorkout().type}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FitnessCenterIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Energy System:</Box> {classifyWorkout().energySystem}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RestaurantIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>CHO2:</Box> {calculateCHO2().total}g ({calculateCHO2().hourlyRate}g/hr)
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HotelIcon fontSize="small" />
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Recovery:</Box> {classifyWorkout().recovery}
                </Typography>
              </Box>
            </Box>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <ComposedChart 
                  margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
                  data={[{ time: 0 }]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <defs>
                    {getChartData().map((segment, index) => 
                      segment.endPower !== undefined && (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor={getPowerZoneColor(segment.power)} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={getPowerZoneColor(segment.endPower)} stopOpacity={0.8} />
                        </linearGradient>
                      )
                    )}
                  </defs>
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={[0, totalDurationMinutes]}
                    tickFormatter={formatMinutes}
                    ticks={getTimeAxisTicks()}
                    label={{ value: 'Time', position: 'bottom' }}
                    allowDataOverflow={false}
                    scale="linear"
                  />
                  <YAxis
                    domain={[0, maxPower]}
                    ticks={Array.from({ length: (maxPower / 25) + 1 }, (_, i) => i * 25)}
                    label={{ value: 'Power (%FTP)', angle: -90, position: 'insideLeft' }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}% FTP`]}
                    labelFormatter={formatMinutes}
                    cursor={false}
                  />
                  {getChartData().map((segment, index) => (
                    <ReferenceArea
                      key={`segment-${index}`}
                      x1={segment.startTime}
                      x2={segment.endTime}
                      y1={0}
                      y2={segment.endPower !== undefined ? segment.endPower : segment.power}
                      fill={segment.endPower !== undefined ? 
                        `url(#gradient-${index})` : 
                        getPowerZoneColor(segment.power)
                      }
                      fillOpacity={0.8}
                      ifOverflow="hidden"
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            {/* Power Zones Breakdown */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Time in Power Zones
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {POWER_ZONES.map((zone, index) => {
                  const timeInZones = calculateTimeInZones();
                  const percentages = calculateZonePercentages(timeInZones);
                  if (timeInZones[index] === 0) return null;
                  
                  return (
                    <Tooltip 
                      key={zone.name}
                      title={`${zone.min}% - ${zone.max}% FTP`}
                      arrow
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 16, 
                          height: 16, 
                          bgcolor: zone.color,
                          borderRadius: 1
                        }} />
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {zone.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                          {formatZoneTime(timeInZones[index])}
                        </Typography>
                        <Box sx={{ 
                          flex: 1,
                          height: 8,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: `${percentages[index]}%`,
                            height: '100%',
                            bgcolor: zone.color,
                            transition: 'width 0.3s ease-in-out'
                          }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 45 }}>
                          {percentages[index]}%
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          </>
        )}
      </Paper>

      {workout.segments.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Segments
          </Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ py: 0 }}
                >
                  {workout.segments.map((segment, index) => (
                    <Draggable
                      key={`segment-${index}`}
                      draggableId={`segment-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            pl: 1,
                            pr: 12,
                            bgcolor: snapshot.isDragging ? 'action.hover' : 'inherit',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                            position: 'relative',
                            borderBottom: index < workout.segments.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                          }}
                        >
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              marginRight: 8,
                              cursor: 'grab',
                            }}
                          >
                            <DragHandleIcon fontSize="small" color="action" />
                          </div>
                          <ListItemText
                            primary={getSegmentDescription(segment, index)}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              display: 'flex',
                              gap: 1,
                            }}
                          >
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => onEditSegment(index)}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => onRemoveSegment(index)}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      )}
    </Box>
  );
}; 