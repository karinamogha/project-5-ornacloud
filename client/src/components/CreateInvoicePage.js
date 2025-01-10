import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext"; // Ensure this context provides `signedIn`

function CreateInvoicePage() {
  const { signedIn } = useUser();    // Check if the user is signed in
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    title: '',
    invoice_number: '',
    wholesaler_details: '',
    buyer_details: '',
    items: '',
    total_value: '',
    company: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);    // Loading state
  const [error, setError] = useState('');           // Error message

  // Redirect to SignIn if not signed in
  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    }
  }, [signedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);    // Start loading
    setError('');        // Reset error message

    try {
      const response = await fetch('http://localhost:5555/invoices', { // Ensure endpoint matches backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Include credentials (cookies)
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        alert('Invoice created and email sent!');
        navigate('/invoices'); // Redirect to Invoices Page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating invoice');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="create-page">
      <h2>Create a New Invoice</h2>
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

        {/* Invoice Number */}
        <div className="row">
          <label htmlFor="invoice_number">Invoice Number</label>
          <input
            type="text"
            name="invoice_number"
            placeholder="Enter invoice number"
            value={formValues.invoice_number}
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
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
          <Link to="/invoices">
            <button type="button" className="submit-button">
              Back to Invoices
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoicePage;



