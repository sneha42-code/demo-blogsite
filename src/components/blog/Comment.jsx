import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useBlog } from "../../hooks/useBlog";
import { formatDate } from "../../utils/formatDate";

const Comment = ({ comment, blogId }) => {
  const { currentUser } = useAuth();
  const { addComment } = useBlog();

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id, content, author, createdAt, replies = [] } = comment;

  const isAuthor = currentUser && author.id === currentUser.id;

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addComment(blogId, {
        content: replyContent,
        parentId: id,
      });

      setReplyContent("");
      setIsReplying(false);
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <img
            src={author.avatar || "/images/default-avatar.jpg"}
            alt={author.name}
            className="author-avatar"
          />
          <div className="author-info">
            <span className="author-name">{author.name}</span>
            <span className="comment-date">{formatDate(createdAt)}</span>
          </div>
        </div>

        {isAuthor && (
          <div className="comment-actions">
            <button className="edit-comment">Edit</button>
            <button className="delete-comment">Delete</button>
          </div>
        )}
      </div>

      <div className="comment-content">
        <p>{content}</p>
      </div>

      <div className="comment-footer">
        {currentUser && (
          <button
            className="reply-button"
            onClick={() => setIsReplying(!isReplying)}
          >
            {isReplying ? "Cancel" : "Reply"}
          </button>
        )}
      </div>

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="2"
            required
            disabled={isSubmitting}
          ></textarea>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="btn btn-sm btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      )}

      {replies.length > 0 && (
        <div className="comment-replies">
          {replies.map((reply) => (
            <div key={reply.id} className="reply-item">
              <div className="reply-header">
                <div className="reply-author">
                  <img
                    src={reply.author.avatar || "/images/default-avatar.jpg"}
                    alt={reply.author.name}
                    className="author-avatar small"
                  />
                  <div className="author-info">
                    <span className="author-name">{reply.author.name}</span>
                    <span className="reply-date">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="reply-content">
                <p>{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
