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
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={formValues.title}
        onChange={handleChange}
      />
      <input
        name="invoice_number"
        placeholder="Invoice Number"
        value={formValues.invoice_number}
        onChange={handleChange}
      />
      <textarea
        name="wholesaler_details"
        placeholder="Wholesaler Details"
        value={formValues.wholesaler_details}
        onChange={handleChange}
      />
      <textarea
        name="buyer_details"
        placeholder="Buyer Details"
        value={formValues.buyer_details}
        onChange={handleChange}
      />
      <textarea
        name="items"
        placeholder="Items"
        value={formValues.items}
        onChange={handleChange}
      />
      <input
        name="total_value"
        placeholder="Total Value"
        value={formValues.total_value}
        onChange={handleChange}
      />
      <input
        name="company"
        placeholder="Company"
        value={formValues.company}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Client Email"
        value={formValues.email}
        onChange={handleChange}
      />
      <button type="submit">Create Invoice</button>
    </form>
  );
}

export default CreateInvoicePage;

