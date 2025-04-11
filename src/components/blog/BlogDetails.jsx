import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useBlog } from "../../hooks/useBlog";
import CommentSection from "./CommentSection";
import RelatedBlogs from "./RelatedBlogs";
import Loading from "../common/Loading";
import Modal from "../common/Modal";
import { formatDate } from "../../utils/formatDate";
import { calculateReadingTime } from "../../utils/helpers";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    currentBlog,
    loading,
    error,
    fetchBlogById,
    toggleLikeBlog,
    deleteBlog,
  } = useBlog();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Fetch blog details
    fetchBlogById(id);

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Set page title
    document.title = "Loading Blog... | BlogHub";
  }, [fetchBlogById, id]);

  // Update page title when blog loads
  useEffect(() => {
    if (currentBlog) {
      document.title = `${currentBlog.title} | BlogHub`;

      // Check if user has liked this blog
      if (currentUser && currentBlog.likedBy) {
        setHasLiked(currentBlog.likedBy.includes(currentUser.id));
      }
    }
  }, [currentBlog, currentUser]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/blogs/${id}` } });
      return;
    }

    const result = await toggleLikeBlog(id);
    if (result.success) {
      setHasLiked(!hasLiked);
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteBlog(id);
      if (result.success) {
        navigate("/blogs");
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentBlog.title,
        text: currentBlog.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Blog URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="blog-details-container">
        <Loading message="Loading blog content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-details-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => fetchBlogById(id)} className="btn btn-primary">
            Try Again
          </button>
          <Link to="/blogs" className="btn btn-secondary">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="blog-details-container">
        <div className="not-found-container">
          <h2>Blog Not Found</h2>
          <p>
            The blog you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/blogs" className="btn btn-primary">
            Browse Blogs
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    content,
    coverImage,
    author,
    createdAt,
    updatedAt,
    category,
    tags,
    likes,
    views,
    comments = [],
  } = currentBlog;

  const isAuthor = currentUser && author.id === currentUser.id;
  const readingTime = calculateReadingTime(content);
  const isUpdated = new Date(updatedAt) > new Date(createdAt);

  return (
    <div className="blog-details-container">
      <article className="blog-article">
        <header className="blog-header">
          <div className="container">
            {category && (
              <div className="blog-category">
                <Link to={`/blogs?category=${category}`}>{category}</Link>
              </div>
            )}

            <h1 className="blog-title">{title}</h1>

            <div className="blog-meta">
              <div className="author-info">
                <Link to={`/author/${author.id}`} className="author-link">
                  <img
                    src={author.avatar || "/images/default-avatar.jpg"}
                    alt={author.name}
                    className="author-avatar"
                  />
                  <span className="author-name">{author.name}</span>
                </Link>
              </div>

              <div className="blog-details">
                <span className="blog-date">{formatDate(createdAt)}</span>
                {isUpdated && (
                  <span
                    className="blog-updated"
                    title={formatDate(updatedAt, { format: "long" })}
                  >
                    (Updated)
                  </span>
                )}
                <span className="reading-time">{readingTime} min read</span>
                {views && (
                  <span className="blog-views">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {views}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="blog-content-wrapper">
          <div className="container">
            {coverImage && (
              <div className="blog-cover-image">
                <img src={coverImage} alt={title} />
              </div>
            )}

            <div className="blog-content">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            {tags && tags.length > 0 && (
              <div className="blog-tags">
                {tags.map((tag) => (
                  <Link to={`/blogs?tag=${tag}`} key={tag} className="tag">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="blog-actions">
              <div className="action-buttons">
                <button
                  className={`like-button ${hasLiked ? "liked" : ""}`}
                  onClick={handleLike}
                  aria-label={hasLiked ? "Unlike this blog" : "Like this blog"}
                >
                  <svg
                    className="heart-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{likes || 0}</span>
                </button>

                <button
                  className="share-button"
                  onClick={handleShare}
                  aria-label="Share this blog"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  <span>Share</span>
                </button>
              </div>

              {isAuthor && (
                <div className="author-actions">
                  <Link to={`/edit-blog/${id}`} className="btn btn-edit">
                    Edit
                  </Link>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="blog-author-bio">
              <div className="author-avatar-large">
                <img
                  src={author.avatar || "/images/default-avatar.jpg"}
                  alt={author.name}
                />
              </div>
              <div className="author-details">
                <h3>About {author.name}</h3>
                <p>
                  {author.bio || `${author.name} is a contributor to BlogHub.`}
                </p>
                <Link to={`/author/${author.id}`} className="btn btn-sm">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <CommentSection blogId={id} comments={comments} />

        <RelatedBlogs currentBlogId={id} category={category} tags={tags} />
      </article>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Blog"
        >
          <div className="delete-confirmation">
            <p>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BlogDetails;
