import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import baselinks from "../../../baselinks.json";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));
const baseUri = oBaseUri.DefaultbaseUri;

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "", // Rich text will be saved here
    imageFile: null,
    date: "",
  });

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${baseUri}api/Blog`, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });
      setBlogs(response.data);
    } catch (error) {
      // console.error("Error fetching blogs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // const cleanedValue = value.replace(/-/g, '');
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description); // Rich text description
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    }
    data.append("date", formData.date);

    try {
      const response = await axios.post(`${baseUri}api/Blog`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog posted successfully!");
      fetchBlogs();
      setFormData({
        title: "",
        description: "",
        imageFile: null,
        date: "",
      });
    } catch (error) {
      // console.error("Error posting blog:", error);
      alert("Failed to post blog.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUri}api/Blog/${id}`);
      alert("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      // console.error("Error deleting blog:", error);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "-") {
                e.preventDefault(); // Block "-" character
              }
            }}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Rich Text Editor for Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleQuillChange}
            className="mt-1"
          />
        </div>

        {/* ImageFile */}
        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700"
          >
            Image File
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:border-gray-300 file:bg-gray-50 file:text-sm hover:file:bg-gray-100"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
          >
            Submit Blog
          </button>
        </div>
      </form>

      {/* Blogs Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center mb-4">All Blogs</h3>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              {/* <th className="border border-gray-300 px-4 py-2">Description</th> */}
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {blog.title}
                </td>
                {/* <td
                  className="border border-gray-300 px-4 py-2"
                  dangerouslySetInnerHTML={{ __html: blog.description }} // Render HTML content
                ></td> */}
                <td className="border border-gray-300 px-4 py-2">
                  {blog.date}
                </td>
                <td className="border border-gray-300 px-4 py-2">
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
    </div>
  );
};

export default AddBlog;
