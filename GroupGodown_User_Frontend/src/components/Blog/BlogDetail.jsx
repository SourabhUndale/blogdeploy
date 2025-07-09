import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import link from "../../../link.json";
import './Blog.css'; 


const BlogDetail = () => {
    const obaseUri = JSON.parse(JSON.stringify(link));
    const baseUri = obaseUri.DefaultbaseUri;

    const { titleSlug } = useParams(); // Get the title slug from URL
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const formattedTitle = titleSlug.replace(/-/g, ' '); // Convert hyphens back to spaces
        axios.get(`${baseUri}api/blog/title/${formattedTitle}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(err => {
                // console.error('Error fetching data:', err);
                setError('Failed to fetch blog details');
            })
            .finally(() => setLoading(false));
    }, [titleSlug]);

    return (
        <div className="blog-container mt-4">
            {loading && <p className="blog-loading">Loading...</p>}
            {error && <p className="blog-error">{error}</p>}
    
            {post && (
                <div className="blog-content">
                    {/* Blog Title */}
                    <h1 className="blog-title">{post.title}</h1>
    
                    {/* Blog Image */}
                    {post.imageCon && (
                        <div className="blog-image-wrapper">
                            <img
                                src={`data:image/jpeg;base64,${post.imageCon}`}
                                alt={post.title}
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
