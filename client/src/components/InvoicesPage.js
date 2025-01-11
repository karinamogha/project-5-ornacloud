// src/components/InvoicesPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from "./UserContext";
import { useNavigate, Link } from "react-router-dom";
import '../index.css'; // Import global styles if needed

function InvoicesPage() {
  const { signedIn } = useUser();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to SignIn if not signed in
  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    }
  }, [signedIn, navigate]);

  // Fetch invoices from the backend
  const fetchInvoices = async () => {
    if (!company) {
      setError('Please enter a company name to search.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/invoices?company=${encodeURIComponent(company)}`, {
        credentials: 'include', 
      });
      if (!res.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // DELETE an invoice by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to delete invoice');
      }
      // If successful, remove it from state
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      alert('Invoice deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Existing Invoices</h1>

      <div className="existing-search-form">
        <input
          type="text"
          placeholder="Search by Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="existing-search-input"
        />
        <button onClick={fetchInvoices} className="existing-search-button">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}

      <ul className="list-container">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="list-item">
            <h3>{invoice.title}</h3>
            <p>Invoice Number: {invoice.invoice_number}</p>
            <p>Total Value: {invoice.total_value}</p>
            <p>Company: {invoice.company}</p>

            {/* Action buttons for Edit & Delete */}
            <div className="action-buttons">
              <Link to={`/invoices/${invoice.id}/edit`}>
                <button className="edit-button">Edit</button>
              </Link>
              <button
                onClick={() => handleDelete(invoice.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Create New Invoice Button */}
      <Link to="/create-invoice">
        <button className="create-button">Create New Invoice</button>
      </Link>
    </div>
  );
}

export default InvoicesPage;






