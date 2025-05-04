
import React from 'react';

interface StatsDisplayProps {
  username: string;
  totalContributions: number | null;
  stats: {
    total: number;
    currentStreak: number;
    longestStreak: number;
    dateRange: string;
  }
}

export default function StatsDisplay({ username, totalContributions, stats }: StatsDisplayProps) {
  return (
    <div className="github-stats-container hidden">
      <div className="github-stat-item">
        <span className="github-stat-title">Contributions in the last year</span>
        <span className="github-stat-value" id={`${username}-total-contrib`}>
          {totalContributions !== null ? totalContributions : (stats.total || 0)}
        </span>
        <span className="github-stat-subtitle" id={`${username}-date-range`}>{stats.dateRange}</span>
      </div>
      
      <div className="github-stat-item">
        <span className="github-stat-title">Longest streak</span>
        <span className="github-stat-value" id={`${username}-longest-streak`}>{stats.longestStreak || 0} days</span>
        <span className="github-stat-subtitle">Rock - Hard Place</span>
      </div>
      
      <div className="github-stat-item">
        <span className="github-stat-title">Current streak</span>
        <span className="github-stat-value" id={`${username}-current-streak`}>{stats.currentStreak || 0} days</span>
        <span className="github-stat-subtitle">Rock - Hard Place</span>
      </div>
    </div>
  );
}
