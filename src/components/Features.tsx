import { Box, Typography } from '@mui/material';

export default function Features() {
  return (
    <Box 
      id="features" 
      component="section" 
      sx={{ p: 3 }}
      aria-labelledby="features-title"
    >
      <Typography id="features-title" variant="h4" gutterBottom>
        Features
      </Typography>

      <Typography variant="h6">Core Features</Typography>
      <ul>
        <li>Visual workout builder with real-time power graph preview</li>
        <li>Support for all workout segment types (Steady, Intervals, Warmup, Cooldown)</li>
        <li>Import and export Zwift-compatible .zwo files</li>
        <li>Drag and drop segment reordering</li>
        <li>Undo/Redo functionality with keyboard shortcuts</li>
      </ul>

      <Typography variant="h6">Advanced Metrics</Typography>
      <ul>
        <li>Training Stress Score (TSS) calculation</li>
        <li>Normalized Power (NP) estimation</li>
        <li>Intensity Factor (IF) analysis</li>
        <li>Work calculation in kilojoules (kJ)</li>
      </ul>

      <Typography variant="h6">Power Analysis</Typography>
      <ul>
        <li>Time in zones breakdown</li>
        <li>Zone distribution visualization</li>
        <li>Power zone targeting</li>
        <li>Workout type classification</li>
      </ul>

      <Typography variant="h6">Training Guidance</Typography>
      <ul>
        <li>Energy system focus detection</li>
        <li>Recovery recommendations</li>
        <li>CHO2 estimation for nutrition planning</li>
        <li>Hourly carbohydrate requirements</li>
      </ul>

      <Typography variant="h6">User Experience</Typography>
      <ul>
        <li>Intuitive segment creation and editing</li>
        <li>Precise duration control</li>
        <li>Responsive design for all devices</li>
        <li>Modern, clean interface</li>
      </ul>

      <Typography variant="h6">Coming Soon</Typography>
      <ul>
        <li>Workout templates library</li>
        <li>Training plan builder</li>
        <li>Advanced analytics dashboard</li>
        <li>Social sharing features</li>
      </ul>
    </Box>
  );
} 