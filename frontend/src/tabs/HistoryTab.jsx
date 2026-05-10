import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';
import Modal from '../components/Modal';

function HistoryTab() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuizHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate that the api object and method exist
      if (!api || typeof api.getQuizHistory !== 'function') {
        throw new Error('API service not properly initialized');
      }
      
      const history = await api.getQuizHistory();
      
      // Validate that we received an array
      if (!Array.isArray(history)) {
        throw new Error('Invalid data format received from server');
      }
      
      setQuizzes(history);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch quiz history. Please try again.';
      setError(errorMessage);
      console.error('Error fetching quiz history:', err);
      
      // Show user-friendly error message based on error type
      if (errorMessage.includes('Network error') && errorMessage.includes('backend server is running')) {
        setError('Backend server not running: Please make sure the backend server is running on port 8001 and try again.');
      } else if (errorMessage.includes('Network error')) {
        setError('Network error: Please check your internet connection and try again.');
      } else if (errorMessage.includes('Unauthorized')) {
        setError('Authentication error: Please log in and try again.');
      } else {
        setError('Failed to load quiz history. Please refresh the page and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizHistory();
  }, [fetchQuizHistory]);

  const handleViewDetails = useCallback(async (quizId) => {
    try {
      // Validate quizId
      if (!quizId || typeof quizId !== 'number') {
        throw new Error('Invalid quiz ID');
      }
      
      // Validate that the api object and method exist
      if (!api || typeof api.getQuizById !== 'function') {
        throw new Error('API service not properly initialized');
      }
      
      const quiz = await api.getQuizById(quizId);
      
      // Validate that we received a quiz object
      if (!quiz || typeof quiz !== 'object') {
        throw new Error('Invalid quiz data received from server');
      }
      
      setSelectedQuiz(quiz);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch quiz details. Please try again.';
      setError(errorMessage);
      console.error('Error fetching quiz details:', err);
      
      // Show user-friendly error message based on error type
      if (errorMessage.includes('Network error') && errorMessage.includes('backend server is running')) {
        setError('Backend server not running: Please make sure the backend server is running on port 8001 and try again.');
      } else if (errorMessage.includes('Network error')) {
        setError('Network error: Please check your internet connection and try again.');
      } else if (errorMessage.includes('Quiz not found')) {
        setError('Quiz not found. It may have been deleted.');
      } else {
        setError('Failed to load quiz details. Please try again.');
      }
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    // Validate dateString
    if (!dateString || typeof dateString !== 'string') {
      return 'Invalid date';
    }
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  }, []);

  const handleRetakeQuiz = useCallback((quizId) => {
    // For now, we'll just view the quiz details
    // In a real app, you might want to generate a new quiz
    handleViewDetails(quizId);
  }, [handleViewDetails]);

  const handleShareQuiz = useCallback((quizId) => {
    try {
      // Create a shareable URL (in a real app, this would be a proper route)
      const shareUrl = `${window.location.origin}/quiz/${quizId}`;
      
      // Check if clipboard API is available
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(shareUrl);
        // In a real app, you would show a toast notification here
        console.log('Quiz URL copied to clipboard');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Quiz URL copied to clipboard (fallback method)');
      }
    } catch (e) {
      console.error('Error sharing quiz:', e);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border-l-4 border-error p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-error-content">Error Loading Quiz History</h3>
            <div className="mt-2 text-sm text-error-content">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={fetchQuizHistory}
                  className="btn btn-sm btn-error"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md">
      <div className="px-6 py-5 border-b border-base-300">
        <h2 className="text-2xl font-bold text-primary mb-2">Quiz History</h2>
        <p className="text-base-content/80">
          View all previously generated quizzes
        </p>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-base-content">No quizzes</h3>
          <p className="mt-1 text-base-content/80">
            Get started by generating your first quiz.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-200">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-primary uppercase tracking-wider" aria-sort="none">
                  ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-primary uppercase tracking-wider" aria-sort="none">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-primary uppercase tracking-wider" aria-sort="none">
                  URL
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-primary uppercase tracking-wider" aria-sort="none">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-primary uppercase tracking-wider" aria-sort="none">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100/50 divide-y divide-base-300">
              {quizzes.map((quiz) => (
                <tr key={quiz.id || quiz.quizId || quiz._id} className="hover:bg-base-200 transition-all duration-300">
                  <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm font-medium text-base-content" tabIndex="0">
                    {quiz.id || quiz.quizId || quiz._id || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm text-base-content" tabIndex="0">
                    <div className="max-w-[120px] md:max-w-none truncate font-medium">
                      {quiz.title || 'Untitled Quiz'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm">
                    {quiz.url ? (
                      <a 
                        href={quiz.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium underline"
                        tabIndex="0"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-base-content/50">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm text-base-content/80" tabIndex="0">
                    <div className="max-w-[100px] md:max-w-none truncate">
                      {formatDate(quiz.date_generated || quiz.dateGenerated || quiz.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs md:text-sm">
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      <button
                        onClick={() => handleViewDetails(quiz.id || quiz.quizId || quiz._id)}
                        className="btn btn-secondary btn-xs md:btn-sm rounded-lg"
                        aria-label={`View details for quiz ${quiz.title || 'Untitled'}`}
                        disabled={!quiz.id && !quiz.quizId && !quiz._id}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleRetakeQuiz(quiz.id || quiz.quizId || quiz._id)}
                        className="btn btn-primary btn-xs md:btn-sm rounded-lg"
                        aria-label={`Retake quiz ${quiz.title || 'Untitled'}`}
                        disabled={!quiz.id && !quiz.quizId && !quiz._id}
                      >
                        Retake
                      </button>
                      <button
                        onClick={() => handleShareQuiz(quiz.id || quiz.quizId || quiz._id)}
                        className="btn btn-accent btn-xs md:btn-sm rounded-lg"
                        aria-label={`Share quiz ${quiz.title || 'Untitled'}`}
                        disabled={!quiz.id && !quiz.quizId && !quiz._id}
                      >
                        Share
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for quiz details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedQuiz && <QuizDisplay quiz={selectedQuiz} />}
      </Modal>
    </div>
  );
}

export default HistoryTab;