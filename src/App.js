import React from 'react';
import Dashboard from './pages/Dashboard';

const styles = {
  app: "min-h-screen bg-gray-50",
  container: "container mx-auto px-4"
};

function App() {
  return (
    <div className={styles.app}>
      <Dashboard />
    </div>
  );
}

export default App;