import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import link from "../../../link.json";
import "./Blog.css";

const BlogDetail = () => {
  const obaseUri = JSON.parse(JSON.stringify(link));
  const baseUri = obaseUri.DefaultbaseUri;

  const { titleSlug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!titleSlug) return;

    const formattedTitle = titleSlug.replace(/-/g, " ");

    axios
      .get(`${baseUri}api/Blog/title/${formattedTitle}`)
      .then((response) => setPost(response.data))
      .catch(() => setError("Failed to fetch blog details"))
      .finally(() => setLoading(false));
  }, [baseUri, titleSlug]);

  const getMetaDescription = () => {
    if (!post) return "";
    if (post.metaDescription) return post.metaDescription;
    return post.description?.replace(/<[^>]*>/g, "").substring(0, 160);
  };

  return (
    <div className="blog-container mt-4">
      {/* ✅ SEO Helmet */}
      {post && (
        <Helmet>
          <title>{post.title} | My Blog</title>
          <meta name="description" content={getMetaDescription()} />
          <link
            rel="canonical"
            href={`${window.location.origin}/blog/${titleSlug}`}
          />

          {/* OpenGraph */}
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={getMetaDescription()} />
          {post.imageUrl && (
            <meta property="og:image" content={post.imageUrl} />
          )}
          <meta
            property="og:url"
            content={`${window.location.origin}/blog/${titleSlug}`}
          />
          <meta property="og:type" content="article" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={getMetaDescription()} />
          {post.imageUrl && (
            <meta name="twitter:image" content={post.imageUrl} />
          )}

          {/* Minimal JSON-LD */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              image: post.imageUrl ? [post.imageUrl] : [],
              description: getMetaDescription(),
              datePublished: post.date,
            })}
          </script>
        </Helmet>
      )}

      {loading && <p className="blog-loading">Loading...</p>}
      {error && <p className="blog-error">{error}</p>}

      {post && (
        <div className="blog-content">
          {/* Blog Title */}
          <h1 className="blog-title">{post.title}</h1>

          {/* Blog Image */}
          {post.imageUrl && (
            <div className="blog-image-wrapper">
              <img
                src={post.imageUrl}
                alt={post.altText || post.title}
                className="blog-image"
              />
            </div>
          )}

          {/* Blog Description */}
          <div
            className="blog-text"
            dangerouslySetInnerHTML={{ __html: post.description }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
