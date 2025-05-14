
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
    <div className="github-stats-container grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="github-stat-item p-3 rounded-md bg-gray-900/70 border border-gray-800/50">
        <span className="github-stat-title block text-gray-400 text-sm">Contributions</span>
        <span className="github-stat-value block text-xl font-bold text-white" id={`${username}-total-contrib`}>
          {totalContributions !== null ? totalContributions : (stats.total || 0)}
        </span>
        <span className="github-stat-subtitle text-xs text-gray-500" id={`${username}-date-range`}>{stats.dateRange}</span>
      </div>
      
      <div className="github-stat-item p-3 rounded-md bg-gray-900/70 border border-gray-800/50">
        <span className="github-stat-title block text-gray-400 text-sm">Longest streak</span>
        <span className="github-stat-value block text-xl font-bold text-white" id={`${username}-longest-streak`}>{stats.longestStreak || 0} days</span>
        <span className="github-stat-subtitle text-xs text-gray-500">Consecutive days</span>
      </div>
      
      <div className="github-stat-item p-3 rounded-md bg-gray-900/70 border border-gray-800/50">
        <span className="github-stat-title block text-gray-400 text-sm">Current streak</span>
        <span className="github-stat-value block text-xl font-bold text-white" id={`${username}-current-streak`}>{stats.currentStreak || 0} days</span>
        <span className="github-stat-subtitle text-xs text-gray-500">Active contribution days</span>
      </div>
    </div>
  );
}
