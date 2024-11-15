import React, { useEffect, useState } from 'react';
import {useSelector } from 'react-redux';
import { RootState } from '../ReduxToolkit/Store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '../Components/FireBase';
import LogoutButton from '../Components/LogoutButton';

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Fetch user profile when user is available
  useEffect(() => {
    if (user && user.uid) {
      const fetchUserProfile = async () => {
        try {
          const docRef = doc(database, 'Users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData({
              name: data?.username || '',
              email: data?.email || '',
              phone: data?.phone || '',
              address: data?.address || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  // Handle changes to the form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update profile information
  const updateProfileHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const docRef = doc(database, 'Users', user.uid);
      await setDoc(docRef, profileData, { merge: true });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // If no user, show message
  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 uppercase">User Profile</h2>
        <form onSubmit={updateProfileHandler}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium">Username:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-lg font-medium">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-lg font-medium">Address:</label>
            <textarea
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={4}
            />
          </div>
          <div className="mb-6 text-center">
            <button
              type="submit"
              className="w-full p-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all active:scale-95"
            >
              Update Profile
            </button>
          </div>
        </form>
        <div className="text-center">
        <div className="bg-red-500 text-white rounded-full p-3 font-semibold hover:bg-red-600 transition-all active:scale-95"><LogoutButton /></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
