import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, LoginCredentials } from '@slices/authSlice';
import { RootState } from '@store/store';
import { AppDispatch } from '@store/store';

const Login: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: LoginCredentials = { email, password };
    dispatch(loginUser(credentials));
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-800">
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md">
        <h2>Login</h2>
        <span>
          Don't have an account? <a href="/register">Register</a>
        </span>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              color='black'
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              color='black'
              placeholder="Password"
            />
          </div>
          <button type="submit" disabled={authStatus === 'loading'}>
            {authStatus === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;