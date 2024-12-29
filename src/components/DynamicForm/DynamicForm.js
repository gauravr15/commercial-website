import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makePostRequest } from '../../utility/RestCallUtility'; // Import the utility function
import './DynamicForm.css'; // Import CSS for styling the form

const DynamicForm = ({ module, submodule }) => {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch form fields on mount
  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      const payload = {
        module,
        ...(submodule && { submodule }), // Include submodule only if it is provided
      };
      const baseURL = process.env.REACT_APP_BASE_REF_DATA_URL; // Replace with the actual base URL
      const endpoint = '/v1/form/profile';
      try {
        const response = await makePostRequest(baseURL, endpoint, payload, {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with actual token
            appLang: 'en',
            requestTimestamp: new Date().getTime(),
          },
        });

        if (response.statusCode === 2000) {
          setFields(response.data);
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

  return (
    <form className="dynamic-form">
      {fields.map((field) => (
        <div className="form-group" key={field.id}>
          <label htmlFor={field.fieldName}>{field.displayName}</label>
          <input
            type="text"
            id={field.fieldName}
            name={field.fieldName}
            placeholder={field.placeholder}
            value={formData[field.fieldName] || ''}
            onChange={(e) =>
              setFormData({ ...formData, [field.fieldName]: e.target.value })
            }
            disabled={!field.userEditable}
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

export default DynamicForm;
