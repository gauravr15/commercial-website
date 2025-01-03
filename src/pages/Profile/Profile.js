import React, { useEffect, useState, useContext, useRef } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileImage from '../../components/ImageComponent/ImageComponent';
import './Profile.css';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    if (hasFetchedProfile.current) {
      return;
    }

    hasFetchedProfile.current = true;

    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchProfileData = async () => {
      const customerId = Cookies.get('customerId');

      if (!customerId) {
        setError('Customer ID not found');
        return;
      }

      const baseURL = process.env.REACT_APP_BASE_PROFILE_URL;
      const endpoint = '/v1/customer/details';

      const payload = {
        customerType: 'CUSTOMER',
        customerId: customerId,
      };

      try {
        const response = await makePostRequest(baseURL, endpoint, payload);

        if (response.statusCode === 2000) {
          setProfileData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      }
    };

    fetchProfileData();
  }, [isAuthenticated, authLoading, navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="profile-page">
        <ProfileImage />

        <button onClick={openModal} className="upload-button">
          Change Profile Photo
        </button>

        {isModalOpen && <UploadModal onClose={closeModal} />}

        {error && <p className="error-message">{error}</p>}

        <DynamicForm 
          module="profile" 
          submodule="details" 
          profileData={profileData}
        />
      </div>
      <Footer />
    </>
  );
};

export default Profile;
