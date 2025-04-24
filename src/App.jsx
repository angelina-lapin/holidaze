import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VenuePage from './pages/VenuePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<VenuePage />} />
    </Routes>
  );
}

export default App;
