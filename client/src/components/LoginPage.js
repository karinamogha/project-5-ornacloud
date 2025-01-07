import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function LoginPage() {
  const { setSignedIn, setUser } = useUser();
  const navigate = useNavigate();
  
  const [isSignup, setIsSignup] = useState(false); // Toggle between signup and login
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    name: '',
    age: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    name: false,
    age: false,
    category: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle input blur (focus lost)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    validateForm(name);
  };

  // Validate form fields
  const validateForm = (name) => {
    if (name === 'username' && !formValues.username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: 'Username is required',
      }));
    } else if (name === 'password' && !formValues.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password is required',
      }));
    } else if (name === 'name' && isSignup && !formValues.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name is required',
      }));
    } else if (name === 'age' && isSignup && !formValues.age) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        age: 'Age is required',
      }));
    } else if (name === 'category' && isSignup && !formValues.category) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category: 'Category is required',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    validateForm('username');
    validateForm('password');
    if (isSignup) {
      validateForm('name');
      validateForm('age');
      validateForm('category');
    }

    if (!Object.values(errors).some((error) => error)) {
      const endpoint = isSignup ? '/signup' : '/login';

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((user) => {
              setSignedIn(true);
              setUser(user);
              alert(isSignup ? "Account created successfully!" : "Login successful!");
              navigate('/');
            });
          } else {
            resp.json().then((data) => {
              alert(`Error: ${data.error}`);
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Something went wrong!');
        });
    }
  };

  return (
    <div className="container">
      {isSignup ? (
        <>
          <button
            className="submit-button"
            onClick={() => {
              setIsSignup(false);
              setFormValues({
                username: '',
                password: '',
                name: '',
                age: '',
                category: '',
              });
            }}
          >
            I already have an account
          </button>
          <h2>Register New User</h2>
        </>
      ) : (
        <>
          <button
            className="submit-button"
            onClick={() => {
              setIsSignup(true);
              setFormValues({
                username: '',
                password: '',
                name: '',
                age: '',
                category: '',
              });
            }}
          >
            I want to register an account
          </button>
          <h2>Login</h2>
        </>
      )}
      
      <form className="signin" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="username">Username:</label>
          </div>
          <div className="col-75">
            <input
              required
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={formValues.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.username && errors.username && (
              <div className="form-error">{errors.username}</div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="password">Password:</label>
          </div>
          <div className="col-75">
            <input
              required
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <div className="form-error">{errors.password}</div>
            )}
          </div>
        </div>

        {isSignup && (
          <>
            <div className="row">
              <div className="col-25">
                <label htmlFor="name">Name:</label>
              </div>
              <div className="col-75">
                <input
                  required
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formValues.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.name && errors.name && (
                  <div className="form-error">{errors.name}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-25">
                <label htmlFor="age">Age:</label>
              </div>
              <div className="col-75">
                <input
                  required
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Your Age"
                  min="18"
                  value={formValues.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.age && errors.age && (
                  <div className="form-error">{errors.age}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-25">
                <label htmlFor="category">Category:</label>
              </div>
              <div className="col-75">
                <select
                  required
                  id="category"
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select Category</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="designer">Designer</option>
                  <option value="individual">Individual</option>
                  <option value="other">Other</option>
                </select>
                {touched.category && errors.category && (
                  <div className="form-error">{errors.category}</div>
                )}
              </div>
            </div>
          </>
        )}

        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginPage;


