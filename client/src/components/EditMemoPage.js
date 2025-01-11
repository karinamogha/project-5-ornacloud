// src/components/EditMemoPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditMemoPage() {
  const { memoId } = useParams(); // dynamic param from URL
  const navigate = useNavigate();

  const [memo, setMemo] = useState({
    title: '',
    memo_number: '',
    expiry_date: '',
    wholesaler_details: '',
    buyer_details: '',
    items: '',
    total_value: '',
    remarks: '',
    company: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch the existing memo from your Flask endpoint /api/memos/:memoId
  useEffect(() => {
    fetch(`/api/memos/${memoId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load memo');
        }
        return res.json();
      })
      .then((data) => {
        // If your backend does NOT return `email`, default it or remove that field
        setMemo({
          title: data.title || '',
          memo_number: data.memo_number || '',
          expiry_date: data.expiry_date || '',
          wholesaler_details: data.wholesaler_details || '',
          buyer_details: data.buyer_details || '',
          items: data.items || '',
          total_value: data.total_value || '',
          remarks: data.remarks || '',
          company: data.company || '',
          email: '', // or data.email if your backend stores it
        });
      })
      .catch((err) => setError(err.message));
  }, [memoId]);

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemo((prevMemo) => ({
      ...prevMemo,
      [name]: value,
    }));
  };

  // 2. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Patch request to update the memo
    fetch(`/api/memos/${memoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(memo),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update memo');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Memo updated:', data);
        // redirect back to memos or anywhere you want
        navigate('/memos');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (error) return <div>Error: {error}</div>;
  if (!memo) return <div>Loading...</div>;

  return (
    <div className="create-page">
      <h2>Edit Memo {memoId}</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter the title"
            value={memo.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Memo Number */}
        <div className="row">
          <label htmlFor="memo_number">Memo Number</label>
          <input
            type="text"
            name="memo_number"
            placeholder="Enter memo number"
            value={memo.memo_number}
            onChange={handleChange}
            required
          />
        </div>

        {/* Expiry Date */}
        <div className="row">
          <label htmlFor="expiry_date">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={memo.expiry_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Wholesaler Details */}
        <div className="row">
          <label htmlFor="wholesaler_details">Wholesaler Details</label>
          <textarea
            name="wholesaler_details"
            placeholder="Enter wholesaler details"
            value={memo.wholesaler_details}
            onChange={handleChange}
            required
          />
        </div>

        {/* Buyer Details */}
        <div className="row">
          <label htmlFor="buyer_details">Buyer Details</label>
          <textarea
            name="buyer_details"
            placeholder="Enter buyer details"
            value={memo.buyer_details}
            onChange={handleChange}
            required
          />
        </div>

        {/* Items */}
        <div className="row">
          <label htmlFor="items">Items</label>
          <textarea
            name="items"
            placeholder="Enter items"
            value={memo.items}
            onChange={handleChange}
            required
          />
        </div>

        {/* Total Value */}
        <div className="row">
          <label htmlFor="total_value">Total Value</label>
          <input
            type="number"
            name="total_value"
            placeholder="Enter total value"
            value={memo.total_value}
            onChange={handleChange}
            required
          />
        </div>

        {/* Remarks */}
        <div className="row">
          <label htmlFor="remarks">Remarks</label>
          <textarea
            name="remarks"
            placeholder="Enter remarks"
            value={memo.remarks}
            onChange={handleChange}
          />
        </div>

        {/* Company */}
        <div className="row">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            name="company"
            placeholder="Enter company name"
            value={memo.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* Client Email */}
        <div className="row">
          <label htmlFor="email">Client Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter client email"
            value={memo.email}
            onChange={handleChange}
          />
        </div>

        {/* Display Error Message */}
        {error && <div className="form-error">{error}</div>}

        {/* Form Buttons */}
        <div className="form-buttons">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={() => navigate('/memos')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMemoPage;



