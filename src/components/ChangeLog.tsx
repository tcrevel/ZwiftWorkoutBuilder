import { Box, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function ChangeLog() {
  return (
    <Box id="changelog" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Change Log
      </Typography>

      <Typography variant="h6">Version 1.2.0 (2024-03-22)</Typography>
      <ul>
        <li>Added duration presets for quick segment creation</li>
        <li>Improved export workflow with clear save location instructions</li>
        <li>Added Zwift ID field for easier workout export</li>
        <li>Enhanced user interface for power zone selection</li>
        <li>Improved mobile responsiveness</li>
      </ul>

      <Typography variant="h6">Version 1.1.0 (2024-03-20)</Typography>
      <ul>
        <li>Added advanced metrics calculation (TSS, NP, IF)</li>
        <li>Implemented power zone analysis and visualization</li>
        <li>Added workout classification system</li>
        <li>Integrated nutrition guidance with CHO2 estimation</li>
        <li>Enhanced drag and drop functionality for segments</li>
        <li>Added undo/redo functionality (Ctrl+Z, Ctrl+Y)</li>
        <li>Improved mobile responsiveness</li>
      </ul>

      <Typography variant="h6">Version 1.0.0 (2024-03-15)</Typography>
      <ul>
        <li>Initial release</li>
        <li>Basic workout builder with visual graph preview</li>
        <li>Support for all workout segment types</li>
        <li>Import/Export .zwo file functionality</li>
        <li>Basic workout management features</li>
      </ul>

      <Box sx={{ 
        mt: 4, 
        pt: 2, 
        borderTop: 1, 
        borderColor: 'divider',
        textAlign: 'center'
      }}>
        <Button
          variant="outlined"
          startIcon={<GitHubIcon />}
          href="https://github.com/tcrevel/ZwiftWorkoutBuilder"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          View on GitHub
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Contribute to the project and help make it better!
        </Typography>
      </Box>
    </Box>
  );
} 