import React, { useState, useEffect } from 'react';
import { GamifyEngine, GamifyProvider, useGamify, useLevelUp, useAchievement, useLeaderboard } from '@gamify-ui/core';
import './App.css';

// User Profile Component
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, loading, error, triggerEvent, level, xp, progress } = useGamify(userId);
  const levelUp = useLevelUp(userId);
  const achievement = useAchievement(userId);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (levelUp) {
      setNotification(`🎉 Level Up! You're now level ${levelUp.level}!`);
      setTimeout(() => setNotification(null), 3000);
    }
  }, [levelUp]);

  useEffect(() => {
    if (achievement) {
      setNotification(`🏆 Achievement Unlocked: ${achievement.achievement.title}!`);
      setTimeout(() => setNotification(null), 3000);
    }
  }, [achievement]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!user) return <div className="error">No user found</div>;

  const actions = [
    { name: 'Click', type: 'click', icon: '🖱️' },
    { name: 'Scroll', type: 'scroll', icon: '📜' },
    { name: 'Share', type: 'share', icon: '📤' },
    { name: 'Comment', type: 'comment', icon: '💬' },
    { name: 'Daily Check-in', type: 'daily', icon: '📅' },
    { name: 'Weekly Goal', type: 'weekly', icon: '📊' }
  ];

  return (
    <div className="user-panel">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      <h2>👤 User Profile</h2>
      
      <div className="user-info">
        <h3>Player Stats</h3>
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-value">{level}</div>
            <div className="stat-label">Level</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{xp}</div>
            <div className="stat-label">XP</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.badges.length}</div>
            <div className="stat-label">Badges</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{user.streaks.length}</div>
            <div className="stat-label">Streaks</div>
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="progress-text">
          {Math.round(progress * 100)}% to next level
        </div>
      </div>

      <div className="user-info">
        <h3>🎯 Actions</h3>
        <div className="actions">
          {actions.map(action => (
            <button
              key={action.type}
              className="btn btn-primary"
              onClick={() => triggerEvent(action.type, { element: 'button' })}
            >
              {action.icon} {action.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Leaderboard Component
const Leaderboard: React.FC = () => {
  const leaderboard = useLeaderboard(10);

  return (
    <div className="leaderboard-panel">
      <h2>🏆 Leaderboard</h2>
      <div className="leaderboard">
        {leaderboard.map((entry, index) => (
          <div key={entry.userId} className="leaderboard-item">
            <div className={`rank ${index < 3 ? `rank-${index + 1}` : 'rank-other'}`}>
              {entry.rank}
            </div>
            <div className="user-details">
              <div className="user-name">{entry.userName}</div>
              <div className="user-stats">Level {entry.level} • {entry.score} XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [engine] = useState(() => {
    const gamifyEngine = new GamifyEngine({
      debug: true,
      theme: {
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          background: '#ffffff',
          surface: '#f8f9fa',
          text: '#495057'
        }
      }
    });

    // Create demo users
    const users = [
      { id: 'user-1', name: 'John Doe', xp: 0 },
      { id: 'user-2', name: 'Jane Smith', xp: 150 },
      { id: 'user-3', name: 'Bob Johnson', xp: 300 },
      { id: 'user-4', name: 'Alice Brown', xp: 500 },
      { id: 'user-5', name: 'Charlie Wilson', xp: 750 }
    ];

    users.forEach(user => {
      gamifyEngine.createUser(user.id, user.name);
      if (user.xp > 0) {
        gamifyEngine.updateUser(user.id, { xp: user.xp });
      }
    });

    // Add game rules
    gamifyEngine.addRule({
      id: 'click-rule',
      trigger: {
        type: 'click',
        reward: { xp: 10 }
      },
      enabled: true,
      priority: 1
    });

    gamifyEngine.addRule({
      id: 'scroll-rule',
      trigger: {
        type: 'scroll',
        reward: { xp: 5 }
      },
      enabled: true,
      priority: 1
    });

    gamifyEngine.addRule({
      id: 'share-rule',
      trigger: {
        type: 'share',
        reward: { xp: 25 }
      },
      enabled: true,
      priority: 1
    });

    gamifyEngine.addRule({
      id: 'comment-rule',
      trigger: {
        type: 'comment',
        reward: { xp: 15 }
      },
      enabled: true,
      priority: 1
    });

    gamifyEngine.addRule({
      id: 'daily-rule',
      trigger: {
        type: 'daily',
        reward: { xp: 50 }
      },
      enabled: true,
      priority: 1
    });

    gamifyEngine.addRule({
      id: 'weekly-rule',
      trigger: {
        type: 'weekly',
        reward: { xp: 100 }
      },
      enabled: true,
      priority: 1
    });

    // Add missions
    gamifyEngine.addMission({
      id: 'first-click',
      title: 'First Click',
      description: 'Click for the first time',
      goal: { type: 'event', value: 1 },
      reward: { xp: 50 },
      repeatable: false,
      difficulty: 'easy'
    });

    gamifyEngine.addMission({
      id: 'click-master',
      title: 'Click Master',
      description: 'Click 10 times',
      goal: { type: 'event', value: 10 },
      reward: { xp: 100 },
      repeatable: false,
      difficulty: 'medium'
    });

    return gamifyEngine;
  });

  return (
    <GamifyProvider engine={engine}>
      <div className="container">
        <div className="header">
          <h1>🎮 @gamify-ui/core</h1>
          <p>React Gamification Demo</p>
        </div>

        <div className="content">
          <UserProfile userId="user-1" />
          <Leaderboard />
        </div>
      </div>
    </GamifyProvider>
  );
};

export default App; 