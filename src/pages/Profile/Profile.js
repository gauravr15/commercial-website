import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileImage from '../../components/ImageComponent/ImageComponent';
import './Profile.css';
import TextSection from '../../components/TextSection/TextSection';
import Cookies from 'js-cookie';
import { makePostRequest } from '../../utility/RestCallUtility'; // Import the makeRequest utility function
import AuthContext from '../../utility/AuthContext'; // Import AuthContext for authentication state management
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext); // Access authentication context
  const navigate = useNavigate(); // For navigation
  const [profileData, setProfileData] = useState(null); // State to hold profile data
  const [error, setError] = useState(null); // State to hold any error messages
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch customer profile data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to home or sign in
      navigate('/'); 
      return; // Exit the effect early
    }

    const fetchProfileData = async () => {
      const customerId = Cookies.get('customerId');
      if (!customerId) {
        setError('Customer ID not found');
        console.log('Customer ID not found in cookies');
        setLoading(false);
        return;
      }

      console.log('Customer ID from cookie:', customerId);

      const baseURL = process.env.REACT_APP_BASE_PROFILE_URL; // Replace with the actual base URL
      const endpoint = '/v1/customer/details';

      const payload = {
        customerType: 'CUSTOMER',
        customerId: customerId,
      };

      try {
        const response = await makePostRequest(baseURL, endpoint, payload, {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with actual token
            appLang: 'en',
            requestTimestamp: new Date().getTime(),
          },
        });

        console.log('Profile API Response:', response);

        if (response.statusCode === 2000) {
          console.log('Response data:', response.data);
          setProfileData(response.data);
        } else {
          console.log('Error in response:', response.message);
          setError(response.message);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate]); // Add dependencies to the useEffect

  const heading = loading
    ? `Welcome`
    : profileData && profileData.firstName
    ? `Welcome ${profileData.firstName}`
    : `Welcome`;

  const paragraph = profileData
    ? `Your profile data: ${JSON.stringify(profileData)}`
    : loading
    ? 'Loading your profile information...'
    : error
    ? 'Failed to load profile information.'
    : '';

  return (
    <>
      <Header />
      <div className="profile-page">
        <ProfileImage />
        <TextSection heading={heading} paragraph={paragraph} />
        {error && <p className="error-message">{error}</p>}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
