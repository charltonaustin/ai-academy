#!/usr/bin/env node

// Git Worktree Cleanup Manager - Interactive CLI
// Manages worktrees with PR status checking and deletion
// Version: 3.0.0

'use strict';

const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_FILE = '.worktree-cleanup-config.json';

const DEFAULT_CONFIG = {
  // GitHub CLI settings
  useGithubCli: true,
  checkPrStatus: true,

  // Auto-detection settings
  autoDetectRepo: true,

  // Protected worktrees (regex patterns that shouldn't be deleted)
  protectedPatterns: ['main', 'master', 'develop', 'release/.*', 'hotfix/.*'],

  // UI Settings
  showDebugInfo: false,
  confirmDeletion: true,
  autoSelectMerged: false,

  // Editor to open after selection (optional)
  editorCommand: '',

  // Custom cleanup commands to run before deletion (per worktree)
  preDeleteCommands: [
    // Example: "docker-compose down"
  ],
};

// Colors
const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const YELLOW = '\x1b[1;33m';
const BLUE = '\x1b[0;34m';
const MAGENTA = '\x1b[0;35m';
const CYAN = '\x1b[0;36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const SCRIPT_NAME = path.basename(process.argv[1] || 'worktree-cleanup.js');

function showHelp() {
  console.log(`Git Worktree Cleanup Manager - Interactive CLI

Usage: ${SCRIPT_NAME} [OPTIONS]

OPTIONS:
  -h, --help       Show this help message
  --init           Initialize a configuration file
  --no-pr-check    Skip PR status checking
  --auto-merged    Auto-select merged PRs on start
  --debug          Show debug information

INTERACTIVE CONTROLS:
  ↑/↓ or j/k      Navigate through worktrees
  Space           Toggle selection
  a               Select all non-protected worktrees
  m               Select all merged PRs
  u               Unselect all
  d               Delete selected worktrees
  r               Refresh PR statuses
  o               Open selected in editor
  q               Quit`);
}

