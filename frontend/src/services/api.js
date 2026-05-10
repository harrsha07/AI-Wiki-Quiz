const API_BASE_URL = 'https://ai-wiki-quiz-c0xf.onrender.com/api';

// Helper function to safely parse JSON responses
const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error:', e);
    return null;
  }
};

// Helper function to check if response is OK and handle errors
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorText = await response.text();
      const errorData = safeJsonParse(errorText);
      
      if (errorData && (errorData.error || errorData.message || errorData.detail)) {
        errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
      }
    } catch (e) {
      // If we can't parse the error, use the default message
      console.error('Error parsing error response:', e);
    }
    
    throw new Error(errorMessage);
  }
  
  // Try to parse JSON response
  const text = await response.text();
  if (!text) {
    return null;
  }
  
  const data = safeJsonParse(text);
  if (data === null) {
    throw new Error('Invalid JSON response from server');
  }
  
  return data;
};

// Helper function to check if backend is reachable
const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, { method: 'GET', timeout: 5000 });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const api = {
  // Generate a quiz from a Wikipedia URL
  generateQuiz: async (url, difficulty = 'all', topics = []) => {
    // Validate inputs
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    const requestBody = { url };
    
    // Add difficulty filter if specified
    if (difficulty && difficulty !== 'all' && typeof difficulty === 'string') {
      requestBody.difficulty = difficulty;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await handleResponse(response);
      
      // Handle API response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to generate quiz');
      }
      
      return result.data || {};
    } catch (error) {
      // Re-throw the error with additional context if needed
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Check if backend is reachable
        const isBackendReachable = await checkBackendConnection();
        if (!isBackendReachable) {
          throw new Error('Network error: Unable to connect to the server. Please make sure the backend server is running.');
        } else {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
        }
      }
      throw error;
    }
  },
  
  // Get quiz history
  getQuizHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const result = await handleResponse(response);
      
      // Handle API response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to fetch quiz history');
      }
      
      return Array.isArray(result.data?.quizzes) ? result.data.quizzes : [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Check if backend is reachable
        const isBackendReachable = await checkBackendConnection();
        if (!isBackendReachable) {
          throw new Error('Network error: Unable to connect to the server. Please make sure the backend server is running.');
        } else {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
        }
      }
      throw error;
    }
  },
  
  // Get a specific quiz by ID
  getQuizById: async (id) => {
    // Validate input
    if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
      throw new Error('Invalid quiz ID provided');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/${id}`);
      const result = await handleResponse(response);
      
      // Handle API response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to fetch quiz');
      }
      
      return result.data || {};
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Check if backend is reachable
        const isBackendReachable = await checkBackendConnection();
        if (!isBackendReachable) {
          throw new Error('Network error: Unable to connect to the server. Please make sure the backend server is running.');
        } else {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
        }
      }
      throw error;
    }
  }
};