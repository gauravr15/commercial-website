import React, { useEffect, useState, useContext, useRef } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileImage from '../../components/ImageComponent/ImageComponent';
import './Profile.css';
import TextSection from '../../components/TextSection/TextSection';
import Cookies from 'js-cookie';
import { makePostRequest } from '../../utility/RestCallUtility'; 
import AuthContext from '../../utility/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/UploadModal/UploadModal'; 
import DynamicForm from '../../components/DynamicForm/DynamicForm';

const Profile = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasFetchedProfile = useRef(false); 

  useEffect(() => {
    console.log('useEffect triggered');

    // Prevent duplicate API calls during strict mode or re-renders
    if (hasFetchedProfile.current) {
      console.log('Profile already fetched, skipping API call...');
      return;
    }

    // Set the flag early to avoid race conditions
    hasFetchedProfile.current = true;

    if (authLoading) {
      console.log('Auth is loading, skipping profile fetch...');
      return;
    }

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to home...');
      navigate('/');
      return;
    }

    const fetchProfileData = async () => {
      console.log('fetchProfileData function invoked');
      const customerId = Cookies.get('customerId');
      console.log(`Customer ID from cookie: ${customerId}`);

      if (!customerId) {
        console.log('No customer ID found in cookies');
        setError('Customer ID not found');
        setLoading(false);
        return;
      }

      const baseURL = process.env.REACT_APP_BASE_PROFILE_URL;
      const endpoint = '/v1/customer/details';

      const payload = {
        customerType: 'CUSTOMER',
        customerId: customerId,
      };

      try {
        console.log('Calling API to fetch profile data...');
        const response = await makePostRequest(baseURL, endpoint, payload, {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`, 
            appLang: 'en',
            requestTimestamp: new Date().getTime(),
          },
        });

        console.log('API Response:', response);

        if (response.statusCode === 2000) {
          console.log('Successful response from API');
          setProfileData(response.data);
        } else {
          console.log(`Error in response: ${response.message}`);
          setError(response.message);
        }
      } catch (err) {
        console.error('Error during API call:', err);
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, authLoading, navigate]);

  const openModal = () => {
    console.log('Opening modal');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

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

        <button onClick={openModal} className="upload-button">
          Change Profile Photo
        </button>

        {isModalOpen && <UploadModal onClose={closeModal} />}

        <TextSection heading={heading} paragraph={paragraph} />
        {error && <p className="error-message">{error}</p>}
        <DynamicForm module="profile" submodule="details" />
      </div>
      <Footer />
    </>
  );
};

export default Profile;
