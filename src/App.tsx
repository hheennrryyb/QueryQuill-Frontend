import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './pages/projects';
import Chat from './pages/chat';
import FileExplorer from './pages/file-explorer';
import User from './pages/user';
import Login from './pages/login';
import Logout from './pages/logout';
import PrivateRoute from './components/private-routes';
import { AuthProvider } from './contexts/auth-context';
import { ProfileProvider } from './contexts/profile-context';
import Nav from './components/nav'; // Assuming you have a separate Nav component
import './App.css';

function App() {
  return (
    <ProfileProvider>
      <AuthProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<PrivateRoute />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/chat/:projectId" element={<Chat />} />
              <Route path="/file-explorer/:projectId" element={<FileExplorer />} />
              <Route path="/user" element={<User />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ProfileProvider>
  );
}

export default App;