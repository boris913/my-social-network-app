import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import TweetDetail from './pages/TweetDetail';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Notifications from './components/Notifications';
import Navbar from './components/Navbar';
import NavbarTop from './components/NavbarTop'; // Importer le composant NavbarTop
import SearchResultsPage from './pages/SearchResultsPage'; // Importer le composant SearchResultsPage
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { user, logout } = useAuth(); // Utiliser useAuth
  const [searchType, setSearchType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (type, query) => {
    setSearchType(type);
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {user && <NavbarTop user={user} onLogout={logout} onSearch={handleSearch} />} {/* Passer user, onLogout et onSearch */}
      <div className="flex mt-16 flex-grow ">
        {user && <Navbar />}
        <div className={`ml-64 flex-1 p-4 ${!user && 'ml-0'}`}>
          <Routes>
            <Route path="/" element={user ? <HomePage user={user} logout={logout} /> : <Navigate to="/login" />} />
            <Route path="/tweet/:tweetId" element={user ? <TweetDetail /> : <Navigate to="/login" />} />
            <Route path="/profile/:userId" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
            <Route path="/search" element={user ? <SearchResultsPage type={searchType} query={searchQuery} /> : <Navigate to="/login" />} /> {/* Ajouter la route pour SearchResultsPage */}
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={<AppContent />} /> {/* Routes protégées */}
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;