import React, { useEffect, useState } from 'react';
import axios from 'axios';
import link from "../../../link.json";
import { Link } from 'react-router-dom';


// import './BlogDetails.css';
import './BlogDetails.css';

const Blog = () => {
    // All hooks at the top
    const obaseUri = JSON.parse(JSON.stringify(link));
    const baseUri = obaseUri.DefaultbaseUri;
    const [data, setData] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const adsenseClient = link.adsenseClient;
    const adsenseSlot = link.adsenseSlot;

    useEffect(() => {
        axios.get(`${baseUri}api/Blog`)
            .then(response => {
                // console.log(response.data);
                setData(response.data);
            })
            .catch(err => {
                // console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
            try {
                window.adsbygoogle.push({});
            } catch (e) {
                // ignore
            }
        }
    }, []);

    // Function to generate SEO-friendly slug
    const generateSlug = (title) => {
        return title.toLowerCase().trim().replace(/\s+/g, '-'); // Convert spaces to hyphens
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-4">
            <h1>All Blogs</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data.length > 0 ? (
                <div className="row">
                    {data.map((post) => (
                        <div className="col-md-4 mb-4" key={post.id}>
                            <Link 
                                to={`/blog/${generateSlug(post.title)}`} // ✅ Use slug instead of ID
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
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
                                        <button type="button" className="btn btn-success">Read More</button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No blog posts available.</p>
            )}
            {/* Google AdSense Responsive Ad Unit */}
            {/*
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
                <ins className="adsbygoogle"
                    style={{ display: 'block', width: '100%', maxWidth: 728, minHeight: 90 }}
                    data-ad-client={adsenseClient}
                    data-ad-slot={adsenseSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
            */}
        </div>
    );
};

export default Blog;
