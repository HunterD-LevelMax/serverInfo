/**
 * API Service for Server Monitoring
 * Handles all data fetching from the PHP backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/php-server/server_data.php';

export const serverApi = {
  /**
   * Fetch server monitoring data
   * @returns {Promise<Object>} Server data object
   */
  async fetchData() {
    try {
      const response = await fetch(`${API_BASE_URL}?_=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching server data:', error);
      throw error;
    }
  }
};

export default serverApi;
