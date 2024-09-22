import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './pages/projects';
import Chat from './pages/chat';
import FileExplorer from './pages/file-explorer';
import User from './pages/user';
import Login from './pages/login';
import Signup from './pages/signup';
import Logout from './pages/logout';
import PrivateRoute from './components/private-routes';
import { AuthProvider } from './contexts/auth-context';
import { ProfileProvider } from './contexts/profile-context';
import Nav from './components/nav'; // Assuming you have a separate Nav component
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <ProfileProvider>
      <AuthProvider>
        <Router>
          <Nav />
          <div id="window">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<PrivateRoute />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/chat/:projectId" element={<Chat />} />
              <Route path="/file-explorer/:projectId" element={<FileExplorer />} />
              <Route path="/user" element={<User />} />
            </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ProfileProvider>
  );
}

export default App;