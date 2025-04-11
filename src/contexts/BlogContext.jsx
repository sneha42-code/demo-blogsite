import React, { createContext, useState, useCallback, useEffect } from 'react';
import blogService from '../services/blogService';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await blogService.getBlogs();
      setBlogs(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(blog => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      // Set featured blogs (blogs with featured flag)
      const featured = data.filter(blog => blog.featured);
      setFeaturedBlogs(featured);
      
      // Set popular blogs (blogs with most likes)
      const popular = [...data].sort((a, b) => b.likes - a.likes).slice(0, 5);
      setPopularBlogs(popular);
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Fetch single blog by ID
  const fetchBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setCurrentBlog(null);
    
    try {
      const blog = await blogService.getBlogById(id);
      setCurrentBlog(blog);
      return blog;
    } catch (err) {
      setError(err.message || `Failed to fetch blog with ID: ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new blog
  const createBlog = async (blogData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newBlog = await blogService.createBlog(blogData);
      setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
      
      // Update featured blogs if needed
      if (newBlog.featured) {
        setFeaturedBlogs(prev => [newBlog, ...prev]);
      }
      
      // Update categories if needed
      if (newBlog.category && !categories.includes(newBlog.category)) {
        setCategories(prev => [...prev, newBlog.category]);
      }
      
      return { success: true, blog: newBlog };
    } catch (err) {
      setError(err.message || 'Failed to create blog');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update blog
  const updateBlog = async (id, blogData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedBlog = await blogService.updateBlog(id, blogData);
      
      // Update blogs list
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => blog.id === id ? updatedBlog : blog)
      );
      
      // Update current blog if it's the one being edited
      if (currentBlog && currentBlog.id === id) {
        setCurrentBlog(updatedBlog);
      }
      
      // Update featured blogs if needed
      setFeaturedBlogs(prevFeatured => {
        if (updatedBlog.featured) {
          // Add to featured if not already there
          if (!prevFeatured.some(blog => blog.id === id)) {
            return [...prevFeatured, updatedBlog];
          }
        }
        // Update or remove from featured
        return updatedBlog.featured
          ? prevFeatured.map(blog => blog.id === id ? updatedBlog : blog)
          : prevFeatured.filter(blog => blog.id !== id);
      });
      
      // Update popular blogs if needed
      setPopularBlogs(prevPopular => 
        prevPopular.map(blog => blog.id === id ? updatedBlog : blog)
          .sort((a, b) => b.likes - a.likes)
      );
      
      // Update categories if needed
      if (updatedBlog.category && !categories.includes(updatedBlog.category)) {
        setCategories(prev => [...prev, updatedBlog.category]);
      }
      
      return { success: true, blog: updatedBlog };
    } catch (err) {
      setError(err.message || `Failed to update blog with ID: ${id}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await blogService.deleteBlog(id);
      
      // Remove blog from all lists
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
      setFeaturedBlogs(prevFeatured => prevFeatured.filter(blog => blog.id !== id));
      setPopularBlogs(prevPopular => prevPopular.filter(blog => blog.id !== id));
      
      // Clear current blog if it's the one being deleted
      if (currentBlog && currentBlog.id === id) {
        setCurrentBlog(null);
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message || `Failed to delete blog with ID: ${id}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Like/unlike blog
  const toggleLikeBlog = async (id) => {
    try {
      const updatedBlog = await blogService.toggleLikeBlog(id);
      
      // Update blog in all lists
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => blog.id === id ? updatedBlog : blog)
      );
      
      // Update current blog if it's the one being liked
      if (currentBlog && currentBlog.id === id) {
        setCurrentBlog(updatedBlog);
      }
      
      // Update featured blogs if needed
      setFeaturedBlogs(prevFeatured => 
        prevFeatured.map(blog => blog.id === id ? updatedBlog : blog)
      );
      
      // Update and resort popular blogs
      setPopularBlogs(prev => {
        const updated = prev.map(blog => blog.id === id ? updatedBlog : blog);
        const shouldBeInPopular = !prev.some(blog => blog.id === id) && 
          (prev.length < 5 || updatedBlog.likes > prev[prev.length - 1].likes);
        
        // Add to popular if not there but should be
        if (shouldBeInPopular) {
          updated.push(updatedBlog);
        }
        
        // Sort by likes
        return updated.sort((a, b) => b.likes - a.likes).slice(0, 5);
      });
      
      return { success: true, blog: updatedBlog };
    } catch (err) {
      console.error('Failed to toggle like:', err);
      return { success: false, error: err.message };
    }
  };

  // Add comment to blog
  const addComment = async (blogId, commentData) => {
    try {
      const updatedBlog = await blogService.addComment(blogId, commentData);
      
      // Update blog in all lists
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => blog.id === blogId ? updatedBlog : blog)
      );
      
      // Update current blog if it's the one being commented on
      if (currentBlog && currentBlog.id === blogId) {
        setCurrentBlog(updatedBlog);
      }
      
      // Update other lists that might contain this blog
      setFeaturedBlogs(prev => 
        prev.map(blog => blog.id === blogId ? updatedBlog : blog)
      );
      
      setPopularBlogs(prev => 
        prev.map(blog => blog.id === blogId ? updatedBlog : blog)
      );
      
      return { success: true, blog: updatedBlog };
    } catch (err) {
      console.error('Failed to add comment:', err);
      return { success: false, error: err.message };
    }
  };

  // Get user blogs
  const getUserBlogs = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const userBlogs = await blogService.getUserBlogs(userId);
      return { success: true, blogs: userBlogs };
    } catch (err) {
      setError(err.message || 'Failed to fetch user blogs');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Search blogs
  const searchBlogs = async (searchTerm) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await blogService.searchBlogs(searchTerm);
      return { success: true, blogs: searchResults };
    } catch (err) {
      setError(err.message || 'Failed to search blogs');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs by category
  const filterBlogsByCategory = (category) => {
    if (!category || category === 'all') {
      return blogs;
    }
    
    return blogs.filter(blog => blog.category === category);
  };

  const value = {
    blogs,
    featuredBlogs,
    popularBlogs,
    currentBlog,
    categories,
    loading,
    error,
    fetchBlogs,
    fetchBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleLikeBlog,
    addComment,
    getUserBlogs,
    searchBlogs,
    filterBlogsByCategory
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};