function git(args, options = {}) {
  const result = spawnSync('git', args, { encoding: 'utf8', ...options });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function commandExists(cmd) {
  const which = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(which, [cmd], { stdio: 'ignore' }).status === 0;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function initConfig(repoRoot) {
  const configPath = path.join(repoRoot, CONFIG_FILE);

  if (fs.existsSync(configPath)) {
    console.log(`Configuration file already exists at: ${configPath}`);
    const reply = await ask('Overwrite? (y/N) ');
    if (!/^y$/i.test(reply.trim())) {
      console.log('Initialization cancelled.');
      return 1;
    }
  }

  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + '\n');
  console.log(`✅ Configuration file created at: ${configPath}`);
  console.log('');
  console.log('You can customize:');
  console.log('  - PR checking behavior');
  console.log('  - Protected branch patterns');
  console.log('  - UI preferences');
  console.log('  - Pre-deletion cleanup commands');
  return 0;
}

function loadConfig(repoRoot) {
  const configPath = path.join(repoRoot, CONFIG_FILE);
  const config = { ...DEFAULT_CONFIG };

  if (fs.existsSync(configPath)) {
    try {
      Object.assign(config, JSON.parse(fs.readFileSync(configPath, 'utf8')));
      if (config.showDebugInfo) console.log(`Loaded configuration from: ${configPath}`);
    } catch (err) {
      console.error(`Error: Could not parse ${configPath}: ${err.message}`);
      process.exit(1);
    }
  }
  return config;
}

// Get owner/repo from the origin remote (GitHub, GitLab, or Bitbucket)
function getRepoSlug(config) {
  if (!config.autoDetectRepo) return '';

  const remoteUrl = git(['remote', 'get-url', 'origin']) || '';
  const match = remoteUrl.match(/(?:github\.com|gitlab\.com|bitbucket\.org)[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
  return match ? `${match[1]}/${match[2]}` : '';
}

function isProtectedBranch(branch, config) {
  return config.protectedPatterns.some((pattern) => {
    try {
      return new RegExp(`^(?:${pattern})$`).test(branch);
    } catch {
      return pattern === branch;
    }
  });
}

// Returns { status, merged }
function checkPrStatus(branch, config) {
  if (!config.checkPrStatus) return { status: 'SKIPPED', merged: false };

  const repo = getRepoSlug(config);
  if (!repo) return { status: 'NO_REPO', merged: false };

  if (config.useGithubCli && commandExists('gh')) {
    if (config.showDebugInfo) console.error(`    DEBUG: Checking repo ${repo} for branch ${branch}`);

    const result = spawnSync(
      'gh',
      ['pr', 'list', '--repo', repo, '--head', branch, '--state', 'all', '--json', 'number,state,mergedAt', '--limit', '1'],
      { encoding: 'utf8' }
    );
    if (config.showDebugInfo) console.error(`    DEBUG: Query result: ${(result.stdout || '').trim()}`);

    let prs = [];
    try {
      prs = JSON.parse(result.stdout || '[]');
    } catch {
      prs = [];
    }

    if (prs.length > 0) {
      const pr = prs[0];
      if (pr.mergedAt) return { status: `PR #${pr.number} (MERGED)`, merged: true };
      if (pr.state === 'OPEN') return { status: `PR #${pr.number} (OPEN)`, merged: false };
      if (pr.state === 'CLOSED') return { status: `PR #${pr.number} (CLOSED)`, merged: false };
      return { status: `PR #${pr.number}`, merged: false };
    }
    return { status: 'NO PR', merged: false };
  }

  if (commandExists('glab')) {
    // GitLab CLI support
    const result = spawnSync('glab', ['mr', 'list', `--source-branch=${branch}`, '--output', 'json'], {
      encoding: 'utf8',
    });
    let mrs = [];
    try {
      mrs = JSON.parse(result.stdout || '[]');
    } catch {
      mrs = [];
    }

    if (mrs.length > 0) {
      const mr = mrs[0];
      if (mr.state === 'merged') return { status: `MR !${mr.iid} (MERGED)`, merged: true };
      if (mr.state === 'opened') return { status: `MR !${mr.iid} (OPEN)`, merged: false };
      return { status: `MR !${mr.iid} (${mr.state})`, merged: false };
    }
    return { status: 'NO MR', merged: false };
  }

  return { status: 'NO CLI', merged: false };
}

// Returns an array of { name, branch, path, prStatus, merged, selected, protected }
function loadWorktrees(config) {
  console.log(`${YELLOW}Loading worktrees and checking PR statuses...${RESET}`);

  const porcelain = git(['worktree', 'list', '--porcelain']) || '';
  const entries = [];
  let current = {};

  for (const line of porcelain.split('\n')) {
    if (line.startsWith('worktree ')) {
      current = { path: line.slice('worktree '.length) };
    } else if (line.startsWith('branch ')) {
      current.branch = line.slice('branch '.length).replace(/^refs\/heads\//, '');
    } else if (line === 'bare') {
      current.bare = true;
    } else if (line === '' && current.path) {
      entries.push(current);
      current = {};
    }
  }
  if (current.path) entries.push(current);

  const worktrees = [];
  for (const entry of entries) {
    if (entry.bare || !entry.branch) continue; // Skip bare repos and detached HEADs

    const dirName = path.basename(entry.path);

    if (isProtectedBranch(entry.branch, config)) {
      worktrees.push({
        name: `${dirName} (protected)`,
        branch: entry.branch,
        path: entry.path,
        prStatus: 'PROTECTED',
        merged: false,
        selected: false,
        protected: true,
      });
      continue;
    }

    let prStatus = 'NOT CHECKED';
    let merged = false;
    if (config.checkPrStatus) {
      console.log(`  ${BLUE}Checking: ${entry.branch}${RESET}`);
      ({ status: prStatus, merged } = checkPrStatus(entry.branch, config));
    }

    worktrees.push({
      name: dirName,
      branch: entry.branch,
      path: entry.path,
      prStatus,
      merged,
      selected: config.autoSelectMerged && merged,
      protected: false,
    });
  }

  return worktrees;
}

const pad = (str, width) => (str.length >= width ? str : str + ' '.repeat(width - str.length));

function displayTable(worktrees, currentRow, config) {
  console.clear();
  const line = '━'.repeat(110);
  console.log(`${BOLD}Git Worktree Cleanup Manager${RESET}`);
  console.log(`${BLUE}${line}${RESET}`);
  console.log(`${pad('[ ]', 4)}${pad('WORKTREE', 36)}${pad('BRANCH', 31)}${pad('PR STATUS', 26)}MERGED`);
  console.log(`${BLUE}${line}${RESET}`);

  worktrees.forEach((wt, i) => {
    const checkbox = wt.selected ? '[X]' : '[ ]';

    // Color coding
    let color = '';
    let bgColor = '\x1b[47m'; // White background for default
    if (wt.prStatus === 'PROTECTED') {
      color = MAGENTA;
      bgColor = '\x1b[45m'; // Magenta background
    } else if (wt.merged) {
      color = GREEN;
      bgColor = '\x1b[42m'; // Green background
    } else if (wt.prStatus === 'NO PR') {
      color = YELLOW;
      bgColor = '\x1b[43m'; // Yellow background
    } else if (wt.prStatus.includes('OPEN')) {
      color = CYAN;
      bgColor = '\x1b[46m'; // Cyan background
    }

    const row =
      pad(checkbox, 4) +
      pad(wt.name.slice(0, 33), 36) +
      pad(wt.branch.slice(0, 28), 31) +
      pad(wt.prStatus.slice(0, 23), 26) +
      String(wt.merged);

    if (i === currentRow) {
      console.log(`${bgColor}\x1b[30m${row}${RESET}`);
    } else {
      console.log(`${color}${row}${RESET}`);
    }
  });

  console.log(`${BLUE}${line}${RESET}`);
  console.log('');
  console.log(`${BOLD}Controls:${RESET}`);
  console.log('  ↑/↓ or j/k: Navigate    Space: Select/Deselect    d: Delete selected    r: Refresh');
  console.log('  a: Select all eligible  m: Select merged          u: Unselect all       q: Quit');
  if (config.editorCommand) {
    console.log(`  o: Open in ${config.editorCommand}`);
  }
  console.log('');

  const selectedCount = worktrees.filter((wt) => wt.selected).length;
  const mergedCount = worktrees.filter((wt) => wt.merged).length;
  console.log(`${BOLD}Status:${RESET} Total: ${worktrees.length} | Selected: ${selectedCount} | Merged: ${mergedCount}`);
  console.log(
    `${BOLD}Legend:${RESET} ${GREEN}●${RESET} Merged ${CYAN}●${RESET} Open PR ${YELLOW}●${RESET} No PR ${MAGENTA}●${RESET} Protected`
  );
}

function runPreDeleteCommands(worktreePath, config) {
  if (config.preDeleteCommands.length === 0) return;

  console.log(`${YELLOW}Running cleanup commands...${RESET}`);
  for (const cmd of config.preDeleteCommands) {
    console.log(`  Running: ${cmd}`);
    try {
      execSync(cmd, { cwd: worktreePath, stdio: 'ignore' });
      console.log(`  ${GREEN}✓${RESET} Success`);
    } catch {
      console.log(`  ${YELLOW}⚠${RESET} Failed (continuing anyway)`);
    }
  }
}

function deleteWorktree(wt, config) {
  if (isProtectedBranch(wt.branch, config)) {
    console.log(`${RED}Cannot delete protected branch: ${wt.branch}${RESET}`);
    return false;
  }

  runPreDeleteCommands(wt.path, config);

  console.log(`${YELLOW}Removing worktree: ${wt.path}${RESET}`);
  const removed =
    spawnSync('git', ['worktree', 'remove', wt.path, '--force'], { stdio: 'ignore' }).status === 0 ||
    spawnSync('git', ['worktree', 'remove', wt.path], { stdio: 'ignore' }).status === 0;

  if (!removed) {
    console.log(`${RED}✗${RESET} Failed to remove worktree`);
    return false;
  }
  console.log(`${GREEN}✓${RESET} Worktree removed`);

  console.log(`${YELLOW}Deleting branch: ${wt.branch}${RESET}`);
  if (spawnSync('git', ['branch', '-D', wt.branch], { stdio: 'ignore' }).status === 0) {
    console.log(`${GREEN}✓${RESET} Branch deleted`);
  } else {
    console.log(`${YELLOW}⚠${RESET} Could not delete branch (may be checked out elsewhere)`);
  }
  return true;
}

function readKey() {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.once('data', (data) => {
      stdin.setRawMode(false);
      stdin.pause();
      resolve(data.toString('utf8'));
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const args = process.argv.slice(2);
  let needInit = false;
  let noPrCheck = false;
  let autoMerged = false;
  let debugMode = false;

  for (const arg of args) {
    switch (arg) {
      case '-h':
      case '--help':
        showHelp();
        return 0;
      case '--init':
        needInit = true;
        break;
      case '--no-pr-check':
        noPrCheck = true;
        break;
      case '--auto-merged':
        autoMerged = true;
        break;
      case '--debug':
        debugMode = true;
        break;
    }
  }

  // Check if in a git repository
  const repoRoot = git(['rev-parse', '--show-toplevel']);
  if (!repoRoot) {
    console.error('Error: Not in a git repository');
    return 1;
  }

  if (needInit) {
    return initConfig(repoRoot);
  }

  const config = loadConfig(repoRoot);

  // Apply command line overrides
  if (noPrCheck) config.checkPrStatus = false;
  if (autoMerged) config.autoSelectMerged = true;
  if (debugMode) config.showDebugInfo = true;

  // Check for required tools
  if (config.checkPrStatus && config.useGithubCli && !commandExists('gh')) {
    console.log(`${YELLOW}Warning: GitHub CLI (gh) is not installed.${RESET}`);
    console.log('PR status checking will be limited.');
    console.log('Install with: brew install gh (macOS) or visit https://cli.github.com');
    console.log('');
    console.log('Press any key to continue without PR checking...');
    await readKey();
    config.checkPrStatus = false;
  }

  // Main interactive loop
  let currentRow = 0;
  let worktrees = loadWorktrees(config);

  while (true) {
    displayTable(worktrees, currentRow, config);

    const key = await readKey();

    if (key === '\x03') return 0; // Ctrl+C

    switch (key) {
      case '\x1b[A': // Up arrow
      case 'k':
        currentRow = currentRow <= 0 ? worktrees.length - 1 : currentRow - 1;
        break;
      case '\x1b[B': // Down arrow
      case 'j':
        currentRow = currentRow >= worktrees.length - 1 ? 0 : currentRow + 1;
        break;
      case ' ': {
        // Toggle selection
        const wt = worktrees[currentRow];
        if (wt && !wt.protected) wt.selected = !wt.selected;
        break;
      }
      case 'a': // Select all non-protected
        for (const wt of worktrees) {
          if (!wt.protected) wt.selected = true;
        }
        break;
      case 'm': // Select all merged
        for (const wt of worktrees) {
          if (wt.merged) wt.selected = true;
        }
        break;
      case 'u': // Unselect all
        for (const wt of worktrees) wt.selected = false;
        break;
      case 'r': // Refresh
        console.log(`${YELLOW}Refreshing...${RESET}`);
        worktrees = loadWorktrees(config);
        currentRow = 0;
        break;
      case 'o': {
        // Open in editor
        const wt = worktrees[currentRow];
        if (config.editorCommand && wt && wt.selected) {
          spawnSync(config.editorCommand, [wt.path], { stdio: 'ignore', shell: true });
        }
        break;
      }
      case 'd': {
        // Delete selected
        const toDelete = worktrees.filter((wt) => wt.selected && !wt.protected);

        if (toDelete.length === 0) {
          console.log(`${YELLOW}No worktrees selected for deletion${RESET}`);
          await sleep(2000);
          break;
        }

        console.log('');
        console.log(`${RED}${BOLD}About to delete ${toDelete.length} worktree(s):${RESET}`);
        for (const wt of toDelete) {
          console.log(`  ${RED}✗${RESET} ${wt.name} (${wt.branch})`);
        }
        console.log('');

        let confirmed = true;
        if (config.confirmDeletion) {
          process.stdout.write('Are you sure? (y/N): ');
          const confirm = await readKey();
          console.log('');
          confirmed = confirm === 'y' || confirm === 'Y';
        }

        if (confirmed) {
          let successCount = 0;
          for (const wt of toDelete) {
            if (deleteWorktree(wt, config)) successCount++;
            console.log('');
          }

          console.log(`${GREEN}Deleted ${successCount} worktree(s)${RESET}`);
          console.log('Press any key to continue...');
          await readKey();

          worktrees = loadWorktrees(config);
          currentRow = 0;
        }
        break;
      }
      case 'q':
        console.log(`${GREEN}Exiting...${RESET}`);
        return 0;
    }
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err.message);
    process.exit(1);
  }
);
