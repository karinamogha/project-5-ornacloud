// src/components/MemosPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from "./UserContext";
import { useNavigate, Link } from "react-router-dom";
import '../index.css'; 

function MemosPage() {
  const { signedIn } = useUser();
  const navigate = useNavigate();

  const [memos, setMemos] = useState([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    } else {
      fetchMemos(); // load all memos
    }
  }, [signedIn, navigate]);

  const fetchMemos = async (searchCompany) => {
    setLoading(true);
    setError('');
    try {
      let url = '/memos';
      if (searchCompany) {
        url += `?company=${encodeURIComponent(searchCompany)}`;
      }

      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch memos');
      }
      const data = await response.json();
      setMemos(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch memos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!company) {
      fetchMemos(); // all memos
    } else {
      fetchMemos(company);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memo?')) {
      try {
        const response = await fetch(`/api/memos/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error deleting memo');
        }
        setMemos((prev) => prev.filter((memo) => memo.id !== id));
        alert('Memo deleted successfully!');
      } catch (error) {
        alert(error.message);
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
        <button onClick={handleSearch} className="existing-search-button">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}

      {/* Turn each memo into a "card" */}
      <ul className="cards memo-list">
        {memos.map((memo) => (
          <li key={memo.id} className="card memo-card">
            <h3 className="card-title">{memo.title}</h3>
            <p className="card-content">
              <span className="item-label">Memo Number:</span> {memo.memo_number}
            </p>
            <p className="card-content">
              <span className="item-label">Expiry Date:</span> {memo.expiry_date}
            </p>
            <p className="card-content">
              <span className="item-label">Company:</span> {memo.company}
            </p>
            
            <div className="action-buttons" style={{ marginTop: '1rem' }}>
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

      <Link to="/create-memo">
        <button className="create-button">Create New Memo</button>
      </Link>
    </div>
  );
}

export default MemosPage;





