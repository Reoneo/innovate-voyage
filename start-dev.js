
#!/usr/bin/env node

/**
 * Custom script to start Vite dev server without modifying package.json
 * Usage: node start-dev.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Determine the path to the Vite executable
const viteBinPath = path.resolve(__dirname, 'node_modules', '.bin', 'vite');

console.log('Starting Vite development server...');
console.log(`Using Vite binary at: ${viteBinPath}`);

// Spawn Vite process
const viteProcess = spawn(viteBinPath, [], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, FORCE_COLOR: true }
});

// Handle process events
viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  console.log('If Vite is not found, try running: npm install vite --save-dev');
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code);
});
