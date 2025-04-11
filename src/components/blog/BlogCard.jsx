import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const BlogCard = ({ blog }) => {
  const {
    id,
    title,
    excerpt,
    coverImage,
    author,
    createdAt,
    category,
    readingTime,
    likes,
  } = blog;

  return (
    <article className="blog-card">
      <div className="blog-card-image">
        <Link to={`/blogs/${id}`}>
          <img
            src={coverImage || "/images/placeholder.jpg"}
            alt={title}
            loading="lazy"
          />
        </Link>
        {category && <span className="blog-category">{category}</span>}
      </div>

      <div className="blog-card-content">
        <h2 className="blog-title">
          <Link to={`/blogs/${id}`}>{title}</Link>
        </h2>

        <div className="blog-meta">
          <span className="blog-author">By {author.name}</span>
          <span className="blog-date">{formatDate(createdAt)}</span>
          {readingTime && (
            <span className="blog-reading-time">{readingTime} min read</span>
          )}
        </div>

        <p className="blog-excerpt">{excerpt}</p>

        <div className="blog-footer">
          <Link to={`/blogs/${id}`} className="read-more">
            Read More
          </Link>

          <div className="blog-stats">
            <span className="blog-likes">
              <svg className="heart-icon" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {likes}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
