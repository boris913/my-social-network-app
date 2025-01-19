import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import TweetDetail from './pages/TweetDetail';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchBar from './components/SearchBar';
import NewTweet from './components/NewTweet';
import Notifications from './components/Notifications';
import Navbar from './components/Navbar';
import NavbarTop from './components/NavbarTop';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [tweets, setTweets] = useState([]);
  const { user, setUser, logout } = useAuth(); // Utiliser useAuth

  useEffect(() => {
    if (user) {
      fetch('/tweets.json')
        .then(response => response.json())
        .then(data => setTweets(data))
        .catch(error => console.error('Erreur lors de la récupération des tweets :', error));
    }
  }, [user]);

  const addNewTweet = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const updateLikes = (tweetId, newLikes) => {
    const updatedTweets = tweets.map(tweet =>
      tweet.id === tweetId ? { ...tweet, likes: newLikes } : tweet
    );
    setTweets(updatedTweets);
  };

  const updateComments = (tweetId, updatedComments) => {
    const updatedTweets = tweets.map(tweet =>
      tweet.id === tweetId ? { ...tweet, responses: updatedComments } : tweet
    );
    setTweets(updatedTweets);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {user && <NavbarTop user={user} onLogout={logout} />}
      <div className="flex mt-16 flex-grow">
        {user && <Navbar />}
        <div className={`ml-64 flex-1 p-4 ${!user && 'ml-0'}`}>
          <Routes>
            <Route path="/" element={user ? <HomePage tweets={tweets} addNewTweet={addNewTweet} updateComments={updateComments} updateLikes={updateLikes} setUser={setUser} /> : <Navigate to="/login" />} />
            <Route path="/tweet/:tweetId" element={user ? <TweetDetail tweets={tweets} updateComments={updateComments} updateLikes={updateLikes} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/search" element={user ? <SearchBar /> : <Navigate to="/login" />} />
            <Route path="/newtweet" element={user ? <NewTweet addNewTweet={addNewTweet} /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
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