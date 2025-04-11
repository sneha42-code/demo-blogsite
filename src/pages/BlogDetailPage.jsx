import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../hooks/useAuth';
import Comment from '../components/blog/Comment';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/formatDate';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    currentBlog, 
    loading, 
    error, 
    fetchBlogById, 
    toggleLikeBlog, 
    addComment, 
    deleteBlog 
  } = useBlog();
  
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    fetchBlogById(id);
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [fetchBlogById, id]);

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/blogs/${id}` } });
      return;
    }
    
    await toggleLikeBlog(id);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    if (!currentUser) {
      navigate('/login', { state: { from: `/blogs/${id}` } });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addComment(id, { content: comment });
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      const result = await deleteBlog(id);
      if (result.success) {
        navigate('/blogs');
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <Loading />;
  
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
        <Link to="/blogs" className="btn btn-secondary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="not-found-container container">
        <h2>Blog Not Found</h2>
        <p>The blog you're looking for doesn't exist or may have been removed.</p>
        <Link to="/blogs" className="btn btn-primary">
          Browse Blogs
        </Link>
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
    comments,
    readingTime
  } = currentBlog;

  const isAuthor = currentUser && author.id === currentUser.id;
  const hasLiked = currentUser && currentBlog.likedBy?.includes(currentUser.id);

  return (
    <div className="blog-detail-page">
      <div className="blog-header">
        <div className="container">
          {category && (
            <div className="blog-category">
              <span>{category}</span>
            </div>
      
      <div className="blog-comments-section">
        <div className="container">
          <h2 className="comments-title">Comments ({comments?.length || 0})</h2>
          
          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="form-group">
                <textarea
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting || !comment.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="login-to-comment">
              <p>Please <Link to={`/login?redirect=/blogs/${id}`}>login</Link> to add a comment</p>
            </div>
          )}
          
          <div className="comments-list">
            {comments?.length > 0 ? (
              comments.map(comment => (
                <Comment key={comment.id} comment={comment} blogId={id} />
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <Modal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Blog"
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
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
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    )}
          
          <h1 className="blog-title">{title}</h1>
          
          <div className="blog-meta">
            <div className="author-info">
              <img 
                src={author.avatar || '/images/default-avatar.jpg'} 
                alt={author.name}
                className="author-avatar" 
              />
              <span className="author-name">By {author.name}</span>
            </div>
            
            <div className="blog-details">
              <span className="blog-date">{formatDate(createdAt)}</span>
              {readingTime && (
                <span className="reading-time">{readingTime} min read</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
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
              {tags.map(tag => (
                <Link to={`/blogs?tag=${tag}`} key={tag} className="tag">
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          
          <div className="blog-actions">
            <button 
              className={`like-button ${hasLiked ? 'liked' : ''}`}
              onClick={handleLike}
              aria-label={hasLiked ? 'Unlike this blog' : 'Like this blog'}
            >
              <svg className="heart-icon" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{likes || 0}</span>
            </button>
            
            {isAuthor && (
              <div className="author-actions">
                <Link 
                  to={`/edit-blog/${id}`} 
                  className="btn btn-edit"
                >
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
            <div className="author-avatar">
              <img 
                src={author.avatar || '/images/default-avatar.jpg'} 
                alt={author.name}
              />
            </div>
            <div className="author-details">
              <h3>About {author.name}</h3>
              <p>{author.bio || `${author.name} is a contributor to BlogHub.`}</p>
              <Link to={`/author/${author.id}`} className="btn btn-sm">
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>