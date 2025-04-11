import { useContext } from 'react';
import { BlogContext } from '../contexts/BlogContext';

/**
 * Custom hook for accessing the blog context
 * @returns {Object} Blog context values and methods
 */
export const useBlog = () => {
  const context = useContext(BlogContext);
  
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  
  return context;
};