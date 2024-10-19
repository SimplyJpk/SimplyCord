import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// MUI
import { makeStyles } from '@mui/styles';
import { keyframes } from '@mui/system';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import styled from '@mui/material/styles/styled';
// MUI Icons
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
  },
});

const AnimatedErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: '250px',
  color: theme.palette.error.main,
  animation: `${bounce} 2s ease infinite`,
}));

const NotFoundPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Box className={classes.root}>
        <AnimatedErrorIcon />
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;