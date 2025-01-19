import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { UserIcon, EnvelopeIcon, LockClosedIcon, PencilIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response);

      if (response.data && response.data.id) {
        console.log('User created:', response.data);
      
        // Affichage du succès
        toast.success('Registration successful!', {
          position: 'top-right',
          autoClose: 3000,
        });
      
        // Stockez les informations utilisateur
        localStorage.setItem('user', JSON.stringify(response.data));
      
        // Redirection vers la page d'accueil après 3 secondes
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast.error('Registration failed. Missing user data.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
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
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Register</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Username</label>
                <div className="flex items-center border-b border-gray-300 dark:border-gray-700 py-2">
                  <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
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
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
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
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Profile Picture</label>
                <div className="flex items-center border-b border-gray-300 dark:border-gray-700 py-2">
                  <ArrowUpTrayIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" />
                  <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Bio</label>
                <div className="flex items-center border-b border-gray-300 dark:border-gray-700 py-2">
                  <PencilIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;