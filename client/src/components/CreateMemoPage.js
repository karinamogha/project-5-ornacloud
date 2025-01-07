import React, { useState } from 'react';
import axios from 'axios';

function CreateMemoPage() {
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
      await axios.post('http://localhost:5555/api/memos', formValues);
      alert('Memo created and email sent!');
    } catch (error) {
      alert('Error creating memo');
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
        name="memo_number"
        placeholder="Memo Number"
        value={formValues.memo_number}
        onChange={handleChange}
      />
      <input
        name="expiry_date"
        placeholder="Expiry Date"
        value={formValues.expiry_date}
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
      <textarea
        name="remarks"
        placeholder="Remarks"
        value={formValues.remarks}
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
      <button type="submit">Create Memo</button>
    </form>
  );
}

export default CreateMemoPage;

