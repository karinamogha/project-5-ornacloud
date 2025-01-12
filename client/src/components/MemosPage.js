// src/components/MemosPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "./UserContext";       // <-- Import your user context
import { useNavigate, Link } from "react-router-dom"; // <-- Import useNavigate and Link
import '../index.css'; // Import global styles if needed

function MemosPage() {
  const { signedIn } = useUser();          // <-- Grab signedIn from context
  const navigate = useNavigate();          // <-- For navigation

  const [memos, setMemos] = useState([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to SignIn if not signed in
  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    }
  }, [signedIn, navigate]);

  // Fetch memos from the backend
  const fetchMemos = async () => {
    if (!company) {
      setError('Please enter a company name to search.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/memos`, {
        params: { company },
        withCredentials: true, // Include credentials (cookies)
      });
      setMemos(response.data);
    } catch (err) {
      setError('Failed to fetch memos. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch whenever 'company' changes via manual search
  // No need to auto-fetch on company change; user initiates search
  // Remove the following useEffect if not needed
  /*
  useEffect(() => {
    if (company) fetchMemos();
  }, [company]);
  */

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memo?')) {
      try {
        const response = await axios.delete(`/api/memos/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          alert('Memo deleted successfully!');
          // Refresh the memos list
          setMemos(memos.filter(memo => memo.id !== id));
        } else {
          throw new Error('Error deleting memo');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Error deleting memo. Please try again.');
        }
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Existing Memos</h1>

      <div className="existing-search-form">
        <input
          type="text"
          placeholder="Search by Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="existing-search-input"
        />
        <button onClick={fetchMemos} className="existing-search-button">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}

      <ul className="list-container">
        {memos.map((memo) => (
          <li key={memo.id} className="list-item">
            <h3>{memo.title}</h3>
            <p>Memo Number: {memo.memo_number}</p>
            <p>Expiry Date: {memo.expiry_date}</p>
            <p>Company: {memo.company}</p>
            <div className="action-buttons">
              <Link to={`/memos/${memo.id}/edit`}>
                <button className="edit-button">Edit</button>
              </Link>
              <button
                onClick={() => handleDelete(memo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Optionally, add a button to create a new memo */}
      <Link to="/create-memo">
        <button className="create-button">Create New Memo</button>
      </Link>
    </div>
  );
}

export default MemosPage;





