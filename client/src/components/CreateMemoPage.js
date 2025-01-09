import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";

function CreateMemoPage() {
  const { signedIn } = useUser();       // Check if the user is signed in
  const navigate = useNavigate();

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

  // If not signed in, redirect to "/signin"
  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    }
  }, [signedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5555/memos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => {
        if (response.ok) {
          alert('Memo created and email sent!');
          navigate('/memos');
        } else {
          throw new Error('Error creating memo');
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="create-page">
      <h2>Create a New Memo</h2>
      <form onSubmit={handleSubmit}>
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

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Create Memo
          </button>
          <Link to="/memos">
            <button type="button" className="submit-button">
              Back to Memos
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateMemoPage;




