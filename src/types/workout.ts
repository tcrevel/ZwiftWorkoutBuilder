export interface BaseWorkoutSegment {
  type: 'warmup' | 'cooldown' | 'interval' | 'steady';
  duration: number; // in seconds
  cadence?: number;
}

export interface RampSegment extends BaseWorkoutSegment {
  type: 'warmup' | 'cooldown';
  startPowerPercent: number;
  endPowerPercent: number;
}

export interface SteadySegment extends BaseWorkoutSegment {
  type: 'steady';
  powerPercent: number;
}

export interface IntervalSegment extends BaseWorkoutSegment {
  type: 'interval';
  powerTarget1Percent: number;
  powerTarget2Percent: number;
  repetitions: number;
  onDuration: number;
  offDuration: number;
}

export type WorkoutSegment = RampSegment | SteadySegment | IntervalSegment;

export interface Workout {
  id: string;
  name: string;
  description: string;
  segments: WorkoutSegment[];
} 