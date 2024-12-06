import { Box, Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const changes = [
  {
    version: '1.0.0',
    date: '2024-01-20',
    changes: [
      'Initial release',
      'Basic workout builder with interval, ramp, and steady state segments',
      'Power zone visualization',
      'TSS calculation',
      'Export to Zwift (.zwo) format'
    ]
  },
  {
    version: '1.1.0',
    date: '2024-01-25',
    changes: [
      'Added Normalized Power calculation',
      'Added Intensity Factor display',
      'Added Work (kJ) calculation',
      'Improved power zone breakdown visualization'
    ]
  },
  {
    version: '1.2.0',
    date: '2024-01-30',
    changes: [
      'Added CHO2 estimation',
      'Added time in zones analysis',
      'Added suggested recovery time',
      'Improved responsive design'
    ]
  }
];

export default function ChangeLog() {
  return (
    <Box id="changelog" sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Change Log
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Track our progress and latest improvements
      </Typography>
      <Timeline position="alternate">
        {changes.map((change, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < changes.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" component="span">
                Version {change.version}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                {change.date}
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {change.changes.map((item, itemIndex) => (
                  <Typography 
                    component="li" 
                    variant="body2" 
                    color="text.secondary" 
                    key={itemIndex}
                    sx={{ mb: 0.5 }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
} 