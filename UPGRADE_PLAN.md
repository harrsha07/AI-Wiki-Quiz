# AI Wiki Quiz Generator - Upgrade Plan

This document outlines a step-by-step implementation plan for upgrading the AI Wiki Quiz Generator with modern UI/UX enhancements, focusing on three key areas:

1. **Animations with Framer Motion**
2. **Quiz Timer + Progress Bar**
3. **Results Screen Redesign with Confetti**

## Prerequisites

First, install the required dependencies:

```bash
cd frontend
npm install framer-motion react-confetti lucide-react
```

## 1. Animations with Framer Motion

### 1.1 Update QuizDisplay Component

Modify `frontend/src/components/QuizDisplay.jsx` to add smooth animations:

```jsx
// Add imports at the top
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

// Wrap the main container with motion.div
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="space-y-6"
>

// Animate question transitions
<AnimatePresence mode="wait">
  {quiz.quiz && quiz.quiz.map((question, questionIndex) => (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 ${questionIndex === currentQuestionIndex ? 'block' : 'hidden'}`}
    >
      {/* ... existing content ... */}
    </motion.div>
  ))}
</AnimatePresence>

// Animate answer options
{question.options.map((option, optionIndex) => {
  const letters = ['A', 'B', 'C', 'D'];
  return (
    <motion.div
      key={optionIndex}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleAnswerSelect(questionIndex, option)}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        getAnswerClass(questionIndex, option)
      } ${showResults ? 'cursor-default' : 'hover:bg-gray-50'}`}
    >
      {/* ... existing content ... */}
    </motion.div>
  );
})}

// Animate navigation buttons
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  type="button"
  onClick={handlePrevQuestion}
  disabled={currentQuestionIndex === 0}
  className={`px-4 py-2 rounded-md ${currentQuestionIndex === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
>
  Previous
</motion.button>
```

### 1.2 Update GenerateQuizTab Component

Modify `frontend/src/tabs/GenerateQuizTab.jsx` to add animations:

```jsx
// Add import at the top
import { motion } from 'framer-motion';

// Animate the form container
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="bg-white shadow rounded-lg p-6"
>
  {/* ... existing form content ... */}
</motion.div>

// Animate topic filter buttons
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  type="button"
  onClick={() => setSelectedTopics(prev => 
    prev.includes('AI') ? prev.filter(t => t !== 'AI') : [...prev, 'AI']
  )}
  className={`px-3 py-1 text-sm rounded-full ${
    selectedTopics.includes('AI') 
      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
      : 'bg-gray-100 text-gray-800 border border-gray-300'
  }`}
>
  AI
</motion.button>
```

## 2. Quiz Timer + Progress Bar

### 2.1 Add Timer State to QuizDisplay

Modify `frontend/src/components/QuizDisplay.jsx`:

```jsx
// Add new state variables
const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
const [totalTime, setTotalTime] = useState(0);
const timerRef = useRef(null);

// Add useEffect for timer
useEffect(() => {
  if (!showResults && quiz && quiz.quiz) {
    // Set total time based on number of questions (30 seconds per question)
    setTotalTime(quiz.quiz.length * 30);
    
    // Start timer for current question
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next question when time runs out
          if (currentQuestionIndex < quiz.quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            return 30; // Reset timer for next question
          } else {
            // Submit quiz if last question
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

// Add timer bar to the progress section
<div className="mb-6">
  {/* ... existing progress bar ... */}
  
  {/* Timer bar */}
  <div className="mt-4">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Time Remaining</span>
      <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${(timeLeft / 30) * 100}%` }}
        animate={{ width: `${(timeLeft / 30) * 100}%` }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </div>
  </div>
</div>
```

### 2.2 Update Answer Selection to Reset Timer

Modify the `handleAnswerSelect` function:

```jsx
const handleAnswerSelect = (questionIndex, option) => {
  if (showResults) return; // Prevent changing answers after showing results
  
  setSelectedAnswers(prev => ({
    ...prev,
    [questionIndex]: option
  }));
  
  // Reset timer for this question
  setTimeLeft(30);
  
  // Auto-advance to next question after 1 second
  setTimeout(() => {
    if (currentQuestionIndex < quiz.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, 1000);
};
```

## 3. Results Screen Redesign with Confetti

### 3.1 Install and Import Confetti

Modify `frontend/src/components/QuizDisplay.jsx`:

```jsx
// Add import at the top
import Confetti from 'react-confetti';

// Add confetti state
const [showConfetti, setShowConfetti] = useState(false);

// Update handleSubmit to trigger confetti for high scores
const handleSubmit = (e) => {
  e.preventDefault();
  setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
  setShowResults(true);
  
  // Show confetti if score is 80% or higher
  const score = calculateScore();
  const total = quiz.quiz ? quiz.quiz.length : 1;
  if (score / total >= 0.8) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Hide after 5 seconds
  }
};
```

### 3.2 Create Enhanced Results Display

Replace the existing results display with an enhanced version:

```jsx
{showResults && (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    {showConfetti && <Confetti />}
    
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
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
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-6"
        >
          {calculateScore() / (quiz.quiz ? quiz.quiz.length : 1) >= 0.8 ? (
            <Trophy className="h-10 w-10 text-white" />
          ) : (
            <CheckCircle className="h-10 w-10 text-white" />
          )}
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz Completed!
        </h2>
        
        <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {calculateScore()}/{quiz.quiz ? quiz.quiz.length : 0}
        </div>
        
        <p className="text-gray-600 mb-6">
          {calculateScore() / (quiz.quiz ? quiz.quiz.length : 1) >= 0.8
            ? "🔥 Great job! You're an AI expert!"
            : calculateScore() / (quiz.quiz ? quiz.quiz.length : 1) >= 0.6
            ? "👍 Good work! Keep learning!"
            : "📚 Keep studying and try again!"}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Retake Quiz
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResults(false)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
)}
```

### 3.3 Update the Regular Score Display

Modify the regular score display to be more visually appealing:

```jsx
<div className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600">
  <CheckCircle className="mr-2 h-5 w-5" />
  Score: {calculateScore()}/{quiz.quiz ? quiz.quiz.length : 0} 
  <span className="ml-2 text-sm opacity-90">({timeTaken > 0 ? `${timeTaken}s` : 'N/A'})</span>
</div>
```

## 4. Additional UI Enhancements

### 4.1 Add Loading Animations

Update the loading indicator in `GenerateQuizTab.jsx`:

```jsx
{isLoading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white shadow rounded-lg p-6"
  >
    <div className="flex justify-center items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-12 w-12 border-t-2 border-indigo-600"
      ></motion.div>
      <span className="ml-3 text-lg text-gray-600">Analyzing Wikipedia article and generating quiz...</span>
    </div>
  </motion.div>
)}
```

### 4.2 Add Micro-interactions

Add hover effects to various elements:

```jsx
// Add to answer options
<motion.div
  whileHover={{ 
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  }}
  whileTap={{ scale: 0.98 }}
  // ... existing props
>
```

## 5. Implementation Steps

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install framer-motion react-confetti lucide-react
   ```

2. **Update QuizDisplay Component**:
   - Add animation imports
   - Implement question transitions
   - Add timer functionality
   - Redesign results screen with confetti
   - Add micro-interactions

3. **Update GenerateQuizTab Component**:
   - Add form animations
   - Enhance button interactions

4. **Test All Features**:
   - Verify animations work smoothly
   - Test timer functionality
   - Confirm confetti appears for high scores
   - Ensure all interactions feel responsive

## 6. Expected Outcomes

After implementing these upgrades, the AI Wiki Quiz Generator will have:

- **Smooth Animations**: Professional transitions and micro-interactions
- **Engaging Timer**: Visual countdown that enhances the quiz experience
- **Celebratory Results**: Confetti and motivational messages for high scores
- **Modern UI**: Enhanced visual feedback and polished interactions
- **Improved UX**: More intuitive and rewarding user experience

These enhancements will transform the application from a functional prototype to a professional-grade quiz platform that feels engaging and rewarding to use.