import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, RegisterCredentials } from '../../slices/authSlice';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store/store';

const Register: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: RegisterCredentials = { username, email, password };
    dispatch(registerUser(credentials));
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-800">
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md">
        <h2>Register</h2>
        <span>
          Already have an account? <a href="/login">Login</a>
        </span>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label>Username</label>
            <input
              type="text"
              required
              pattern="^[a-zA-Z0-9_]+$"
              title="Only alphanumeric characters and underscores are allowed"
              maxLength={16}
              minLength={3}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              color='black'
              placeholder="Username"
            />
          </div>
          <div className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              required
              pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
              title="Must be a valid email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color='black'
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={32}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color='black'
              placeholder="Password"
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;