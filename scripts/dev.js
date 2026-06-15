const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [
  spawn(npmCommand, ['run', 'dev', '--workspace', 'server'], { stdio: 'inherit' }),
  spawn(npmCommand, ['run', 'dev', '--workspace', 'client'], { stdio: 'inherit' }),
];

let stopping = false;

const stop = (exitCode = 0) => {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exitCode = exitCode;
};

for (const child of children) {
  child.on('error', (error) => {
    console.error('Unable to start development process:', error.message);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping && code) stop(code);
  });
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
