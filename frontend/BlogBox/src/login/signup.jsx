import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../url/baseurl";
import Swal from "sweetalert2";

export const Signup = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState({});

  const handlechange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const hanldesubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formdata.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formdata.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formdata.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (formdata.password !== formdata.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formdata.username,
          email: formdata.email,
          password: formdata.confirmpassword,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status == 201) {
        console.log(data);
        Swal.fire({
          title: "signup successfully click ok go to login!",
          icon: "success",
          draggable: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/Login");
          }
        });
      }
      if (response.status == 400) {
        alert("Email already exit go to login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-3"
        style={{ maxWidth: "450px", width: "100%" }}>
        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted">Please fill in the details to sign up</p>
        </div>

        {/* Form */}
        <form onSubmit={hanldesubmit}>
          {/* Full Name */}
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formdata.username}
              name="username"
              onChange={handlechange}
              className={`form-control ${error.username ? "is-invalid" : ""}`}
            />
            {error.username && (
              <div className="invalid-feedback">{error.username}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`form-control ${error.email ? "is-invalid" : ""}`}
              value={formdata.email}
              name="email"
              onChange={handlechange}
            />
            {error.email && (
              <div className="invalid-feedback">{error.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`form-control ${error.password ? "is-invalid" : ""}`}
              value={formdata.password}
              name="password"
              onChange={handlechange}
            />
            {error.password && (
              <div className="invalid-feedback">{error.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-2">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              className={`form-control ${
                error.confirmpassword ? "is-invalid" : ""
              }`}
              value={formdata.confirmpassword}
              name="confirmpassword"
              onChange={handlechange}
            />
            {error.confirmpassword && (
              <div className="invalid-feedback">{error.confirmpassword}</div>
            )}
          </div>

          {/* Signup Button */}
          <button type="submit" className="btn btn-success w-100 mb-2">
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted">OR</span>
          <hr className="flex-grow-1" />
        </div>

        {/* Login Redirect */}
        <p className="text-center text-muted">
          Already have an account?{" "}
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/Login")}>
            login
          </span>
        </p>
      </div>
    </div>
  );
};
