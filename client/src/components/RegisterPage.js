import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; // Import global styles if needed

function RegisterPage() {
  const [formValues, setFormValues] = useState({
    name: '',
    lastname: '',
    username: '',
    password: '',
    category: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    username: '',
    password: '',
    category: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    lastname: false,
    username: false,
    password: false,
    category: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    validateForm(name);
  };

  const validateForm = (name) => {
    if (name === 'name' && !formValues.name) {
      setErrors(prevErrors => ({
        ...prevErrors,
        name: 'Name is required'
      }));
    } else if (name === 'lastname' && !formValues.lastname) {
      setErrors(prevErrors => ({
        ...prevErrors,
        lastname: 'Last name is required'
      }));
    } else if (name === 'username') {
      if (!formValues.username) {
        setErrors(prevErrors => ({
          ...prevErrors,
          username: 'Username is required'
        }));
      } else if (formValues.username.length < 5) {
        setErrors(prevErrors => ({
          ...prevErrors,
          username: 'Username must be at least 5 characters'
        }));
      }
    } else if (name === 'password') {
      if (!formValues.password) {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: 'Password is required'
        }));
      } else if (formValues.password.length < 8) {
        setErrors(prevErrors => ({
          ...prevErrors,
          password: 'Password must be at least 8 characters'
        }));
      }
    } else if (name === 'category' && !formValues.category) {
      setErrors(prevErrors => ({
        ...prevErrors,
        category: 'Category is required'
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    validateForm('name');
    validateForm('lastname');
    validateForm('username');
    validateForm('password');
    validateForm('category');

    if (!Object.values(errors).some(error => error)) {
      try {
        await axios.post('http://localhost:5555/api/register', formValues);
        alert('Registration successful!');
      } catch (error) {
        alert(error.response.data.error || 'Registration failed.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        name="name"
        placeholder="Name"
        value={formValues.name}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-input"
      />
      {touched.name && errors.name && <div className="form-error">{errors.name}</div>}

      <input
        name="lastname"
        placeholder="Last Name"
        value={formValues.lastname}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-input"
      />
      {touched.lastname && errors.lastname && <div className="form-error">{errors.lastname}</div>}

      <input
        name="username"
        placeholder="Username"
        value={formValues.username}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-input"
      />
      {touched.username && errors.username && <div className="form-error">{errors.username}</div>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formValues.password}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-input"
      />
      {touched.password && errors.password && <div className="form-error">{errors.password}</div>}

      <select
        name="category"
        value={formValues.category}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-select"
      >
        <option value="">Select Category</option>
        <option value="wholesale">Wholesale</option>
        <option value="designer">Designer</option>
        <option value="individual">Individual</option>
        <option value="other">Other</option>
      </select>
      {touched.category && errors.category && <div className="form-error">{errors.category}</div>}

      <button type="submit" className="form-button">Register</button>
    </form>
  );
}

export default RegisterPage;

