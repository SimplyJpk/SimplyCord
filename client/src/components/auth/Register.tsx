import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, RegisterCredentials } from '../../slices/authSlice';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store/store';
// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Register: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: RegisterCredentials = { username, email, password, file };
    dispatch(registerUser(credentials));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
          maxWidth: '400px',
          p: 3,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h2">
          Register
        </Typography>
        <Typography variant="body2">
          Already have an account? <Link href="/login">Login</Link>
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <TextField
            label="Username"
            type="text"
            required
            slotProps={{
              htmlInput: {
                maxLength: 16,
                minLength: 3,
                pattern: '^[a-zA-Z0-9_]+$',
                title: 'Only alphanumeric characters and underscores are allowed',
              }
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            required
            slotProps={{
              htmlInput: {
                pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
                title: 'Must be a valid email address',
              }
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            required
            slotProps={{
              htmlInput: {
                minLength: 8,
                maxLength: 32,
              }
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={authStatus === 'loading'}
            fullWidth
            sx={{ mt: 2 }}
          >
            {authStatus === 'loading' ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;