import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';

function GenerateQuizTab() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      setUrl('');
      setIsLoading(false);
      setQuiz(null);
      setError('');
      setDifficulty('all');
      setSelectedTopics([]);
    };
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic URL validation
    if (!url || !url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }
    
    if (!url.includes('wikipedia.org')) {
      setError('Please enter a valid Wikipedia URL');
      return;
    }
    
    setIsLoading(true);
    setQuiz(null);
    
    try {
      const quizData = await api.generateQuiz(url, difficulty, selectedTopics);
      setQuiz(quizData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate quiz. Please try again.';
      setError(errorMessage);
      console.error('Quiz generation error:', err);
      
      // Show user-friendly error message based on error type
      if (errorMessage.includes('Network error') && errorMessage.includes('backend server is running')) {
        setError('Backend server not running: Please make sure the backend server is running on port 8001 and try again.');
      } else if (errorMessage.includes('Network error')) {
        setError('Network error: Please check your internet connection and try again.');
      } else if (errorMessage.includes('Invalid URL')) {
        setError('Please enter a valid Wikipedia URL.');
      } else if (errorMessage.includes('Quiz generation failed')) {
        setError('Failed to generate quiz. The article might be too short or not supported. Please try another Wikipedia article.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, difficulty, selectedTopics]);

  const handleTopicToggle = useCallback((topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  }, []);

  const resetForm = useCallback(() => {
    setUrl('');
    setQuiz(null);
    setError('');
    setDifficulty('all');
    setSelectedTopics([]);
  }, []);

  // Define distinct colors for topic filters
  const topicColors = {
    'AI': 'btn-primary',
    'Science': 'btn-secondary',
    'History': 'btn-accent',
    'Technology': 'btn-info',
    'Mathematics': 'btn-success'
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 md:p-8 rounded-2xl border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-6">Generate New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label htmlFor="wiki-url" className="block text-sm font-medium text-base-content mb-2">
              Wikipedia URL
              <span className="ml-1 tooltip tooltip-right" data-tip="Enter a valid Wikipedia article URL to generate a quiz">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </label>
            {/* Enhanced URL input field with distinct background and border */}
            <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-1 shadow-md">
              <input
                type="url"
                id="wiki-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl bg-base-100"
                disabled={isLoading}
                aria-describedby="url-help"
                aria-invalid={error ? 'true' : 'false'}
                aria-errormessage={error ? "url-error" : undefined}
              />
            </div>
            <div id="url-help" className="mt-1 text-sm text-base-content/70">
              Example: https://en.wikipedia.org/wiki/Machine_learning
            </div>
            {error && !quiz && (
              <p id="url-error" className="mt-2 text-sm text-error" role="alert">
                {error}
              </p>
            )}
          </div>
          
          {/* Combined Difficulty Level and Topic Filters sections in a single row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label htmlFor="difficulty" className="block text-sm font-medium text-base-content mb-2">
                Difficulty Level
              </label>
              {/* Compact difficulty buttons with consistent sizing and styling */}
              <div className="flex flex-wrap gap-2 mt-2 justify-center" role="radiogroup" aria-label="Difficulty Level">
                {['all', 'easy', 'medium', 'hard'].map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`btn btn-md rounded-full transition-all duration-300 font-semibold min-w-[80px] ${
                      level === 'all' ? 'btn-primary bg-primary hover:bg-primary/80' :
                      level === 'easy' ? 'btn-success bg-success hover:bg-success/80' :
                      level === 'medium' ? 'btn-warning bg-warning hover:bg-warning/80' :
                      'btn-error bg-error hover:bg-error/80'
                    } ${difficulty === level ? 'btn-active scale-105 ring-2 ring-offset-2 ring-opacity-50' : ''} ${
                      level === 'all' ? 'ring-primary' :
                      level === 'easy' ? 'ring-success' :
                      level === 'medium' ? 'ring-warning' :
                      'ring-error'
                    }`}
                    role="radio"
                    aria-checked={difficulty === level}
                    tabIndex={difficulty === level ? 0 : -1}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="form-control">
              <label className="block text-sm font-medium text-base-content mb-2">
                Topic Filters
                <span className="ml-1 tooltip tooltip-right" data-tip="Select multiple topics to focus your quiz">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </label>
              {/* Topic filters with distinct background colors */}
              <div className="flex flex-wrap gap-2 mt-2 justify-center" role="group" aria-label="Topic Filters">
                {['AI', 'Science', 'History', 'Technology', 'Mathematics'].map((topic) => (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleTopicToggle(topic)}
                    className={`btn btn-md rounded-full transition-all duration-300 font-semibold min-w-[80px] ${
                      selectedTopics.includes(topic) 
                        ? `${topicColors[topic]} bg-opacity-100 hover:bg-opacity-80` 
                        : `${topicColors[topic]} bg-opacity-20 hover:bg-opacity-30`
                    }`}
                    aria-pressed={selectedTopics.includes(topic)}
                    tabIndex={0}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            {/* Enhanced Generate Quiz button with larger size and distinctive styling */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-bold"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Generate Quiz'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Error display */}
      {error && quiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-4 rounded-lg border border-error bg-error/10 text-error"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error">Error</h3>
              <div className="mt-2 text-sm text-error">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <ul className="list-disc space-y-1 pl-5 text-sm text-error/80">
                  <li>Check your internet connection</li>
                  <li>Make sure the URL is a valid Wikipedia article</li>
                  <li>Try a different Wikipedia article</li>
                  <li>If the problem persists, try again later</li>
                  <li>Make sure the backend server is running on port 8001</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-8 text-center rounded-2xl border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md"
        >
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-16 w-16 border-t-4 border-primary"
            ></motion.div>
            <span className="mt-4 text-xl text-base-content font-medium">Analyzing Wikipedia article and generating quiz...</span>
            <p className="mt-2 text-base-content/70">This may take a few moments</p>
          </div>
        </motion.div>
      )}

      {/* Quiz display */}
      {quiz && (
        <div className="glass-panel p-6 rounded-2xl border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md">
          <QuizDisplay quiz={quiz} />
        </div>
      )}
    </div>
  );
}

export default GenerateQuizTab;