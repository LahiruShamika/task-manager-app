import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
}

function AppContent() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const { login, isAuthenticated } = useAuth();

  const handleLoginSuccess = (userData: User, token: string) => {
    login(userData, token);
  };

  const handleRegisterSuccess = (userData: User, token: string) => {
    login(userData, token);
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="App">
      {currentView === 'login' ? (
        <Login 
          onSwitchToRegister={() => setCurrentView('register')} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register 
          onSwitchToLogin={() => setCurrentView('login')} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
