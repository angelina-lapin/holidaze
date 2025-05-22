import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VenuePage from './pages/VenuePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import ManagerProfile from './pages/ManagerProfile';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<VenuePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/manager-profile" element={<ManagerProfile />} />{' '}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
