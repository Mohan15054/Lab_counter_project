import React, { useState } from 'react';
import './Login.css'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Hardcoded username and password
    const validUsername = 'user';
    const validPassword = 'password';

    // Check if the entered credentials match the hardcoded ones
    if (username === validUsername && password === validPassword) {
      onLogin(); // Call the onLogin function passed from the parent component
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
