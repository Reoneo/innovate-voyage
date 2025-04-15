
#!/usr/bin/env node

/**
 * Custom script to start Vite dev server without modifying package.json
 * Usage: node start-dev.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Determine the path to the Vite executable
const viteBinPath = path.resolve(__dirname, 'node_modules', '.bin', 'vite');
const viteBinPathWindows = path.resolve(__dirname, 'node_modules', '.bin', 'vite.cmd');

// Check if we're on Windows and use the appropriate executable
const isWindows = process.platform === 'win32';
const viteExecutable = isWindows && fs.existsSync(viteBinPathWindows) 
  ? viteBinPathWindows 
  : viteBinPath;

console.log('Starting Vite development server...');
console.log(`Using Vite binary at: ${viteExecutable}`);

// Fallback to npx if the direct path doesn't work
const command = fs.existsSync(viteExecutable) ? viteExecutable : 'npx vite';
const args = fs.existsSync(viteExecutable) ? [] : [];

console.log(`Executing: ${command} ${args.join(' ')}`);

// Spawn Vite process
const viteProcess = spawn(command, args, {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, FORCE_COLOR: true }
});

// Handle process events
viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  console.log('Attempting to run via npx as fallback...');
  
  // Try using npx as a fallback
  const npxProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: true }
  });
  
  npxProcess.on('error', (npxErr) => {
    console.error('Failed to start Vite via npx:', npxErr);
    console.log('Please make sure Vite is installed by running: npm install vite --save-dev');
    process.exit(1);
  });
});

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`Vite process exited with code ${code}`);
  }
  process.exit(code);
});
