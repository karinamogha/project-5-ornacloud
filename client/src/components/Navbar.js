import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "./UserContext";

function Navbar() {
  const { signedIn, setSignedIn, setUser } = useUser();
  
  // Check if the user is signed in when the component mounts
  useEffect(() => {
    fetch('/check')
      .then((resp) => resp.json())
      .then((data) => {
        if (data?.id) {
          setSignedIn(true);
          setUser(data);
        } else {
          setSignedIn(false);
          setUser(null);
        }
      });
  }, [setSignedIn, setUser]);

  // Logout functionality
  function logout(e) {
    e.preventDefault();
    fetch('/logout', {
      method: 'DELETE'
    })
    .then(() => {
      setSignedIn(false);
      setUser(null);
    });
  }

  return (
    <header className="header">
      <span className="title-nav">OrnaCloud</span>
      <span className="headerlinks">
        {/* Navigation links */}
        <NavLink className="headerlink" to='/'>Home</NavLink>
        <NavLink className="headerlink" to='/memos'>Existing Memos</NavLink>
        <NavLink className="headerlink" to='/invoices'>Existing Invoices</NavLink>

        {/* Show Sign In or Logout based on user's signed-in status */}
        {!signedIn ? 
          (<NavLink className="headerlink" to='/signin'>Sign In</NavLink>) :
          (<NavLink className='headerlink' onClick={logout}>Logout</NavLink>)
        }

        {/* Conditional rendering for "My Listings" when signed in */}
        {signedIn && <NavLink className="headerlink" to='/my-listings'>My Listings</NavLink>}

        {/* Always show "Create Memo" and "Create Invoice" */}
        <NavLink className="headerlink" to='/create-memo'>Create Memo</NavLink>
        <NavLink className="headerlink" to='/create-invoice'>Create Invoice</NavLink>
      </span>
    </header>
  );
}

export default Navbar;


