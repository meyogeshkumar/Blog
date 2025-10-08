import React from "react";
import "../style/Allstyles.css";
import { useNavigate, useState, useEffect } from "react";
import { baseurl } from "../url/baseurl";

export const Blog = () => {
  const token = sessionStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noBlog, setNoBlog] = useState(false);
  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 10px #bcbcbc1a",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    position: "relative",
    paddingBottom: "10px",
  };
  useEffect(() => {
    async function getallBlogs() {
      try {
        const response = await fetch(`${baseurl}/allblogs`, {
          method: "GET",
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          if (data.blogs.length === 0) {
            setNoBlog(true);
          } else {
            setBlogs(data.blogs);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getallBlogs();
  }, []);

  return (
    <>
      <div className="containerStyle">
        <h1
          className="mb-4 text-center"
          style={{ color: "#2c3e50", fontWeight: "700" }}>
          All Blogs
        </h1>

        {isLoading ? (
          <div className="text-center mt-5">Loading...</div>
        ) : noBlog ? (
          <div className="noBlogStyle">
            No Blogs Found <br />
          </div>
        ) : (
          <div className="row">
            {blogs.map((post, index) => (
              <div key={index} className="col-md-4 mb-4">
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
                    <span
                      style={{
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "end",
                        color: "#999999ff",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}>
                      {post.author.username}
                    </span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
