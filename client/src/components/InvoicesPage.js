// src/components/InvoicesPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from "./UserContext";
import { useNavigate, Link } from "react-router-dom";
import '../index.css'; // Import global styles if needed

function InvoicesPage() {
  const { signedIn } = useUser();    // Check if user is signed in
  const navigate = useNavigate();    // For navigation

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
      // Our Flask route is GET /invoices?company=...
      const res = await fetch(`/invoices?company=${encodeURIComponent(company)}`, {
        credentials: 'include', // So the session cookie is sent
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

  // If you wanted to auto-fetch whenever 'company' changes:
  // useEffect(() => {
  //   if (company) fetchInvoices();
  // }, [company]);

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

            {/* 
              If you ever add "Edit Invoice" or "Delete Invoice" 
              endpoints, you can replicate Memos' action buttons:
              
              <div className="action-buttons">
                <Link to={`/invoices/${invoice.id}/edit`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button onClick={() => handleDelete(invoice.id)}>
                  Delete
                </button>
              </div>
            */}
          </li>
        ))}
      </ul>

      {/* Optionally, add a button to create a new invoice */}
      <Link to="/create-invoice">
        <button className="create-button">Create New Invoice</button>
      </Link>
    </div>
  );
}

export default InvoicesPage;





