import React, { useState } from 'react';
import Login from './components/Login';
import KpiCard from './components/Kpicard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Implement your login logic here
    // For simplicity, I'm just setting isLoggedIn to true
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <KpiCard />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
