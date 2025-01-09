import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "./UserContext";       // <-- Import your user context
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
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
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5555/api/memos/${company}`);
      setMemos(response.data);
    } catch (err) {
      setError('Failed to fetch memos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever 'company' changes
  useEffect(() => {
    if (company) fetchMemos();
  }, [company]);

  // If user is not signedIn, the `useEffect` above already redirects, 
  // so the page won't render the below UI for unauthorized users.

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
          <li key={memo.memo_number} className="list-item">
            <h3>{memo.title}</h3>
            <p>Memo Number: {memo.memo_number}</p>
            <p>Expiry Date: {memo.expiry_date}</p>
            <p>Company: {memo.company}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemosPage;


