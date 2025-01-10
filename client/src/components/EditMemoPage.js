import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from "./UserContext";

function EditMemoPage() {
  const { signedIn } = useUser(); // Check if the user is signed in
  const navigate = useNavigate();
  const { id } = useParams(); // Get the memo ID from the URL

  const [formValues, setFormValues] = useState({
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the existing memo details
  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    } else {
      setLoading(true);
      fetch(`/api/memos/${id}`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('Failed to fetch memo details.');
        })
        .then((data) => {
          setFormValues(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [signedIn, navigate, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        alert('Memo updated successfully!');
        navigate('/memos');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update memo.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this memo?')) {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/memos/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          alert('Memo deleted successfully!');
          navigate('/memos');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete memo.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="edit-page">
      <h2>Edit Memo</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleUpdate}>
          {/* Title */}
          <div className="row">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter the title"
              value={formValues.title}
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
              value={formValues.memo_number}
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
              value={formValues.expiry_date}
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
              value={formValues.wholesaler_details}
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
              value={formValues.buyer_details}
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
              value={formValues.items}
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
              value={formValues.total_value}
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
              value={formValues.remarks}
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
              value={formValues.company}
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
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Display Error Message */}
          {error && <div className="form-error">{error}</div>}

          {/* Form Buttons */}
          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Memo'}
            </button>
            <button
              type="button"
              className="submit-button delete-button"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Memo'}
            </button>
            <Link to="/memos">
              <button type="button" className="submit-button">
                Back to Memos
              </button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditMemoPage;

