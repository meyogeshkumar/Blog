import React, { use, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../url/baseurl";
import Swal from "sweetalert2";

export const Login = () => {
  const navigater = useNavigate();
  useEffect(() => {
    sessionStorage.clear();
  }, []);
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [apierror, setApiError] = useState();

  const handlechange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    let newerror = {};
    if (!formdata.email.trim()) {
      newerror.email = "Email is required";
    }
    if (!formdata.password.trim()) {
      newerror.password = "Password is required";
    }
    setError(newerror);

    if (Object.keys(newerror).length > 0) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formdata.email,
          password: formdata.password,
        }),
      });
      const data = await response.json();

      if (response.status == 201) {
        console.log(data.token);
        sessionStorage.setItem("token", data.token);
        Swal.fire({
          title: "Login successfully!",
          icon: "success",
          draggable: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigater("/Add-Blog");
            window.location.reload();
          }
        });
      } 
      else if (response.status == 401) {
        setApiError({ api: "Invalid email or password." });
      } else if (response.status == 500) {
        setApiError({ api: "Server error. Please try again later." });
      }
    } catch (error) {
      console.log(error);
      setApiError({
        api: err.message || "Network error. Please try again later.",
      });
    }
  };
  console.log(error);
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}>
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Please login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handlesubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formdata.email}
              className={`form-control ${error.email ? "is-invalid" : ""}`}
              onChange={handlechange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formdata.password}
              name="password"
              className={`form-control ${error.password ? "is-invalid" : ""}`}
              onChange={handlechange}
            />
            
          </div>

          {apierror && apierror.api && (
            <div className="alert alert-danger text-center">{apierror.api}</div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted">OR</span>
          <hr className="flex-grow-1" />
        </div>

        {/* Signup Button */}
        <button
          onClick={() => navigater("/Signup")}
          className="btn btn-outline-secondary w-100">
          Create an Account
        </button>
      </div>
    </div>
  );
};
