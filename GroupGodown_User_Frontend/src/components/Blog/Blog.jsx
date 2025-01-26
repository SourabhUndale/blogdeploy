import React from "react";
import { Link } from "react-router-dom";
import blogs from "./blogs.json"; // Import the JSON file
import './Blog.css'

const Blog = () => {
  return (
    <div className="blog-page">
      <h1>Blogs</h1>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <img src={blog.image} alt={blog.title} className="blog-image" />
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
            <Link to={`/blog/${blog.id}`} className="read-more">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;