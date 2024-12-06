import { Box, Paper, Typography, Divider } from '@mui/material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TimerIcon from '@mui/icons-material/Timer';
import { WorkoutSegment } from '../types/workout';
import { calculateNutrition, getNutritionTiming, getHydrationTips } from '../utils/nutritionCalculator';

interface NutritionGuidanceProps {
  segments: WorkoutSegment[];
}

export default function NutritionGuidance({ segments }: NutritionGuidanceProps) {
  if (segments.length === 0) return null;

  const nutrition = calculateNutrition(segments);
  const timingTips = getNutritionTiming(nutrition.duration);
  const hydrationTips = getHydrationTips(nutrition.intensity);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Nutrition Guidance
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Estimated Energy
          </Typography>
          <Typography variant="h5">
            {nutrition.calories} kcal
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Carbs Needed
          </Typography>
          <Typography variant="h5">
            {nutrition.carbs}g
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {nutrition.carbsPerHour}g/hr
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Fluid Needs
          </Typography>
          <Typography variant="h5">
            {nutrition.hydration}ml
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalDiningIcon fontSize="small" /> Fueling Strategy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Target {nutrition.carbsPerHour}g carbs per hour
          {timingTips.map((tip, index) => (
            <Box component="span" display="block" key={index}>• {tip}</Box>
          ))}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WaterDropIcon fontSize="small" /> Hydration Plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hydrationTips.map((tip, index) => (
            <Box component="span" display="block" key={index}>• {tip}</Box>
          ))}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon fontSize="small" /> Pre-workout Timing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Eat a light meal 2-3 hours before
          • Optional: 20g carbs 30 minutes before
        </Typography>
      </Box>
    </Paper>
  );
} 