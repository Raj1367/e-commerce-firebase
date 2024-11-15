import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { auth, database } from '../Components/FireBase';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { login } from '../ReduxToolkit/AuthSlice';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (signUpData.password !== signUpData.confirmpassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(database, 'Users', user.uid), {
        username: signUpData.name,
        email: signUpData.email,
      });

      // Dispatch login action to store user in Redux
      dispatch(login({
        uid: user.uid,
        email: user.email,
        displayName: signUpData.name,
      }));

      alert('User Registered Successfully!');
      setSignUpData({
        name: '',
        email: '',
        password: '',
        confirmpassword: '',
      });

      navigate('/login');
    } catch (error: any) {
      console.log(error.message);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="container w-[325px] border flex justify-center shadow-md p-3 rounded bg-white">
        <div className="flex flex-col justify-center items-center">
          <form onSubmit={handleSubmit}>
            <div className="w-14 h-14 mx-auto relative overflow-hidden rounded-full bg-white border-2 border-black shadow-md">
              <label>
                <div className="flex justify-center items-center py-[15px] cursor-pointer">
                  <FaUser className="text-black" fontSize={23} />
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-4 w-[300px] mt-3">
              <div>
                <label htmlFor="name" className="text-md font-semibold">Username:</label>
                <input
                  className="border h-8 w-full rounded text-md"
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={signUpData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="text-md font-semibold">Email:</label>
                <input
                  className="border h-8 w-full rounded text-md"
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={signUpData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="text-md font-semibold">Password:</label>
                <div className="relative">
                  <input
                    className="border h-8 w-full rounded text-md"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    required
                    value={signUpData.password}
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

              <div>
                <label htmlFor="confirmpassword" className="text-md font-semibold">Confirm Password:</label>
                <div className="relative">
                  <input
                    className="border h-8 w-full rounded text-md"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmpassword"
                    id="confirmpassword"
                    required
                    value={signUpData.confirmpassword}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute top-2 right-0 px-2 cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-center mt-2">{error}</p>}

            <div className="flex justify-center mt-6">
              <button type="submit" className="bg-black px-4 py-[5px] text-white rounded-full shadow-md active:scale-95 transition-all" disabled={loading}>
                <p className="text-md">{loading ? 'Signing Up...' : 'Signup'}</p>
              </button>
            </div>
          </form>

          <div className="flex justify-center mt-6 font-semibold">
            <p className="text-sm">
              Already have an Account ?
              <Link to="/login">
                <span className="px-1 text-gray-600">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
