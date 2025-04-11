import React from "react";
import BlogForm from "../components/blog/BlogForm";

const CreateBlogPage = () => {
  return (
    <div className="create-blog-page">
      <div className="container">
        <div className="page-header">
          <h1>Create a New Blog</h1>
          <p>Share your thoughts, ideas, and stories with the world</p>
        </div>

        <BlogForm />
      </div>
    </div>
  );
};

export default CreateBlogPage;
