import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext'; // Importer le contexte

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Récupérer l'action setUser depuis le contexte

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.token && response.data.user) {
        toast.success('Connexion réussie!', {
          position: 'top-right',
          autoClose: 3000,
        });

        // Stockez le token JWT et les informations utilisateur
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Mettez à jour l'état de l'utilisateur
        setUser(response.data.user);

        // Redirection immédiate vers la page d'accueil
        navigate('/');
      } else {
        toast.error('Echec de la connexion. Données utilisateur ou token manquants.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Erreur:', error.response ? error.response.data : error.message);

      if (error.response && error.response.status === 404) {
        toast.error('Ressource non trouvée. Veuillez réessayer.', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error('Echec de la connexion. Veuillez réessayer.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded px-8 py-6 border border-gray-400 dark:border-gray-1000">
        <div className="flex justify-center mb-6">
          <svg
          className="h-8 w-8 text-gray-900 dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <div className="flex items-center border-b border-gray-300 dark:border-gray-700 py-2">
              <EnvelopeIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <div className="flex items-center border-b border-gray-300 dark:border-gray-700 py-2">
              <LockClosedIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Connexion
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
          You don't have an account ?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;