import React, { useState } from 'react';
import axios from 'axios';

function CreateInvoicePage() {
  const [formValues, setFormValues] = useState({
    title: '',
    invoice_number: '',
    wholesaler_details: '',
    buyer_details: '',
    items: '',
    total_value: '',
    company: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5555/api/invoices', formValues);
      alert('Invoice created and email sent!');
    } catch (error) {
      alert('Error creating invoice');
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
            name="title"
            placeholder="Title"
            value={formValues.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Invoice Number */}
        <div className="row">
          <label htmlFor="invoice_number">Invoice Number</label>
          <input
            name="invoice_number"
            placeholder="Invoice Number"
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
            placeholder="Wholesaler Details"
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
            placeholder="Buyer Details"
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
            placeholder="Items"
            value={formValues.items}
            onChange={handleChange}
            required
          />
        </div>

        {/* Total Value */}
        <div className="row">
          <label htmlFor="total_value">Total Value</label>
          <input
            name="total_value"
            type="number"
            placeholder="Total Value"
            value={formValues.total_value}
            onChange={handleChange}
            required
          />
        </div>

        {/* Company */}
        <div className="row">
          <label htmlFor="company">Company</label>
          <input
            name="company"
            placeholder="Company"
            value={formValues.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* Client Email */}
        <div className="row">
          <label htmlFor="email">Client Email</label>
          <input
            name="email"
            type="email"
            placeholder="Client Email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoicePage;


