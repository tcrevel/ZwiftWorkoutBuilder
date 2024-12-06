import { Box, Typography } from '@mui/material';

export default function ChangeLog() {
  return (
    <Box id="changelog" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Change Log
      </Typography>

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
    </Box>
  );
} 