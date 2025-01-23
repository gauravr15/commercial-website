import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { makePostRequest } from '../../utility/RestCallUtility'; // Import the utility function
import './DynamicForm.css'; // Import CSS for styling the form
import MessageModal from '../../components/MessageModal/MessageModal'; // Import the MessageModal component

// DTO to parse each field in the response
const parseField = (field) => ({
  id: field.id,
  module: field.module,
  displayName: field.displayName,
  placeholder: field.placeholder,
  fieldName: field.fieldName,
  regex: field.regex, // Regex for validation
  inputType: field.inputType, // Type for the HTML input
  isEditable: field.userEditable, // If the field is editable by the user
  isDisplay: field.isDisplay, // Ensure isDisplay is parsed
});

// Helper function to access or set a value in a nested object
const resolveNestedValue = (obj, path, value = undefined) => {
  const keys = path.split('.');
  if (value === undefined) {
    // Access value
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  } else {
    // Set value
    return keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = acc[key] || {};
      }
      return acc[key];
    }, obj);
  }
};

const DynamicForm = ({ module, submodule, profileData, customerId }) => {
  console.log(`Rendering DynamicForm Component with module: ${module}, submodule: ${submodule}`);
  
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Track if submit is enabled
  const [modalMessage, setModalMessage] = useState(''); // Message for the modal
  const [isModalVisible, setIsModalVisible] = useState(false); // To control modal visibility
  const hasFetched = useRef(false); // Ref to track if API call was already made

  useEffect(() => {
    if (hasFetched.current) return; // Skip API call if already fetched
    hasFetched.current = true; // Mark as fetched
  
    const fetchFields = async () => {
      setLoading(true);
      const payload = {
        module,
        ...(submodule && { submodule }),
      };
      const baseURL = process.env.REACT_APP_BASE_REF_DATA_URL;
      const endpoint = '/v1/form/profile';
      try {
        const response = await makePostRequest(baseURL, endpoint, payload);
  
        if (response.statusCode === 2000) {
          // Parse the response data and store it in the state
          setFields(response.data.map(parseField));
        } else {
          setError(response.message || 'Failed to load form fields');
        }
      } catch (err) {
        console.error('Error fetching form fields:', err);
        setError('Failed to fetch form fields');
      } finally {
        setLoading(false);
      }
    };
  
    fetchFields();
  }, [module, submodule]); // Dependency array ensures the call runs only when module/submodule changes

  useEffect(() => {
    if (profileData) {
      const updatedFormData = {};
      fields.forEach((field) => {
        const value = resolveNestedValue(profileData, field.fieldName) || '';
        resolveNestedValue(updatedFormData, field.fieldName, value);
      });
      setFormData(updatedFormData);
    }
  }, [profileData, fields]);

  const handleFieldChange = (e, field) => {
    const { value } = e.target;
    const updatedFormData = { ...formData };

    // Update nested field values correctly
    resolveNestedValue(updatedFormData, field.fieldName, value);
    setFormData(updatedFormData);

    // Check if any form data has changed to enable/disable the submit button
    const isFormChanged = fields.some((field) => {
      const originalValue = resolveNestedValue(profileData, field.fieldName) || '';
      const currentValue = resolveNestedValue(updatedFormData, field.fieldName);
      return originalValue !== currentValue;
    });
    setIsSubmitEnabled(isFormChanged);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form's default submission behavior

    const customerId = Cookies.get('customerId'); // Get customerId from cookies
  
    if (!customerId) {
      console.error('Customer ID not found.');
      setError('Customer ID not found.');
      return;
    }
  
    // Ensure customerId is explicitly included in the payload
    const payload = {
      customerId, 
      ...formData, 
    };
  
    const baseURL = process.env.REACT_APP_BASE_PROFILE_URL;
    const endpoint = "/v1/update/customer/details";

    try {
      const response = await makePostRequest(baseURL, endpoint, payload);
  
      if (response.statusCode === 2000) {
        setModalMessage('Successfully updated customer details');
        setIsModalVisible(true); 
      } else {
        setModalMessage(`Error: ${response.message}`);
        setIsModalVisible(true); 
      }
    } catch (err) {
      console.error('Error during form submission:', err);
      setModalMessage('Failed to update customer details');
      setIsModalVisible(true); 
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); 
    setModalMessage(''); 
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <form className="dynamic-form" onSubmit={handleSubmit}>
        {fields
          .filter(field => field.isDisplay) // Filter out fields where isDisplay is false
          .map((field) => (
          <div className="form-group" key={field.id}>
            <label htmlFor={field.fieldName}>{field.displayName}</label>
            <input
              type={field.inputType || 'text'} 
              id={field.fieldName}
              name={field.fieldName}
              placeholder={field.placeholder}
              value={resolveNestedValue(formData, field.fieldName) || ''} 
              onChange={(e) => handleFieldChange(e, field)}
              disabled={!field.isEditable}
            />
          </div>
        ))}
        <button 
          type="submit" 
          className="submit-button" 
          disabled={!isSubmitEnabled} 
        >
          Submit
        </button>
      </form>

      {isModalVisible && (
        <MessageModal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
};

DynamicForm.propTypes = {
  module: PropTypes.string.isRequired,
  submodule: PropTypes.string,
  profileData: PropTypes.object,
  customerId: PropTypes.string.isRequired,
};

export default React.memo(DynamicForm);
