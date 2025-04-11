import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import blogService from "../../services/blogService";

// This is a simple WYSIWYG placeholder
// In a real application, you would integrate a rich text editor like TinyMCE, CKEditor, or Quill
const SimpleEditor = ({ value, onChange }) => {
  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button type="button" className="toolbar-btn">
          Bold
        </button>
        <button type="button" className="toolbar-btn">
          Italic
        </button>
        <button type="button" className="toolbar-btn">
          Link
        </button>
        <button type="button" className="toolbar-btn">
          Image
        </button>
      </div>
      <textarea
        className="editor-content"
        value={value}
        onChange={onChange}
        rows="15"
      />
    </div>
  );
};

const BlogForm = ({ initialData = null, isEditing = false }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    coverImage: "",
    featured: false,
    ...initialData,
  });
  const [imagePreview, setImagePreview] = useState(
    initialData?.coverImage || ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Available categories (in a real app, these might come from an API)
  const categories = [
    "Technology",
    "Health",
    "Travel",
    "Food",
    "Lifestyle",
    "Business",
    "Education",
    "Sports",
    "Entertainment",
    "Other",
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", {
        state: {
          from: isEditing ? `/edit-blog/${initialData?.id}` : "/create-blog",
        },
      });
    }

    // When in edit mode, format tags from array to comma-separated string
    if (isEditing && initialData?.tags && Array.isArray(initialData.tags)) {
      setFormData((prev) => ({
        ...prev,
        tags: initialData.tags.join(", "),
      }));
    }
  }, [currentUser, navigate, isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Format data for API
      const blogData = {
        ...formData,
        // Convert comma-separated tags to array
        tags: formData.tags.trim()
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      // Upload image if there's a new one
      if (imageFile) {
        const imageData = await blogService.uploadImage(imageFile);
        blogData.coverImage = imageData.url;
      }

      let result;
      if (isEditing) {
        // Update existing blog
        result = await blogService.updateBlog(initialData.id, blogData);
        if (result) {
          navigate(`/blogs/${initialData.id}`);
        }
      } else {
        // Create new blog
        result = await blogService.createBlog(blogData);
        if (result) {
          navigate(`/blogs/${result.id}`);
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="blog-form-container">
      <form onSubmit={handleSubmit} className="blog-form">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your blog title"
            maxLength="100"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Short Description</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Write a short description (will appear in blog cards)"
            rows="2"
            maxLength="200"
          />
          <span className="char-count">{formData.excerpt.length}/200</span>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <SimpleEditor
            value={formData.content}
            onChange={handleContentChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., react, javascript, programming (comma separated)"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <div className="image-upload-container" onClick={handleImageClick}>
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Cover" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview("");
                    setImageFile(null);
                    setFormData((prev) => ({ ...prev, coverImage: "" }));
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M19.5 12c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-6.527 4.593c-1.108 1.086-2.275 2.219-3.473 2.219-1.5 0-2.5-3.969-2.5-8.812s1-8.812 2.5-8.812c1.195 0 2.359 1.129 3.465 2.211.217-1.082.332-2.256.332-3.399 0-.513-.039-1.028-.097-1.536-.648-.091-1.297-.164-1.947-.192-2.361.193-3.969 1.817-5.272 3.049-.398.04-.803.064-1.219.064-7.453 0-13.5-6.047-13.5-13.5s6.047-13.5 13.5-13.5 13.5 6.047 13.5 13.5c0 .416-.024.821-.064 1.219 1.232 1.303 2.855 2.911 3.048 5.272-.027.65-.1 1.3-.191 1.947-.506.058-1.022.098-1.536.098-1.141 0-2.316-.115-3.396-.331zm-9.973-9.93c2.577-2.594 5.914-3.855 9-4.55v-2.025c-3.445.586-7.027 1.963-9.879 4.385-2.851-2.421-6.433-3.799-9.879-4.385v2.025c3.04.684 6.37 1.948 8.91 4.521.11.011.21.024.31.036.011-.011.024-.021.036-.032v.001l.899-.899c.894-.893 2.094-1.339 3.301-1.339 1.199 0 2.399.439 3.299 1.34.222.22.416.45.584.685-.11-.657-.181-1.32-.181-1.985 0-2.044.141-4.026.404-5.942-1.267.13-2.536.32-3.787.577-1.13.232-2.19.525-3.234.868-.997.325-1.711.568-2.371.568-1.13 0-1.5-1.527-1.5-4.238 0-2.146.549-4.336.549-6.047 0-1.367-.538-2.07-1.25-2.07-.704 0-1.539 2.101-2.154 3.806-.511 1.416-.876 3.036-1.035 4.916.082-.1.162-.201.236-.312.245-.368.436-.79.548-1.223.112-.517.19-1.053.233-1.591.376-1.238.89-1.855 1.242-1.855.358 0 .396.509.396.848 0 1.681-.518 3.913-.518 6.099 0 1.075.173 1.392.225 1.464.132.123.422.178.9.178.638 0 1.419-.22 2.334-.525.978-.325 1.999-.603 3.063-.825 1.118-.233 2.237-.412 3.348-.544-1.521-4.863-5.281-9.504-10.504-9.504-6.347 0-11.5 6.047-11.5 13.5s5.153 13.5 11.5 13.5c.541 0 1.071-.043 1.586-.11.26-.295.506-.597.737-.91.354-.48.681-.98.973-1.5.275-.494.518-1.006.724-1.534-.517.635-1.034 1.227-1.546 1.742z" />
                </svg>
                <p>Click to upload cover image</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <small>Recommended size: 1200 x 630 pixels, max 5MB</small>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            Submit for featured section (subject to review)
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? isEditing
                ? "Updating..."
                : "Publishing..."
              : isEditing
              ? "Update Blog"
              : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
