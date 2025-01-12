import React from "react";
import { Link } from 'react-router-dom';
import { useUser } from "./UserContext";  // Assuming useUser context for signed-in state

function HomePage() {
  const { signedIn } = useUser();  // Get the signed-in state

  return (
    <div className="home">
      <section className="section-title">
        <h1 className="title">Welcome to Orna Cloud</h1>
        <h2 className="title-h2">Efficiently Manage Your Memos and Invoices</h2>
      </section>

      <section>
        <h2 className="section-header">Manage Memos and Invoices</h2>
        <p>
          Orna Cloud makes it easy to keep track of your memos and invoices in one place. 
          Whether you're a wholesaler, designer, or individual, we offer a seamless platform to create, store, and manage all your business documents.
        </p>
        <Link to='/memos'>
          <button className="submit-button">View Memos</button>
        </Link>
        <Link to='/invoices'>
          <button className="submit-button">View Invoices</button>
        </Link>
      </section>

      <section>
        <h2 className="section-header">Create a New Memo or Invoice</h2>
        <p>
          Creating a memo or invoice has never been easier. Our user-friendly platform lets you generate memos and invoices quickly and accurately. 
          You can send them directly to your clients and keep a record in your personal folder for easy access.
        </p>
        <Link to='/create-memo'>
          <button className="submit-button">Create Memo</button>
        </Link>
        <Link to='/create-invoice'>
          <button className="submit-button">Create Invoice</button>
        </Link>
      </section>

      <section>
        <h2 className="section-header">Access Your Account</h2>
        <p>
          If you are already a member, sign in to access your account and start managing your memos, invoices, and more. 
          If you’re new, feel free to register and get started.
        </p>
        {!signedIn ? (
          <Link to='/signin'>
            <button className="submit-button">Sign In</button>
          </Link>
        ) : null}
      </section>

      <section>
        <h2 className="section-header">Get Started</h2>
        <p>
          Whether you're a wholesaler, designer, or individual, Orna Cloud provides a tailored solution to help you keep your business organized. 
          Sign up today and start creating and managing your memos and invoices effortlessly!
        </p>
        {!signedIn ? (
          <Link to='/register'>
            <button className="submit-button">Register</button>
          </Link>
        ) : null}
      </section>
    </div>
  );
}

export default HomePage;


