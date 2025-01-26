import React, { useEffect, useState } from 'react';
import axios from 'axios';
import link from "../../../link.json";
import { Link } from 'react-router-dom'; // Import Link for navigation

import './BlogDetails.css'; // Import custom CSS for card styling

const Blog = () => {

    const obaseUri = JSON.parse(JSON.stringify(link));
    const baseUri = obaseUri.DefaultbaseUri;

    const [data, setData] = useState([]); // Initialize as an empty array
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        axios.get(`${baseUri}api/Blog`)
            .then(response => {
                console.log(response.data); // Log the entire response
                setData(response.data); // Assuming response.data contains an array of blog posts
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            })
            .finally(() => {
                setLoading(false); // Set loading to false after fetch
            });
    }, []);

    return (
        <div className="container mt-4">
            <h1>All Blogs</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                data.length > 0 ? (
                    <div className="row">
                        {data.map((post) => (
                            <div className="col-md-4 mb-4" key={post.id}>
                                <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card h-100">
                                        {post.imageCon && (
                                            <img 
                                                src={`data:image/jpeg;base64,${post.imageCon}`} 
                                                alt={post.title} 
                                                className="card-img-top" 
                                            />
                                        )}
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{post.title}</h5>
                                            {/* Render HTML description */}
                                            <div 
                                                className="card-text"
                                                
                                            >
 <button type="button" class="btn btn-success">Read More</button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No blog posts available.</p>
                )
            )}
        </div>
    );
};

export default Blog;
