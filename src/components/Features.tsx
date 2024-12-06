import { Box, Typography, Grid, Paper } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const features = [
  {
    icon: <TimelineIcon fontSize="large" color="primary" />,
    title: 'Visual Workout Builder',
    description: 'Create workouts with an intuitive visual interface. Design intervals, ramps, and steady-state segments easily.'
  },
  {
    icon: <SpeedIcon fontSize="large" color="primary" />,
    title: 'Advanced Metrics',
    description: 'Track TSS, Normalized Power, Intensity Factor, and work in kilojoules. Make informed decisions about your training.'
  },
  {
    icon: <FitnessCenterIcon fontSize="large" color="primary" />,
    title: 'Power Zone Analysis',
    description: 'Detailed breakdown of time spent in each power zone. Understand your workout intensity distribution.'
  },
  {
    icon: <DownloadIcon fontSize="large" color="primary" />,
    title: 'Zwift Compatible',
    description: 'Export your workouts directly to Zwift-compatible .zwo files. Start training with just a few clicks.'
  },
  {
    icon: <BarChartIcon fontSize="large" color="primary" />,
    title: 'Real-time Updates',
    description: 'See your workout metrics update in real-time as you build. Instant feedback on your workout design.'
  },
  {
    icon: <AccessTimeIcon fontSize="large" color="primary" />,
    title: 'Smart Recovery',
    description: 'Get suggested recovery times based on workout intensity. Plan your training schedule effectively.'
  }
];

export default function Features() {
  return (
    <Box id="features" sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Features
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Everything you need to create perfect structured workouts
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider'
              }}
            >
              {feature.icon}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 