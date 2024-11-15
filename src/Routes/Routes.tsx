import { createBrowserRouter, Navigate } from "react-router-dom";
import UserProfile from "../Pages/Profile";
import Login from "../Auth/Login";
import Home from "../Pages/Home";
import App from "../App";
import { useSelector } from 'react-redux';
import { RootState } from '../ReduxToolkit/Store';
import Cart from "../Pages/Cart";
import Signup from "../Auth/Signup";
import MyOrders from "../Pages/MyOrders";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  // Get authentication status from Redux store
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected content)
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: "/userprofile",
        element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
      },
      {
        path: "/cart",
        element: <ProtectedRoute><Cart /></ProtectedRoute>,
      },

      {
        path: "/myorders",
        element: <ProtectedRoute><MyOrders /></ProtectedRoute>,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup/>,
      },
      
    ],
  },
]);

export default router;
