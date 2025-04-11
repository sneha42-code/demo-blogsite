import api from "./api";

/**
 * Service for blog-related API operations
 */
class BlogService {
  /**
   * Get all blogs
   * @returns {Promise<Array>} Array of blog objects
   */
  async getBlogs() {
    return api.get("/blogs");
  }

  /**
   * Get blog by ID
   * @param {string|number} id Blog ID
   * @returns {Promise<Object>} Blog object
   */
  async getBlogById(id) {
    return api.get(`/blogs/${id}`);
  }

  /**
   * Create a new blog
   * @param {Object} blogData Blog data
   * @returns {Promise<Object>} Created blog object
   */
  async createBlog(blogData) {
    return api.post("/blogs", blogData);
  }

  /**
   * Update a blog
   * @param {string|number} id Blog ID
   * @param {Object} blogData Updated blog data
   * @returns {Promise<Object>} Updated blog object
   */
  async updateBlog(id, blogData) {
    return api.put(`/blogs/${id}`, blogData);
  }

  /**
   * Delete a blog
   * @param {string|number} id Blog ID
   * @returns {Promise<void>}
   */
  async deleteBlog(id) {
    return api.delete(`/blogs/${id}`);
  }

  /**
   * Toggle like on a blog
   * @param {string|number} id Blog ID
   * @returns {Promise<Object>} Updated blog object
   */
  async toggleLikeBlog(id) {
    return api.post(`/blogs/${id}/like`);
  }

  /**
   * Add a comment to a blog
   * @param {string|number} blogId Blog ID
   * @param {Object} commentData Comment data
   * @returns {Promise<Object>} Updated blog object with new comment
   */
  async addComment(blogId, commentData) {
    return api.post(`/blogs/${blogId}/comments`, commentData);
  }

  /**
   * Get blogs by user ID
   * @param {string|number} userId User ID
   * @returns {Promise<Array>} Array of user's blog objects
   */
  async getUserBlogs(userId) {
    return api.get(`/users/${userId}/blogs`);
  }

  /**
   * Search blogs by term
   * @param {string} searchTerm Search term
   * @returns {Promise<Array>} Array of matching blog objects
   */
  async searchBlogs(searchTerm) {
    return api.get("/blogs/search", { q: searchTerm });
  }

  /**
   * Get blogs by category
   * @param {string} category Category name
   * @returns {Promise<Array>} Array of blog objects in the category
   */
  async getBlogsByCategory(category) {
    return api.get("/blogs", { category });
  }

  /**
   * Get featured blogs
   * @returns {Promise<Array>} Array of featured blog objects
   */
  async getFeaturedBlogs() {
    return api.get("/blogs/featured");
  }

  /**
   * Get popular blogs
   * @returns {Promise<Array>} Array of popular blog objects
   */
  async getPopularBlogs() {
    return api.get("/blogs/popular");
  }

  /**
   * Upload blog image
   * @param {File} imageFile Image file
   * @returns {Promise<Object>} Image URL and details
   */
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${api.API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    return response.json();
  }
}

export default new BlogService();
