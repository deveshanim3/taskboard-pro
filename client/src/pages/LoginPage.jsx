import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="login-page">
      <h1>TaskBoard Pro</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
