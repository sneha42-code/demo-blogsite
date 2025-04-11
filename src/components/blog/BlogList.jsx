import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import Loading from "../common/Loading";

const BlogList = ({ blogs, loading, error }) => {
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  // Extract unique categories from blogs
  const categories = blogs
    ? ["all", ...new Set(blogs.map((blog) => blog.category).filter(Boolean))]
    : ["all"];

  useEffect(() => {
    if (!blogs) return;

    let filtered = [...blogs];

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((blog) => blog.category === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          blog.excerpt.toLowerCase().includes(term) ||
          (blog.author && blog.author.name.toLowerCase().includes(term))
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogs, activeFilter, searchTerm]);

  // Calculate pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of blog list
    window.scrollTo({
      top: document.querySelector(".blog-list-container").offsetTop - 100,
      behavior: "smooth",
    });
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="empty-state">
        <h2>No blogs found</h2>
        <p>Be the first to create a blog post!</p>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <div className="blog-filters">
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                activeFilter === category ? "active" : ""
              }`}
              onClick={() => handleFilterChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="no-results">
          <h3>No blogs match your filters</h3>
          <p>Try changing your search or filter criteria</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setActiveFilter("all");
              setSearchTerm("");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {currentBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn prev"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo; Previous
              </button>

              <div className="page-numbers">
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    className={`pagination-btn page-number ${
                      currentPage === number + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn next"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}

      <div className="results-info">
        Showing {currentBlogs.length} of {filteredBlogs.length} blogs
      </div>
    </div>
  );
};

export default BlogList;
