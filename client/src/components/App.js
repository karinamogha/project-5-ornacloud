import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Ensure useNavigate is properly imported
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useUser } from "./UserContext";

function App() {
  const { user, signedIn, setSignedIn, setUser } = useUser();
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Fetch memos and invoices for the logged-in user when the component mounts
  useEffect(() => {
    if (signedIn && user?.id) {
      // Fetch future memos for the logged-in user
      fetch(`http://localhost:5555/api/memos/${user.id}/future`)
        .then((resp) => resp.json())
        .then((data) => {
          setMemos(data);
        })
        .catch((error) => console.error("Error fetching memos", error));

      // Fetch future invoices for the logged-in user
      fetch(`http://localhost:5555/api/invoices/${user.id}/future`)
        .then((resp) => resp.json())
        .then((data) => {
          setInvoices(data);
        })
        .catch((error) => console.error("Error fetching invoices", error));

      // Fetch companies that user has memos or invoices for
      fetch(`http://localhost:5555/api/companies/${user.id}`)
        .then((resp) => resp.json())
        .then((data) => {
          setCompanies(data);
        })
        .catch((error) => console.error("Error fetching companies", error));
    }
  }, [signedIn, user?.id]);

  // Handle logout
  const handleLogout = () => {
    fetch('/logout', { method: 'DELETE' })
      .then(() => {
        setSignedIn(false);
        setUser(null);
        navigate('/');
      })
      .catch((error) => console.error('Error logging out', error));
  };

  // Navigation: based on whether the user is signed in or not
  const navItems = signedIn
    ? [
        { label: 'Home', to: '/' },
        { label: 'Existing Memos', to: '/memos' },
        { label: 'Existing Invoices', to: '/invoices' },
        { label: 'Create Memo', to: '/create-memo' },
        { label: 'Create Invoice', to: '/create-invoice' },
        { label: 'Logout', to: '/', onClick: handleLogout }
      ]
    : [
        { label: 'Home', to: '/' },
        { label: 'Signin', to: '/signin' },
        { label: 'Register', to: '/register' }
      ];

  return (
    <div className="app">
      <Navbar navItems={navItems} />
      <div className="content">
        <Outlet context={{
          memos: memos,
          invoices: invoices,
          companies: companies,
          setMemos: setMemos,
          setInvoices: setInvoices,
          setCompanies: setCompanies,
          user: user, // passing the user data to child components
        }} />
      </div>
      <Footer />
    </div>
  );
}

export default App;








