import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { CheckCircle, Trophy, RotateCcw, Eye } from 'lucide-react';

function EnhancedResults({ score, total, timeTaken, onRetake, onClose, showConfetti }) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add to leaderboard if score is high
  useEffect(() => {
    const addToLeaderboard = async () => {
      if (percentage >= 85) {
        try {
          // Check if we're in a browser environment
          if (typeof window !== 'undefined' && window.localStorage) {
            const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
            // In a real app, you might want to show a modal instead of prompt
            // For now, we'll use a default name to avoid blocking
            const userName = 'Anonymous'; // Default name to avoid blocking UI
            
            if (userName) {
              const newEntry = {
                id: Date.now(),
                name: userName,
                score: Math.round(percentage),
                quizzes: 1
              };
              
              const updatedLeaderboard = [...leaderboard, newEntry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10); // Keep only top 10
              
              localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
            }
          }
        } catch (e) {
          console.error('Error updating leaderboard:', e);
        }
      }
    };

    addToLeaderboard();
  }, [percentage]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Format time safely
  const formatTime = useCallback((seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return 'N/A';
    }
    return `${seconds}s`;
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="glass-panel rounded-2xl shadow-2xl p-8 max-w-md w-full border border-base-300 bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary mb-6"
            >
              {percentage >= 80 ? (
                <Trophy className="h-10 w-10 text-white" />
              ) : (
                <CheckCircle className="h-10 w-10 text-white" />
              )}
            </motion.div>
            
            <h2 id="modal-title" className="text-2xl font-bold text-base-content mb-2">
              Quiz Completed!
            </h2>
            
            <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {score}/{total}
            </div>
            
            <p id="modal-description" className="text-base-content/80 mb-6">
              {percentage >= 80
                ? "🔥 Great job! You're an AI expert!"
                : percentage >= 60
                ? "👍 Good work! Keep learning!"
                : "📚 Keep studying and try again!"}
            </p>
            
            <div className="glass-panel rounded-xl p-4 mb-6 border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
              <div className="flex justify-between text-sm text-base-content/80">
                <span>Time Taken:</span>
                <span className="font-medium">{formatTime(timeTaken)}</span>
              </div>
              <div className="flex justify-between text-sm text-base-content/80 mt-1">
                <span>Accuracy:</span>
                <span className="font-medium">{isNaN(percentage) ? 'N/A' : Math.round(percentage)}%</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetake}
                className="btn btn-primary rounded-lg"
                aria-label="Retake the quiz"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Retake Quiz
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn btn-secondary rounded-lg"
                aria-label="Close results and return to quiz history"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default EnhancedResults;