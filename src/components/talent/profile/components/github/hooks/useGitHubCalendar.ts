
import { useState, useEffect, useRef } from 'react';
import { useGitHubContributions } from '../useGitHubContributions';

export function useGitHubCalendar(username: string) {
  // This hook is now a thin wrapper around useGitHubContributions
  return useGitHubContributions(username);
}
