import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { Trophy, Target, Clock, BookOpen } from 'lucide-react';

function StatsDashboard() {
  // Initialize with safe default values
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalTime: 0, // minutes
    topics: [],
    scoresOverTime: []
  });
  
  const [topicSort, setTopicSort] = useState('name'); // name, quizzes, averageScore
  const [topicSortDirection, setTopicSortDirection] = useState('asc'); // asc, desc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safely load user stats from localStorage
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we're in a browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedStats = localStorage.getItem('quizStats');
          if (savedStats) {
            const parsedStats = JSON.parse(savedStats);
            
            // Validate the structure of the stats
            const validatedStats = {
              totalQuizzes: typeof parsedStats.totalQuizzes === 'number' ? parsedStats.totalQuizzes : 0,
              averageScore: typeof parsedStats.averageScore === 'number' ? parsedStats.averageScore : 0,
              totalTime: typeof parsedStats.totalTime === 'number' ? parsedStats.totalTime : 0,
              topics: Array.isArray(parsedStats.topics) ? parsedStats.topics : [],
              scoresOverTime: Array.isArray(parsedStats.scoresOverTime) ? parsedStats.scoresOverTime : []
            };
            
            setQuizStats(validatedStats);
          }
        }
      } catch (e) {
        console.error('Error loading quiz stats:', e);
        setError('Failed to load statistics. Your stats data may be corrupted.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Colors for charts
  const COLORS = ['#7C3AED', '#EC4899', '#14B8A6', '#A855F7', '#22D3EE'];
  
  // Format time in hours and minutes safely
  const formatTime = useCallback((minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
      return '0h 0m';
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  // Memoize sorted topics to prevent unnecessary recalculations
  const sortedTopics = useMemo(() => {
    if (!Array.isArray(quizStats.topics)) return [];
    
    return [...quizStats.topics].sort((a, b) => {
      // Validate that a and b have the required properties
      if (!a || !b) return 0;
      
      if (topicSort === 'name') {
        const nameA = typeof a.name === 'string' ? a.name : '';
        const nameB = typeof b.name === 'string' ? b.name : '';
        return topicSortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        const valA = typeof a[topicSort] === 'number' ? a[topicSort] : 0;
        const valB = typeof b[topicSort] === 'number' ? b[topicSort] : 0;
        return topicSortDirection === 'asc' ? valA - valB : valB - valA;
      }
    });
  }, [quizStats.topics, topicSort, topicSortDirection]);

  // Find best score from topics
  const bestScore = useMemo(() => {
    if (!Array.isArray(quizStats.topics) || quizStats.topics.length === 0) return 0;
    
    const scores = quizStats.topics
      .map(topic => typeof topic.averageScore === 'number' ? topic.averageScore : 0)
      .filter(score => !isNaN(score));
      
    return scores.length > 0 ? Math.max(...scores) : 0;
  }, [quizStats.topics]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 rounded-lg border border-base-300 shadow-lg bg-base-100/80 backdrop-blur-md">
          <p className="font-semibold text-base-content">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('Score') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle sorting
  const handleSort = useCallback((field) => {
    if (topicSort === field) {
      setTopicSortDirection(topicSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTopicSort(field);
      setTopicSortDirection('asc');
    }
  }, [topicSort, topicSortDirection]);

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
            <h3 className="text-sm font-medium text-error-content">Error Loading Statistics</h3>
            <div className="mt-2 text-sm text-error-content">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="btn btn-sm btn-error"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-lg p-6 border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-base-content mb-6">Your Quiz Statistics</h2>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center border border-base-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-primary/20 text-primary rounded-full p-3 mr-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Total Quizzes</p>
              <p className="text-2xl font-bold">{quizStats.totalQuizzes || 0}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center border border-base-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-secondary/20 text-secondary rounded-full p-3 mr-4">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Average Score</p>
              <p className="text-2xl font-bold">{isNaN(quizStats.averageScore) ? 0 : Math.round(quizStats.averageScore)}%</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center border border-base-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-accent/20 text-accent rounded-full p-3 mr-4">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Best Score</p>
              <p className="text-2xl font-bold">{bestScore}%</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center border border-base-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-info/20 text-info rounded-full p-3 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Time Spent</p>
              <p className="text-2xl font-bold">{formatTime(quizStats.totalTime)}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Over Time */}
          <div className="glass-panel rounded-lg p-4 border border-base-300">
            <h3 className="text-lg font-semibold mb-4 text-base-content">Score Progress</h3>
            <div className="h-80">
              {Array.isArray(quizStats.scoresOverTime) && quizStats.scoresOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quizStats.scoresOverTime}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis domain={[0, 100]} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#7C3AED" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                      dot={{ strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-base-content/50">
                  No data available
                </div>
              )}
            </div>
          </div>
          
          {/* Topics Distribution */}
          <div className="glass-panel rounded-lg p-4 border border-base-300">
            <h3 className="text-lg font-semibold mb-4 text-base-content">Topics Distribution</h3>
            <div className="h-80">
              {Array.isArray(quizStats.topics) && quizStats.topics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quizStats.topics}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quizzes"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {quizStats.topics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-base-content/50">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Topic Performance with sorting */}
        <div className="mt-8 glass-panel rounded-lg p-4 border border-base-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-base-content">Topic Performance</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`btn btn-xs rounded-lg ${topicSort === 'name' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleSort('name')}
              >
                Name {topicSort === 'name' && (topicSortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`btn btn-xs rounded-lg ${topicSort === 'quizzes' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleSort('quizzes')}
              >
                Quizzes {topicSort === 'quizzes' && (topicSortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`btn btn-xs rounded-lg ${topicSort === 'averageScore' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleSort('averageScore')}
              >
                Score {topicSort === 'averageScore' && (topicSortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
          <div className="h-80">
            {Array.isArray(sortedTopics) && sortedTopics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedTopics}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis domain={[0, 100]} stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="averageScore" name="Average Score" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-base-content/50">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsDashboard;