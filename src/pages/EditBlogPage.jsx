import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../hooks/useAuth';
import BlogForm from '../components/blog/BlogForm';
import Loading from '../components/common/Loading';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { currentBlog, loading, error, fetchBlogById } = useBlog();
  const [unauthorized, setUnauthorized] = useState(false);
  
  useEffect(() => {
    // Fetch the blog data
    const loadBlog = async () => {
      await fetchBlogById(id);
    };
    
    loadBlog();
  }, [fetchBlogById, id]);
  
  // Check if user is authorized to edit
  useEffect(() => {
    if (currentUser && currentBlog) {
      // Check if current user is the author
      if (currentBlog.author.id !== currentUser.id) {
        setUnauthorized(true);
      }
    }
  }, [currentUser, currentBlog]);
  
  if (loading) return <Loading />;
  
  if (unauthorized) {
    return (
      <div className="unauthorized-container container">
        <h2>Unauthorized</h2>
        <p>You don't have permission to edit this blog post.</p>
        <button 
          onClick={() => navigate(`/blogs/${id}`)} 
          className="btn btn-primary"
        >
          View Blog
        </button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => fetchBlogById(id)} 
          className="btn btn-primary"
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate(`/blogs/${id}`)} 
          className="btn btn-secondary"
        >
          View Blog
        </button>
      </div>
    );
  }
  
  if (!currentBlog) {
    return (
      <div className="not-found-container container">
        <h2>Blog Not Found</h2>
        <p>The blog you're trying to edit doesn't exist or may have been removed.</p>
        <button 
          onClick={() => navigate('/blogs')} 
          className="btn btn-primary"
        >
          Browse Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="edit-blog-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Blog</h1>
          <p>Update your blog post</p>
        </div>
        
        <BlogForm 
          initialData={currentBlog}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditBlogPage;