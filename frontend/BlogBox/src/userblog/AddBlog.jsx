import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ViewBlog } from "./ViewBlog";
import { baseurl } from "../url/baseurl";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

export const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const token = sessionStorage.getItem("token");


  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setShowModal(true);
      fetchBlogById(id);
    }
  }, [id]);

  const fetchBlogById = async (blogId) => {
    try {
      const response = await fetch(`${baseurl}/blog/${blogId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.blog);
        setFormData({
          title: data.blog.title,
          content: data.blog.content,
        });
      } else if (response.status == 203) {
        Swal.fire("No content", "Invalied Id", "error");
      } else {
        Swal.fire("Error", "Failed to fetch blog details", "error");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditMode
      ? `${baseurl}/updateblog/${id}`
      : `${baseurl}/createblog`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: isEditMode ? "Blog Updated!" : "Blog Created!",
        }).then(() => {
          setShowModal(false);
          navigate("/");
          window.location.reload();
        });
      } else if (response.status === 401 || response.status === 403) {
        Swal.fire(
          "Error",
          "Unauthorized access, please log in again.",
          "error"
        ).then(() => navigate("/Login"));
      } else {
        Swal.fire("Error", "Failed to save blog", "error");
      }
    } catch (error) {
      console.error(error);
    }

    setFormData({ title: "", content: "" });
  };

  return (
    <>
      {/* Floating Add Button (hidden during edit) */}
      {!isEditMode && (
        <div style={{ position: "fixed", bottom: "10px", right: "20px" }}>
          <button
            className="btn btn-primary rounded-circle shadow-lg"
            style={{
              fontSize: "36px",
              width: "60px",
              height: "60px",
              lineHeight: "21px",
              textAlign: "center",
            }}
            onClick={() => setShowModal(true)}>
            +
          </button>
        </div>
      )}

      <ViewBlog />

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Blog" : "Create Blog"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="form-control"
                      rows="4"
                      placeholder="Write your blog content..."
                      required></textarea>
                  </div>

                  <button type="submit" className="btn btn-success">
                    {isEditMode ? "Update" : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
