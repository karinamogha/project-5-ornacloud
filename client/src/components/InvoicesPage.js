import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useUser } from "./UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../index.css"; // Assuming your main CSS file

function InvoicesPage() {
  const { user, signedIn, setSignedIn } = useUser(); // User context for authentication
  const { invoices, setInvoices } = useOutletContext(); // Shared state if needed
  const navigate = useNavigate();

  const [filteredInvoices, setFilteredInvoices] = React.useState([]);

  // Redirect to SignIn if not signed in
  useEffect(() => {
    if (!signedIn) {
      navigate("/signin");
    }
  }, [signedIn, navigate]);

  // Fetch invoices from the backend
  const fetchInvoices = async (company, setSubmitting, setErrors) => {
    try {
      const response = await fetch(`http://localhost:5555/api/invoices/${company}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredInvoices(data);
        setInvoices(data); // Optional: Update shared context state
      } else {
        setErrors({ company: "Failed to fetch invoices. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ company: "An error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // Formik initial values and validation schema
  const initialValues = { company: "" };
  const validationSchema = Yup.object({
    company: Yup.string().required("Please enter a company name to search."),
  });

  return (
    <div className="container">
      {!signedIn ? (
        <div>
          <h2>Please sign in to view invoices</h2>
          <button className="submit-button" onClick={() => navigate("/signin")}>
            Sign In
          </button>
        </div>
      ) : (
        <>
          <h1>Invoices</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              fetchInvoices(values.company, setSubmitting, setErrors);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="existing-search-form">
                {/* Company Input */}
                <Field
                  name="company"
                  type="text"
                  placeholder="Search by Company"
                  className="existing-search-input"
                />
                {/* Error Handling */}
                <ErrorMessage name="company" component="div" className="form-error" />
                
                {/* Search Button */}
                <button
                  type="submit"
                  className="existing-search-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Searching..." : "Search"}
                </button>
              </Form>
            )}
          </Formik>
          
          <ul className="list-container">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <li key={invoice.invoice_number} className="list-item">
                  <h3>{invoice.title}</h3>
                  <p>Invoice Number: {invoice.invoice_number}</p>
                  <p>Total Value: {invoice.total_value}</p>
                  <p>Company: {invoice.company}</p>
                </li>
              ))
            ) : (
              <p>No invoices found.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default InvoicesPage;


