import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/layout/TopNav';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f2f5]">
        <TopNav />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;