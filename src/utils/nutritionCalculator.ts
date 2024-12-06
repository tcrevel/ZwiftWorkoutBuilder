import { WorkoutSegment } from '../types/workout';

interface NutritionCalculations {
  calories: number;
  carbs: number;
  carbsPerHour: number;
  hydration: number;
  duration: number; // in minutes
  intensity: number; // average power as % of FTP
}

export const calculateNutrition = (segments: WorkoutSegment[]): NutritionCalculations => {
  // Calculate total duration in seconds
  const totalDuration = segments.reduce((acc, segment) => acc + segment.duration, 0);
  const durationMinutes = totalDuration / 60;

  // Calculate average intensity
  const weightedIntensity = segments.reduce((acc, segment) => {
    let segmentIntensity = 0;
    switch (segment.type) {
      case 'steady':
        segmentIntensity = segment.powerPercent;
        break;
      case 'interval':
        // Weighted average of work and rest intervals
        const workTime = segment.onDuration * segment.repetitions;
        const restTime = segment.offDuration * segment.repetitions;
        segmentIntensity = 
          ((segment.powerTarget1Percent * workTime) + 
           (segment.powerTarget2Percent * restTime)) / 
          (workTime + restTime);
        break;
      case 'warmup':
      case 'cooldown':
        segmentIntensity = (segment.startPowerPercent + segment.endPowerPercent) / 2;
        break;
    }
    return acc + (segmentIntensity * segment.duration);
  }, 0) / totalDuration;

  // Calculations based on exercise physiology formulas
  // Assuming 1 hour at FTP burns roughly 800 kcal
  const caloriesPerHour = (800 * weightedIntensity / 100);
  const calories = Math.round(caloriesPerHour * (durationMinutes / 60));

  // Update carbs calculation to match CHO2 logic
  let carbsPerHour;
  if (weightedIntensity < 50) carbsPerHour = 30;
  else if (weightedIntensity < 75) carbsPerHour = 45;
  else if (weightedIntensity < 85) carbsPerHour = 60;
  else carbsPerHour = 90;

  const carbs = Math.round(carbsPerHour * (durationMinutes / 60));

  // Hydration needs (ml per hour) based on intensity
  // Base: 500ml/hour + additional based on intensity
  const hydrationPerHour = 500 + (weightedIntensity > 75 ? 250 : 0);
  const hydration = Math.round(hydrationPerHour * (durationMinutes / 60));

  return {
    calories,
    carbs,
    carbsPerHour,
    hydration,
    duration: durationMinutes,
    intensity: Math.round(weightedIntensity),
  };
};

export const getNutritionTiming = (duration: number): string[] => {
  const timings: string[] = [];

  if (duration > 60) {
    timings.push('Start fueling 45-60 minutes into the workout');
    timings.push('Consume 20-30g carbs every 30 minutes');
  } else if (duration > 30) {
    timings.push('Consider taking 20-30g carbs mid-workout');
  }

  return timings;
};

export const getHydrationTips = (intensity: number): string[] => {
  const tips: string[] = [
    'Drink to thirst throughout the workout',
    'Aim to replace 80% of sweat losses',
  ];

  if (intensity > 75) {
    tips.push('Consider electrolyte replacement');
    tips.push('Pre-hydrate with 400-600ml 2-3 hours before');
  }

  return tips;
}; 