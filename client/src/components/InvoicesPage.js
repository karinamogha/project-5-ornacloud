import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css'; // Import global styles if needed

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5555/api/invoices/${company}`);
      setInvoices(response.data);
    } catch (err) {
      setError('Failed to fetch invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) fetchInvoices();
  }, [company]);

  return (
    <div className="page-container">
      <h1>Existing Invoices</h1>
      <input
        type="text"
        placeholder="Search by Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="form-input"
      />
      <button onClick={fetchInvoices} className="form-button">Search</button>
      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}
      <ul className="list-container">
        {invoices.map((invoice) => (
          <li key={invoice.invoice_number} className="list-item">
            <h3>{invoice.title}</h3>
            <p>Invoice Number: {invoice.invoice_number}</p>
            <p>Total Value: {invoice.total_value}</p>
            <p>Company: {invoice.company}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InvoicesPage;
