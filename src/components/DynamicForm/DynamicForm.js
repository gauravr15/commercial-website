import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makePostRequest } from '../../utility/RestCallUtility'; // Import the utility function
import './DynamicForm.css'; // Import CSS for styling the form

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
});

const DynamicForm = ({ module, submodule }) => {
  console.log(`Rendering DynamicForm Component with module: ${module}, submodule: ${submodule}`);
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false); // Ref to track if API call was already made

  // Fetch form fields on mount
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
        const response = await makePostRequest(baseURL, endpoint, payload, {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`,
            appLang: 'en',
            requestTimestamp: new Date().getTime(),
          },
        });
  
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Function to validate input against the regex pattern
  const validateInput = (field, value) => {
    if (field.regex) {
      const regex = new RegExp(field.regex);
      return regex.test(value);
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add further form submission logic if necessary
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.id}>
          <label htmlFor={field.fieldName}>{field.displayName}</label>
          <input
            type={field.inputType || 'text'} // Use inputType or default to text
            id={field.fieldName}
            name={field.fieldName}
            placeholder={field.placeholder}
            value={formData[field.fieldName] || ''}
            onChange={(e) => {
              const { value } = e.target;
              if (validateInput(field, value)) {
                setFormData({ ...formData, [field.fieldName]: value });
              }
            }}
            disabled={!field.isEditable}
          />
        </div>
      ))}
      <button type="submit" className="submit-button" disabled>
        Submit (Disabled)
      </button>
    </form>
  );
};

DynamicForm.propTypes = {
  module: PropTypes.string.isRequired,
  submodule: PropTypes.string,
};

export default React.memo(DynamicForm); // Use React.memo to prevent unnecessary re-renders
