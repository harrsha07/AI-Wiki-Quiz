import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { RotateCcw, Clock, Trophy } from 'lucide-react';
import EnhancedResults from './EnhancedResults';

function QuizDisplay({ quiz }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [totalTime, setTotalTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    };
  }, []);

  if (!quiz) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Timer logic
  useEffect(() => {
    if (!showResults && quiz && quiz.quiz) {
      setTotalTime(quiz.quiz.length * 30);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next question or submit if last question
            if (currentQuestionIndex < quiz.quiz.length - 1) {
              handleNextQuestion();
              return 30; // Reset timer for next question
            } else {
              handleSubmit({ preventDefault: () => {} });
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, showResults, quiz]);

  const handleAnswerSelect = useCallback((questionIndex, option) => {
    if (showResults) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));

    // Auto-move to next question after a short delay
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    questionTimerRef.current = setTimeout(() => {
      if (currentQuestionIndex < quiz.quiz.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 1000);
  }, [currentQuestionIndex, quiz.quiz, showResults]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const total = quiz.quiz ? quiz.quiz.length : 1;
    const score = calculateScore();
    const percentage = Math.round((score / total) * 100);
    const taken = Math.floor((Date.now() - startTime) / 1000);

    // Clear timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);

    setTimeTaken(taken);
    setShowResults(true);

    const quizResult = {
      id: Date.now(),
      title: quiz.title,
      score: percentage,
      totalQuestions: total,
      correctAnswers: score,
      timeTaken: taken,
      date: new Date().toISOString()
    };

    try {
      const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      quizHistory.push(quizResult);
      localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    } catch (e) {
      console.error('Error saving quiz history:', e);
      // Show user-friendly error message
      alert('Warning: Could not save quiz history to localStorage. Your results will not be saved.');
    }

    try {
      const currentStats = JSON.parse(
        localStorage.getItem('quizStats') ||
        '{"totalQuizzes":0,"averageScore":0,"totalTime":0,"topics":[]}'
      );

      currentStats.totalQuizzes += 1;
      currentStats.totalTime += taken;
      currentStats.averageScore = Math.round(
        ((currentStats.averageScore * (currentStats.totalQuizzes - 1)) + percentage) /
        currentStats.totalQuizzes
      );

      const topic = quiz.title || 'General';
      const topicIndex = currentStats.topics.findIndex(t => t.name === topic);
      if (topicIndex >= 0) {
        const t = currentStats.topics[topicIndex];
        t.quizzes += 1;
        t.averageScore = Math.round(
          ((t.averageScore * (t.quizzes - 1)) + percentage) / t.quizzes
        );
      } else {
        currentStats.topics.push({ name: topic, quizzes: 1, averageScore: percentage });
      }

      localStorage.setItem('quizStats', JSON.stringify(currentStats));
    } catch (e) {
      console.error('Error updating stats:', e);
      // Show user-friendly error message
      alert('Warning: Could not update statistics. Your progress will not be tracked.');
    }

    if (percentage >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [quiz, startTime]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quiz.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30); // Reset timer for next question
    }
  }, [currentQuestionIndex, quiz.quiz]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeLeft(30); // Reset timer for previous question
    }
  }, [currentQuestionIndex]);

  const handleQuestionSelect = useCallback((index) => {
    if (!showResults) {
      setCurrentQuestionIndex(index);
      setTimeLeft(30); // Reset timer when jumping to a question
    }
  }, [showResults]);

  const resetQuiz = useCallback(() => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setShowConfetti(false);
    setShowPreview(true);
    
    // Clear any existing timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
  }, []);

  const getAnswerClass = useCallback((questionIndex, option) => {
    if (!showResults) {
      return selectedAnswers[questionIndex] === option
        ? 'bg-primary/20 border-primary'
        : 'border-base-300 hover:border-primary/50';
    }

    const correctAnswer = quiz.quiz[questionIndex]?.answer;
    if (option === correctAnswer) return 'bg-success/20 border-success';
    if (selectedAnswers[questionIndex] === option) return 'bg-error/20 border-error';
    return 'border-base-300';
  }, [quiz.quiz, selectedAnswers, showResults]);

  const isAnswerCorrect = useCallback((questionIndex) => {
    const question = quiz.quiz[questionIndex];
    return showResults && question && selectedAnswers[questionIndex] === question.answer;
  }, [quiz.quiz, selectedAnswers, showResults]);

  const calculateScore = useCallback(() => {
    if (!quiz || !quiz.quiz) return 0;
    return quiz.quiz.reduce((acc, q, i) => acc + (isAnswerCorrect(i) ? 1 : 0), 0);
  }, [quiz, isAnswerCorrect]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {showConfetti && <Confetti />}

      {/* PREVIEW MODE */}
      {showPreview && quiz.quiz && (
        <div className="glass-panel rounded-2xl border border-base-300 p-6 md:p-8 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              {quiz.title || 'Quiz'}
            </h2>
            <p className="text-lg text-base-content/80 mb-6 max-w-2xl mx-auto">
              Review the questions before starting the quiz
            </p>
            <div className="badge badge-primary badge-lg mb-4">
              {quiz.quiz.length} Questions
            </div>
          </div>

          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {quiz.quiz.map((question, index) => (
              <div key={index} className="bg-base-200 rounded-xl p-4 border border-base-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-primary">
                    Question {index + 1}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    question.difficulty === 'easy' ? 'bg-success/20 text-success' :
                    question.difficulty === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-error/20 text-error'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>
                <p className="text-base-content font-medium mb-3">{question.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option, i) => (
                    <div key={i} className="flex items-center p-2 bg-base-100 rounded-lg">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary font-bold text-xs mr-2">
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-4">
            <button 
              onClick={() => setShowPreview(false)} 
              className="btn btn-primary btn-lg rounded-full"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* QUIZ MODE */}
      {!showPreview && (
        <>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              {quiz.title || 'Quiz'}
            </h2>
            <p className="text-lg text-base-content/80 mb-6 max-w-2xl mx-auto">
              Test your knowledge with this quiz
            </p>
          </div>

          {/* Progress and Timer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-base-content/80">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {quiz.quiz.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-base-content/80">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">
                Time Left: {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {quiz.quiz.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuestionSelect(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuestionIndex
                    ? 'bg-primary scale-125'
                    : showResults && isAnswerCorrect(index)
                      ? 'bg-success'
                      : showResults && !isAnswerCorrect(index)
                        ? 'bg-error'
                        : 'bg-base-300'
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>

          {/* QUESTIONS */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {quiz.quiz.map((question, questionIndex) => (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`glass-panel rounded-2xl border border-base-300 p-6 md:p-8 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md ${
                    questionIndex === currentQuestionIndex ? 'block' : 'hidden'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <h3 className="text-2xl font-bold text-primary">
                      Question {questionIndex + 1} of {quiz.quiz.length}
                    </h3>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      question.difficulty === 'easy' ? 'bg-success/20 text-success' :
                      question.difficulty === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-error/20 text-error'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>

                  <p className="text-xl mb-6 text-base-content font-medium">{question.question}</p>

                  <div className="mt-4 space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <motion.div
                        key={optionIndex}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelect(questionIndex, option)}
                        className={`p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          getAnswerClass(questionIndex, option)
                        } ${showResults ? 'cursor-default' : 'hover:scale-[1.02]'}`}
                        role="radio"
                        aria-checked={selectedAnswers[questionIndex] === option}
                        tabIndex={showResults ? -1 : 0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleAnswerSelect(questionIndex, option);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary font-bold">
                            {['A', 'B', 'C', 'D'][optionIndex]}
                          </span>
                          <span className="ml-3 text-base-content font-medium">{option}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`btn btn-sm rounded-lg ${
                        currentQuestionIndex === 0 ? 'btn-disabled' : 'btn-primary btn-outline'
                      }`}
                    >
                      Previous
                    </motion.button>

                    {currentQuestionIndex === quiz.quiz.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="btn btn-primary btn-sm rounded-lg"
                      >
                        Submit Answers
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleNextQuestion}
                        className="btn btn-primary btn-sm rounded-lg"
                      >
                        Next
                      </motion.button>
                    )}
                  </div>

                  {showResults && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      isAnswerCorrect(questionIndex)
                        ? 'bg-success/10 border border-success/30'
                        : 'bg-error/10 border border-error/30'
                    }`}>
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className={`text-sm font-medium ${
                            isAnswerCorrect(questionIndex) ? 'text-success' : 'text-error'
                          }`}>
                            {isAnswerCorrect(questionIndex) ? 'Correct!' : 'Incorrect'}
                          </h3>
                          <div className={`mt-2 text-sm ${
                            isAnswerCorrect(questionIndex) ? 'text-success/80' : 'text-error/80'
                          }`}>
                            <p>
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                            {!isAnswerCorrect(questionIndex) && (
                              <p className="mt-1">
                                <span className="font-medium">Correct answer:</span> {question.answer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {!showResults ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-primary rounded-lg"
                >
                  Check Answers
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={resetQuiz}
                  className="btn btn-secondary rounded-lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Retake Quiz
                </motion.button>
              )}
            </div>
          </form>

          <AnimatePresence>
            {showResults && (
              <EnhancedResults
                score={calculateScore()}
                total={quiz.quiz.length}
                timeTaken={timeTaken}
                onRetake={resetQuiz}
                onClose={() => setShowResults(false)}
                showConfetti={showConfetti}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default QuizDisplay;