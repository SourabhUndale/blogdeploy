import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Contact.css";
import metaImage from "../data/ggLogo.jpeg"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

   

    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://search.api.techkmr.com/sendMail?${queryParams}`;

    

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "User-Agent": "React App",
        },
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (response.ok) {
        setSuccessMessage("Message Sent Successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(result.message || "Failed to send the message, please try again.");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setError("An error occurred, please try again later.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Free WhatsApp Group Links & Promo</title>
        <meta property="og:title" content="Contact Us | Free WhatsApp Group Links & Promo | Join Indian & Girls WhatsApp Groups"/>
        <meta property="og:site_name" content="Group Godown"/>
        <meta property="og:url" content="https://www.groupgodown.com/"/>
        <meta property="og:description" content="Join the best WhatsApp groups to connect with like-minded people! Discover how to promote your WhatsApp group and increase group members easily. Explore top groups today!" />
        <meta property="og:type" content="website"/>
        <meta property="og:image" content={metaImage}></meta>
        <meta property="og:locale" content="en_US" />
        <meta name="description" content="Get in touch with us to add WhatsApp group links, submit invites, and promote groups. Increase group members, share market, YouTube, and girls WhatsApp groups." />
        <meta name="keywords" content="Free WhatsApp Group Promo, Add WhatsApp Group Links, Increase WhatsApp Group Members." />
        <link rel="canonical" href="https://www.groupgodown.com/contact/" />
      </Helmet>
      <div className="contact-outer-div">
        <div className="contact-main-div">
          <h5>Contact Us</h5>
          <p>Email : contact@groupgodown.com</p>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
