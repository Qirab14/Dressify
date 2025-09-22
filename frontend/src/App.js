import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import VirtualTryOnScreen from './screens/VirtualTryOnScreen';
import AIStyleScreen from './screens/AIStyleScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import './App.css';

// Material-UI imports
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function AppContent() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshDashboardFn, setRefreshDashboardFn] = useState(null);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerItems = [
    { text: 'Home', path: '/home' },
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Profile Setup', path: '/profile-setup' },
    { text: 'Virtual Try-On', path: '/virtual-tryon' },
    { text: 'AI Style', path: '/ai-style' },
    { text: 'Login', path: '/login' },
    { text: 'Signup', path: '/signup' },
    { text: 'Chatbot', path: '/chatbot' },
  ];

  return (
    <div className="App">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1300 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {drawerItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path} onClick={toggleDrawer(false)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Routes>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<DashboardScreen user={user} setRefreshFn={setRefreshDashboardFn} />} />
        <Route path="/profile-setup" element={<ProfileSetupScreen />} />
        <Route path="/" element={
          <ProtectedRoute>
            <LoginScreen />
          </ProtectedRoute>
        } />
        <Route path="/virtual-tryon" element={
          <ProtectedRoute>
            <VirtualTryOnScreen />
          </ProtectedRoute>
        } />
                <Route path="/ai-style" element={
          <ProtectedRoute>
            <AIStyleScreen refreshDashboard={refreshDashboardFn} />
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={<ChatbotScreen />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
