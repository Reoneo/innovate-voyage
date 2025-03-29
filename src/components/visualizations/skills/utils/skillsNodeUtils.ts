
// Helper functions for the skills node visualization

/**
 * Generates a random role for visualization tooltips
 */
export function getRandomRole(): string {
  const roles = ["Developer", "Designer", "Project Manager", "Contributor", "Owner", "Creator", "Reviewer"];
  return roles[Math.floor(Math.random() * roles.length)];
}

/**
 * Generates a random date string in MM/YYYY format
 */
export function getRandomDate(): string {
  const year = 2020 + Math.floor(Math.random() * 4);
  const month = Math.floor(Math.random() * 12) + 1;
  return `${month}/${year}`;
}

/**
 * Generates a random project status
 */
export function getRandomStatus(): string {
  const statuses = ["Active", "Completed", "Ongoing", "Planning", "On Hold"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

/**
 * Creates project metadata for skill visualization
 */
export function generateProjectMetadata(skillName: string) {
  return {
    project: `${skillName} Project`,
    description: `A project related to ${skillName}`,
    role: getRandomRole(),
    timeframe: `${getRandomDate()} - ${getRandomDate()}`,
    status: getRandomStatus(),
    connections: Math.floor(Math.random() * 20) + 1
  };
}
