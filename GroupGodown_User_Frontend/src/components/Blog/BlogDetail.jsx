import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import link from "../../../link.json";
import './Blog.css'; // Import a custom CSS file for image sizing

const BlogDetail = () => {

    const obaseUri = JSON.parse(JSON.stringify(link));
    const baseUri = obaseUri.DefaultbaseUri;

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${baseUri}api/Blog/${id}`)
            .then(response => setPost(response.data))
            .catch(err => {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="container mt-4 text-center"> {/* Center all content */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {post && (
                <div className="blog-detail">
                    {/* Title */}
                    <h1 className="mb-4">{post.title}</h1>

                    {/* Image */}
                    {post.imageCon && (
                        <div className="d-flex justify-content-center mb-4">
                            <img
                                src={`data:image/jpeg;base64,${post.imageCon}`}
                                alt={post.title}
                                className="blog-image" /* Custom class for image size */
                            />
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-muted">{post.description}</p>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
