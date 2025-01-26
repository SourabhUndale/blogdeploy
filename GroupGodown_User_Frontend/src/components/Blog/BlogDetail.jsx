import React from "react";
import { useParams } from "react-router-dom";
import blogs from "./blogs.json";
import './BlogDetails.css';

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) {
    return <h2>Blog not found!</h2>;
  }

  // Replacing \n with <br/> and rendering it as HTML
  const contentWithLineBreaks = blog.content.replace(/\n/g, "<br/>");

  return (
    <div className="blog-detail-page">
      <h1>{blog.title}</h1>
      <img src={blog.image} alt={blog.title} className="blog-image" style={{ height: "17rem", width: "17rem" }} />
      <h2 className="mt-5">{blog.head}</h2>
      {/* Render the content with line breaks */}
      <p dangerouslySetInnerHTML={{ __html: contentWithLineBreaks }} />
    </div>
  );
};

export default BlogDetail;
