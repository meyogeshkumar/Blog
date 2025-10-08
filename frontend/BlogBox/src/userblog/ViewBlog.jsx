import { useEffect, useState } from "react";
import { baseurl } from "../url/baseurl";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../style/Allstyles.css";
import { FaEdit, FaTrash } from "react-icons/fa";

export const ViewBlog = () => {
  const token = sessionStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noBlog, setNoBlog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getMyBlogs() {
      try {
        const response = await fetch(`${baseurl}/myblog`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data.blogs.length === 0) {
            setNoBlog(true);
          } else {
            setBlogs(data.blogs);
          }
        } else if (response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "No token provided",
          }).then(() => navigate("/Login"));
        } else if (response.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Invalid or expired token",
          }).then(() => navigate("/Login"));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getMyBlogs();
  }, [navigate, token]);

  // 🔹 Delete blog
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${baseurl}/deleteblog/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          Swal.fire("Deleted!", "Your blog has been deleted.", "success");
          setBlogs(blogs.filter((b) => b._id !== id)); // remove deleted blog
        } else {
          Swal.fire("Error!", "Failed to delete the blog.", "error");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    position: "relative",
    paddingBottom: "10px",
  };

  const iconContainer = {
    display: "flex",
    gap: "10px",
    marginRight: "10px",
    alignItems: "end",
    justifyContent: "end",
  };

  const iconStyle = {
    cursor: "pointer",
    color: "#555",
    fontSize: "18px",
    transition: "color 0.3s ease",
  };

  return (
    <div className="containerStyle">
      <h1
        className="mb-4 text-center"
        style={{ color: "#2c3e50", fontWeight: "700" }}>
        My Blogs
      </h1>

      {isLoading ? (
        <div className="text-center mt-5">Loading...</div>
      ) : noBlog ? (
        <div className="noBlogStyle">
          No Blogs Found <br />
          <small style={{ color: "#fff" }}>
            Start writing your first blog today!
          </small>
        </div>
      ) : (
        <div className="row">
          {blogs.map((post) => (
            <div key={post._id} className="col-md-4 mb-4">
              <div
                className="card"
                style={cardStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  })
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "translateY(0)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  })
                }>
                <div className="card-body">
                  <h5
                    className="card-title"
                    style={{ color: "#2980b9", fontWeight: "600" }}>
                    {post.title}
                  </h5>
                  <p className="card-text" style={{ color: "#555" }}>
                    {post.content.length > 150
                      ? post.content.slice(0, 150) + "..."
                      : post.content}
                  </p>
                </div>
                <div style={iconContainer}>
                  <FaEdit
                    style={{ ...iconStyle, color: "#3498db" }}
                    title="Edit"
                    onClick={() => handleEdit(post._id)}
                  />
                  <FaTrash
                    style={{ ...iconStyle, color: "#e74c3c" }}
                    title="Delete"
                    onClick={() => handleDelete(post._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
