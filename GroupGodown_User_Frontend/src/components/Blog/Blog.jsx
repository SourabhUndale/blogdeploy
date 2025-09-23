import React, { useEffect, useState } from "react";
import axios from "axios";
import link from "../../../link.json";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./BlogDetails.css";

const Blog = () => {
  const obaseUri = JSON.parse(JSON.stringify(link));
  const baseUri = obaseUri.DefaultbaseUri;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios
      .get(`${baseUri}api/Blog?page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        setData(response.data.blogs);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      })
      .catch(() => {
        setError("Failed to fetch data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUri, page]);

  const generateSlug = (title) =>
    title.toLowerCase().trim().replace(/\s+/g, "-");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      {/* ✅ SEO Helmet for Blog Listing */}
     
      <Helmet>
        <title>{`${window.location.origin}/blog | ${window.location.hostname}`}</title>
        <meta
            name="description"
            content="Read all the latest blogs, articles, and updates."
            />
        <link rel="canonical" href={`${window.location.origin}/blog`} />

        {/* OpenGraph */}
        <meta property="og:title" content={`${window.location.origin}/blog | ${window.location.hostname}`} />
        <meta
          property="og:description"
          content="Read all the latest blogs, articles, and updates."
        />
        <meta property="og:url" content={`${window.location.origin}/blog`} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${window.location.origin}/blog | ${window.location.hostname}`} />
        <meta
          name="twitter:description"
          content="Read all the latest blogs, articles, and updates."
        />
      </Helmet>


      <h1>All Blogs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length > 0 ? (
        <div className="row">
          {data.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              <Link
                to={`/blog/${generateSlug(post.title)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card h-100">
                  {post.thumbnailUrl && (
                    <div className="image-container">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.altText || post.title}
                        className="card-img-top blog-thumb"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>
                    <button type="button" className="btn btn-success mt-auto">
                      Read More
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No blog posts available.</p>
      )}

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-4">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Blog;
