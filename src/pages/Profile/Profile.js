import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileImage from '../../components/ImageComponent/ImageComponent';
import './Profile.css';
import TextSection from '../../components/TextSection/TextSection';
import Cookies from 'js-cookie';
import { makeRequest } from '../../utility/RestCallUtility'; // Import the makeRequest utility function

const Profile = () => {
  const [profileData, setProfileData] = useState(null); // State to hold profile data
  const [error, setError] = useState(null); // State to hold any error messages
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch customer profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      // Get the customerId from cookies
      const customerId = Cookies.get('customerId');
      if (!customerId) {
        setError('Customer ID not found');
        console.log('Customer ID not found in cookies'); // Debug log
        setLoading(false); // Stop loading since customer ID is not available
        return;
      }

      console.log('Customer ID from cookie:', customerId); // Log customerId for debugging

      const baseURL = process.env.REACT_APP_BASE_PROFILE_URL; // Replace with the actual base URL
      const endpoint = '/v1/customer/details';

      const payload = {
        customerType: 'CUSTOMER',
        customerId: customerId,
      };

      try {
        // Call the makeRequest function from RestCallUtility.js
        const response = await makeRequest(baseURL, endpoint, payload, {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with actual token
            appLang: 'en',
            requestTimestamp: new Date().getTime(),
          },
        });

        console.log('Profile API Response:', response); // Debug log

        // Handle the response data
        if (response.statusCode === 2000) {
          console.log('Response data:', response.data); // Log the response data
          setProfileData(response.data); // Assuming the profile data is in the response's data field
        } else {
          console.log('Error in response:', response.message); // Log the error message
          setError(response.message); // Set error message if response is not successful
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false); // Stop loading after request completes
        console.log('Loading state set to false'); // Log loading state
      }
    };

    // Ensure the request is triggered only once when the component mounts
    fetchProfileData();
  }, []); // Empty dependency array ensures the request runs only once on component mount

  // Log the current state to check when the heading and paragraph are rendered
  console.log('Loading:', loading);
  console.log('Profile Data:', profileData);
  console.log('Error:', error);

  // Determine the heading based on loading state and profile data
  const heading = loading
    ? `Welcome` // Show only "Welcome" while loading
    : profileData && profileData.firstName
    ? `Welcome ${profileData.firstName}` // Show firstName when available
    : `Welcome`; // Default to "Welcome" if no profile data

  console.log('Heading:', heading); // Log the heading for debugging

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
        {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
      </div>

      <Footer />
    </>
  );
};

export default Profile;
