// src/components/EditInvoicePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditInvoicePage() {
  const { invoiceId } = useParams(); // dynamic param from URL
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    title: '',
    invoice_number: '',
    wholesaler_details: '',
    buyer_details: '',
    items: '',
    total_value: '',
    company: '',
    // No 'email' typically stored for invoice itself, 
    // but you can add if needed
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch the existing invoice from your Flask endpoint /api/invoices/:invoiceId
  useEffect(() => {
    setLoading(true);
    fetch(`/api/invoices/${invoiceId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load invoice');
        }
        return res.json();
      })
      .then((data) => {
        setInvoice({
          title: data.title || '',
          invoice_number: data.invoice_number || '',
          wholesaler_details: data.wholesaler_details || '',
          buyer_details: data.buyer_details || '',
          items: data.items || '',
          total_value: data.total_value || '',
          company: data.company || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [invoiceId]);

  // 2. Handle form submission (PATCH)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch(`/api/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(invoice),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update invoice');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Invoice updated:', data);
        alert('Invoice updated successfully!');
        navigate('/invoices'); // redirect to the Invoices page
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="create-page">
      <h2>Edit Invoice {invoiceId}</h2>
      <form onSubmit={handleSubmit}>

        {/* Title */}
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={invoice.title}
            onChange={(e) => setInvoice({ ...invoice, title: e.target.value })}
            required
          />
        </div>

        {/* Invoice Number */}
        <div className="row">
          <label htmlFor="invoice_number">Invoice Number</label>
          <input
            type="text"
            name="invoice_number"
            value={invoice.invoice_number}
            onChange={(e) =>
              setInvoice({ ...invoice, invoice_number: e.target.value })
            }
            required
          />
        </div>

        {/* Wholesaler Details */}
        <div className="row">
          <label htmlFor="wholesaler_details">Wholesaler Details</label>
          <textarea
            name="wholesaler_details"
            value={invoice.wholesaler_details}
            onChange={(e) =>
              setInvoice({ ...invoice, wholesaler_details: e.target.value })
            }
            required
          />
        </div>

        {/* Buyer Details */}
        <div className="row">
          <label htmlFor="buyer_details">Buyer Details</label>
          <textarea
            name="buyer_details"
            value={invoice.buyer_details}
            onChange={(e) =>
              setInvoice({ ...invoice, buyer_details: e.target.value })
            }
            required
          />
        </div>

        {/* Items */}
        <div className="row">
          <label htmlFor="items">Items</label>
          <textarea
            name="items"
            value={invoice.items}
            onChange={(e) =>
              setInvoice({ ...invoice, items: e.target.value })
            }
            required
          />
        </div>

        {/* Total Value */}
        <div className="row">
          <label htmlFor="total_value">Total Value</label>
          <input
            type="number"
            name="total_value"
            value={invoice.total_value}
            onChange={(e) =>
              setInvoice({ ...invoice, total_value: e.target.value })
            }
            required
          />
        </div>

        {/* Company */}
        <div className="row">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            name="company"
            value={invoice.company}
            onChange={(e) =>
              setInvoice({ ...invoice, company: e.target.value })
            }
            required
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-buttons">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Invoice'}
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={() => navigate('/invoices')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInvoicePage;
