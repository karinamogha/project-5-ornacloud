// src/components/InvoicesPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from "./UserContext";
import { useNavigate, Link } from "react-router-dom";
import '../index.css';

function InvoicesPage() {
  const { signedIn } = useUser();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    } else {
      fetchInvoices(); // load all invoices on mount
    }
  }, [signedIn, navigate]);

  const fetchInvoices = async (searchCompany) => {
    setLoading(true);
    setError('');
    try {
      let url = '/invoices';
      if (searchCompany) {
        url += `?company=${encodeURIComponent(searchCompany)}`;
      }

      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!company) {
      fetchInvoices();      // if no company, fetch all
    } else {
      fetchInvoices(company);
    }
  };

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
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      alert('Invoice deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Existing Invoices</h1>

      {/* Search Bar */}
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

      {/* 
         Instead of .list-container / .list-item,
         use .cards (a grid) & .card (a box), 
         which are defined in your CSS.
      */}
      <ul className="cards invoice-list">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="card invoice-card">
            <h3 className="card-title">{invoice.title}</h3>
            <p className="card-content">
              <span className="item-label">Invoice Number:</span> {invoice.invoice_number}
            </p>
            <p className="card-content">
              <span className="item-label">Total Value:</span> {invoice.total_value}
            </p>
            <p className="card-content">
              <span className="item-label">Company:</span> {invoice.company}
            </p>

            <div className="action-buttons" style={{ marginTop: '1rem' }}>
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

      <Link to="/create-invoice">
        <button className="create-button">Create New Invoice</button>
      </Link>
    </div>
  );
}

export default InvoicesPage;








