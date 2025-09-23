import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/api"; // Use the custom Axios instance
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import baselinks from "../../../baselinks.json";
import { isValidToken, redirectToLogin } from '../../utils/auth';

const oBaseUri = JSON.parse(JSON.stringify(baselinks));
const baseUri = oBaseUri.DefaultbaseUri;

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null, 
    altText: "",
    metaDescription: "",
    date: "",
  });

  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("alert");
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get(`${baseUri}api/Blog`);
      // Check if response.data.blogs exists and is an array
      if (response.data && Array.isArray(response.data.blogs)) {
        setBlogs(response.data.blogs);
      } else {
        setBlogs([]); // Set to empty array if blogs is not found or not an array
        
      }
    } catch (error) {
      
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      description: blog.description,
      imageFile: null, 
      altText: blog.altText || "",
      metaDescription: blog.metaDescription || "",
      date: blog.date ? blog.date.split("T")[0] : "",
    });
    setEditingBlogId(blog.id);
    setIsEditing(true);

    // Show existing image from backend
    if (blog.imageUrl) {
      setImagePreviewUrl(blog.imageUrl);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      altText: "",
      metaDescription: "",
      date: "",
    });
    setEditingBlogId(null);
    setIsEditing(false);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidToken()) {
      redirectToLogin();
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    }
    data.append("altText", formData.altText);
    data.append("metaDescription", formData.metaDescription);
    data.append("date", formData.date);

    try {
      let response;
      if (isEditing) {
        response = await api.put(`${baseUri}api/Blog/${editingBlogId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem('bearerToken')}`,
          },
        });
        setModalMessage("Blog updated successfully!");
      } else {
        response = await api.post(`${baseUri}api/Blog`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem('bearerToken')}`,
          },
        });
        setModalMessage("Blog posted successfully!");
      }
      setShowModal(true);
      setModalType("alert");
      fetchBlogs();
      handleCancelEdit();
    } catch (error) {
      setShowModal(true);
      setModalMessage("Failed to post/update blog.");
      setModalType("alert");
      
    }
  };

  const handleDelete = async (id) => {
    if (!isValidToken()) {
      redirectToLogin();
      return;
    }
    const performDelete = async () => {
      try {
        await api.delete(`${baseUri}api/Blog/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('bearerToken')}`,
          },
        });
        setShowModal(true);
        setModalMessage("Blog deleted successfully!");
        setModalType("alert");
        fetchBlogs();
      } catch (error) {
        setShowModal(true);
        setModalMessage("Failed to delete blog.");
        setModalType("alert");
        
      }
    };

    setShowModal(true);
    setModalMessage("Are you sure you want to delete this blog?");
    setModalType("confirm");
    setOnConfirmAction(() => performDelete);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-black-700">
            Description
          </label>
          <ReactQuill theme="snow" value={formData.description} onChange={handleQuillChange} className="mt-1" />
        </div>

        {/* ImageFile */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-black-700">
            Image File
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
            accept="image/*"
            ref={fileInputRef}
            className="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:border-gray-300 file:bg-gray-50 file:text-sm hover:file:bg-gray-100"
          />
          {imagePreviewUrl && (
            <div className="mt-4 border border-gray-300 rounded-md p-2">
              <img src={imagePreviewUrl} alt="Image Preview" className="max-w-full h-auto" />
            </div>
          )}
        </div>

        {/* Alt Text */}
        <div>
          <label htmlFor="altText" className="block text-sm font-medium text-black-700">
            Image Alt Text
          </label>
          <input
            type="text"
            id="altText"
            name="altText"
            value={formData.altText}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-black-700">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-black-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            max={new Date().toISOString().split("T")[0]}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
        <div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">
            {isEditing ? "Update Blog" : "Submit Blog"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 mt-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Blogs Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center mb-4">All Blogs</h3>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Thumbnail</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {blog.thumbnailUrl && (
                    <img src={blog.thumbnailUrl} alt={blog.altText || blog.title} className="h-12 mx-auto" />
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{blog.title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {blog.date ? new Date(blog.date).toLocaleDateString() : ""}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(blog)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{modalMessage}</h3>
              {modalType === "confirm" && (
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone, and the blog will not be retrievable.
                </p>
              )}
              <div className="mt-4">
                {modalType === "confirm" ? (
                  <>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md w-full hover:bg-red-700 mb-2"
                      onClick={() => {
                        if (onConfirmAction) onConfirmAction();
                        setShowModal(false);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded-md w-full hover:bg-gray-700"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md w-full hover:bg-indigo-700"
                    onClick={() => setShowModal(false)}
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBlog;







