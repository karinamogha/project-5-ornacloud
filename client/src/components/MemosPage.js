import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css'; // Import global styles if needed

function MemosPage() {
  const [memos, setMemos] = useState([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Memos
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

  return (
    <div className="page-container">
      <h1>Existing Memos</h1>

      {/* Centered single-line search bar */}
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

