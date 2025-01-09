import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function Signin() {
  const { setSignedIn, setUser } = useUser();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    name: '',
    lastname: '', // Added lastname field
    age: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from the backend
  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategories([
          { id: 1, name: 'Wholesale' },
          { id: 2, name: 'Designer' },
          { id: 3, name: 'Individual' },
          { id: 4, name: 'Other' },
        ]);
        setLoadingCategories(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    validateForm(name);
  };

  const validateForm = (name) => {
    let error = "";
    if (name === 'username' && !formValues.username) {
      error = "Username is required.";
    } else if (name === 'password' && !formValues.password) {
      error = "Password is required.";
    } else if (name === 'name' && isSignup && !formValues.name) {
      error = "Name is required.";
    } else if (name === 'lastname' && isSignup && !formValues.lastname) {
      error = "Last name is required.";
    } else if (name === 'age' && isSignup && !formValues.age) {
      error = "Age is required.";
    } else if (name === 'category' && isSignup && !formValues.category) {
      error = "Category is required.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['username', 'password'];
    if (isSignup) {
      requiredFields.push('name', 'lastname', 'age', 'category');
    }
    requiredFields.forEach(validateForm);

    if (Object.values(errors).some((error) => error)) {
      console.error("Form validation failed:", errors);
      return;
    }

    console.log("Submitting form values:", formValues); // Debug log

    const endpoint = isSignup ? '/signup' : '/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const user = await response.json();
        setSignedIn(true);
        setUser(user);
        alert(isSignup ? "Account created successfully!" : "Login successful!");
        navigate('/');
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
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
                lastname: '',
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
                lastname: '',
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
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formValues.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.username && errors.username && <div>{errors.username}</div>}
        </div>

        <div className="row">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && <div>{errors.password}</div>}
        </div>

        {isSignup && (
          <>
            <div className="row">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formValues.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.name && errors.name && <div>{errors.name}</div>}
            </div>

            <div className="row">
              <label htmlFor="lastname">Last Name:</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formValues.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.lastname && errors.lastname && <div>{errors.lastname}</div>}
            </div>

            <div className="row">
              <label htmlFor="age">Age:</label>
              <input
                id="age"
                name="age"
                type="number"
                value={formValues.age}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.age && errors.age && <div>{errors.age}</div>}
            </div>

            <div className="row">
              <label htmlFor="category">Category:</label>
              {loadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                <select
                  id="category"
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
              {touched.category && errors.category && <div>{errors.category}</div>}
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

export default Signin;




