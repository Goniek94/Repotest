import api from './api';

const CommentsService = {
  // Get all comments for a specific listing
  getComments: async (adId) => {
    return api.get(`/comments/${adId}`);
  },

  // Add a comment to a listing with an image
  addComment: async (adId, content, image) => {
    // Create a FormData object to send the image
    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', image);

    return api.post(`/comments/${adId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    return api.delete(`/comments/${commentId}`);
  },

  // Check if user has already commented on this listing
  hasUserCommented: async (adId) => {
    try {
      const response = await api.get(`/comments/${adId}/user`);
      return {
        hasCommented: response.data.hasCommented,
        comment: response.data.comment
      };
    } catch (error) {
      console.error('Error checking if user has commented:', error);
      return {
        hasCommented: false,
        comment: null
      };
    }
  }
};

export default CommentsService;
