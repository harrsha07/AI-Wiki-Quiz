import React, { useState, useEffect } from 'react';

const achievements = [
  { id: 1, name: 'First Quiz', description: 'Complete your first quiz', icon: '🎯', unlocked: false },
  { id: 2, name: 'Quiz Master', description: 'Score 90% or higher on 5 quizzes', icon: '🏆', unlocked: false },
  { id: 3, name: 'Streak Builder', description: 'Complete quizzes for 7 consecutive days', icon: '🔥', unlocked: false },
  { id: 4, name: 'Speed Demon', description: 'Complete a quiz in under 2 minutes', icon: '⚡', unlocked: false },
  { id: 5, name: 'Topic Explorer', description: 'Complete quizzes on 10 different topics', icon: '📚', unlocked: false },
  { id: 6, name: 'Difficulty Crusher', description: 'Complete 3 hard difficulty quizzes', icon: '💪', unlocked: false },
];

function Achievements() {
  const [userAchievements, setUserAchievements] = useState(achievements);
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  // Simulate unlocking an achievement
  const unlockAchievement = (achievementId) => {
    const updatedAchievements = userAchievements.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const unlockedAchievement = { ...achievement, unlocked: true };
        setNewAchievement(unlockedAchievement);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return unlockedAchievement;
      }
      return achievement;
    });
    setUserAchievements(updatedAchievements);
  };

  // Example: Unlock first quiz achievement
  useEffect(() => {
    // In a real app, this would be triggered by actual user actions
    // unlockAchievement(1);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {userAchievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-lg border-2 flex flex-col items-center text-center transition-all duration-300 ${
              achievement.unlocked 
                ? 'border-yellow-400 bg-yellow-50 transform scale-105' 
                : 'border-gray-200 bg-gray-50 opacity-75'
            }`}
          >
            <span className="text-3xl mb-2">{achievement.icon}</span>
            <h4 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
              {achievement.name}
            </h4>
            <p className={`text-sm mt-1 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {achievement.description}
            </p>
            {achievement.unlocked && (
              <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Unlocked!
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Achievement notification */}
      {showNotification && newAchievement && (
        <div className="fixed bottom-4 right-4 bg-white border-l-4 border-yellow-400 rounded-lg shadow-lg p-4 animate-bounce">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{newAchievement.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">Achievement Unlocked!</h4>
              <p className="text-sm text-gray-600">{newAchievement.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Achievements;