import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaLock } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Components/FireBase';
import { useDispatch } from 'react-redux';
import { login } from '../ReduxToolkit/AuthSlice';
import googleicon from "../Assets/google.png"
interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;

      dispatch(
        login({
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
        })
      );

      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        login({
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
        })
      );

      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
      setErrorMessage('Google login failed. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="container w-[300px] border flex justify-center shadow-md p-3 rounded bg-white">
        <div className="flex flex-col justify-center items-center">
          <div className="border-2 border-black rounded-full p-3 my-2 shadow-md">
            <FaLock className="text-black" fontSize={23} />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm my-2">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 w-[270px]">
              <div>
                <label htmlFor="email" className="text-md font-semibold">Email:</label>
                <input
                  className="border h-8 w-full rounded text-md"
                  type="text"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={loginData.email}
                />
              </div>

              <div>
                <label htmlFor="password" className="text-md font-semibold">Password:</label>
                <div className="relative">
                  <input
                    className="border h-8 w-full rounded text-md"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute top-2 right-0 px-2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button type="submit" className="bg-black px-5 py-1 text-white rounded-full shadow-md active:scale-95 transition-all">
                <p className="text-md">Login</p>
              </button>
            </div>
          </form>

          <div className="mt-5">
            <button onClick={handleGoogleLogin} className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-full shadow-md px-3 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <img src={googleicon } alt="" className="w-4 h-4" />
              <span className="px-2">Google</span>
            </button>
          </div>

          <div className="flex justify-center mt-6 font-semibold">
            <p className="text-sm">
              Don't have an Account?
              <Link to="/signup">
                <span className="px-1 text-gray-500">Signup</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
