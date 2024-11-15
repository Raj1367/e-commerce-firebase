import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../ReduxToolkit/AuthSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state and cookies
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
