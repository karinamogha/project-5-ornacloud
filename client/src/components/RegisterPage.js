import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to '/signin' with some indicator to enable signup mode
    // We'll use a query param like "?mode=signup"
    navigate("/signin?mode=signup");
  }, [navigate]);

  return (
    <div>
      <h2>Redirecting to Sign Up...</h2>
    </div>
  );
}

export default RegisterPage;


