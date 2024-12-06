import { AppBar, Toolbar, Button, Box } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import FeaturesIcon from '@mui/icons-material/Stars';
import HistoryIcon from '@mui/icons-material/History';

export default function NavigationBar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ 
      borderBottom: 1, 
      borderColor: 'divider',
      overflow: 'hidden',
    }}>
      <Toolbar sx={{ 
        px: { xs: 0.5, sm: 2 },
        minHeight: { xs: 48 },
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 2 },
          overflow: 'hidden',
          '& .MuiButton-root': {
            minWidth: 'auto',
            px: { xs: 0.5, sm: 2 },
            whiteSpace: 'nowrap',
          }
        }}>
          <Button
            color="inherit"
            startIcon={<BuildIcon />}
            href="#builder"
          >
            Builder
          </Button>
          <Button
            color="inherit"
            startIcon={<FeaturesIcon />}
            href="#features"
          >
            Features
          </Button>
          <Button
            color="inherit"
            startIcon={<HistoryIcon />}
            href="#changelog"
          >
            Change Log
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 