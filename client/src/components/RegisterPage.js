import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1) Import Formik (or specifically useFormik)
import { useFormik } from "formik";

function RegisterPage() {
  const navigate = useNavigate();

  // 2) Initialize a simple Formik instance 
  const formik = useFormik({
    initialValues: { placeholder: "" },
    onSubmit: values => {
      console.log("Formik submitted: ", values);
    }
  });

  useEffect(() => {
    // Automatically redirect to '/signin' with query param
    navigate("/signin?mode=signup");
  }, [navigate]);

  return (
    <div>
      <h2>Redirecting to Sign Up...</h2>
    </div>
  );
}

export default RegisterPage;



