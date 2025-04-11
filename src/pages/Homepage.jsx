import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../hooks/useBlog";
import BlogCard from "../components/blog/BlogCard";
import Loading from "../components/common/Loading";

const HomePage = () => {
  const { blogs, featuredBlogs, popularBlogs, loading, error, fetchBlogs } =
    useBlog();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchBlogs} className="btn btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to BlogHub</h1>
            <p>
              Discover stories, thinking, and expertise from writers on any
              topic.
            </p>
            <Link to="/blogs" className="btn btn-primary">
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs && featuredBlogs.length > 0 && (
        <section className="featured-blogs section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Blogs</h2>
              <Link to="/blogs" className="view-all">
                View All
              </Link>
            </div>

            <div className="featured-blogs-grid">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blogs Section */}
      {blogs && blogs.length > 0 && (
        <section className="latest-blogs section">
          <div className="container">
            <div className="section-header">
              <h2>Latest Blogs</h2>
              <Link to="/blogs" className="view-all">
                View All
              </Link>
            </div>

            <div className="blogs-grid">
              {blogs.slice(0, 6).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Blogs Section */}
      {popularBlogs && popularBlogs.length > 0 && (
        <section className="popular-blogs section">
          <div className="container">
            <div className="section-header">
              <h2>Most Popular</h2>
              <Link to="/blogs" className="view-all">
                View All
              </Link>
            </div>

            <div className="blogs-grid">
              {popularBlogs.slice(0, 3).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to share your stories?</h2>
            <p>Join our community of writers and readers today!</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
