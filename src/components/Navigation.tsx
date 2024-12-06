import { Link } from '@mui/material';

export default function Navigation() {
  return (
    <nav>
      <Link href="#features" sx={{ mr: 2 }}>Features</Link>
      <Link href="#changelog" sx={{ mr: 2 }}>Change Log</Link>
    </nav>
  );
} 