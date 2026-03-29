import React from 'react';
import logoIcon from './logo-icon.png';
import logoFull from './logo-full.jpeg';

const App = () => {
  return (
    <div>
      <header>
        <img src={logoIcon} alt="Logo Icon" />
        <img src={logoFull} alt="Logo Full" />
      </header>
      <main>
        <h1>Welcome to Fetch R Latest!</h1>
        <p>Your one-stop solution for fetching the latest data.</p>
      </main>
    </div>
  );
};

export default App;