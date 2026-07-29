#!/usr/bin/env node

// Git worktree management script with configuration file copying
// Version: 3.0.0

'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_FILE = '.worktree-config.json';

const DEFAULT_CONFIG = {
  // Branch prefix for new branches (e.g., "gw-" creates branches like "gw-feature")
  branchPrefix: 'gw-',

  // Default branch suffix when none is provided
  defaultBranchSuffix: 'test',

  // Main branch name (usually "main" or "master")
  mainBranch: 'main',

  // Package manager (npm, yarn, pnpm, none, or auto)
  packageManager: 'auto',

  // Editor to open after creating worktree (code, cursor, vim, none, or auto)
  editor: 'auto',

  // Files to copy (simple filenames that can appear anywhere)
  copyFiles: ['.env', '.env.local', '.env.development', '.env.production'],

  // Path patterns to copy (relative paths from repo root, matched as */pattern)
  copyPathPatterns: ['.vscode/settings.json', '.vscode/tasks.json'],

  // Directories to exclude when searching for files to copy
  excludeDirs: [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.turbo',
    '.ruff_cache',
    '__pycache__',
    '.pytest_cache',
    'venv',
    '.venv',
  ],

  // Custom setup commands to run after worktree creation (run in the new worktree)
  postCreateCommands: [
    // Example: "npm run prepare"
  ],

  // MCP template directory (relative to main worktree). Empty if not using MCP templates.
  mcpTemplateDir: 'mcp-json-templates',
};

const SCRIPT_NAME = path.basename(process.argv[1] || 'worktree.js');

function showHelp() {
  console.log(`Usage: ${SCRIPT_NAME} [OPTIONS] [branch-name]

Creates a git worktree with configuration files and opens it in your editor.

OPTIONS:
  -h, --help      Show this help message
  -e, --existing  Use an existing branch from origin instead of creating new
  --mcp PURPOSE   Activate a specific MCP template (if configured)
  --init          Initialize a ${CONFIG_FILE} file in the current repository
  --no-install    Skip package installation
  --no-editor     Don't open editor after creation

ARGUMENTS:
  branch-name     For new branches: suffix for configured prefix
                  For existing: full branch name
                  Default: configured default or 'test'

EXAMPLES:
  ${SCRIPT_NAME} --init                  # Initialize config file
  ${SCRIPT_NAME} my-feature              # Creates new prefixed branch
  ${SCRIPT_NAME} -e feature/existing     # Uses existing branch

CONFIGURATION:
  The script looks for ${CONFIG_FILE} in the repository root.
  Run with --init to create a default configuration file.`);
}

function git(args, options = {}) {
  const result = spawnSync('git', args, { encoding: 'utf8', ...options });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function gitOrExit(args, errorMessage, options = {}) {
  const result = spawnSync('git', args, { stdio: 'inherit', ...options });
  if (result.status !== 0) {
    if (errorMessage) console.error(errorMessage);
    process.exit(1);
  }
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
  console.log('You can now customize the following:');
  console.log('  - Branch naming convention');
  console.log('  - Files to copy to new worktrees');
  console.log('  - Package manager preferences');
  console.log('  - Post-creation commands');
  console.log('');
  console.log(`Edit ${configPath} to customize for your repository.`);
  return 0;
}

function loadConfig(repoRoot) {
  const configPath = path.join(repoRoot, CONFIG_FILE);
  const config = {
    ...DEFAULT_CONFIG,
    copyFiles: [],
    copyPathPatterns: [],
    excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
    postCreateCommands: [],
    mcpTemplateDir: '',
  };

  if (fs.existsSync(configPath)) {
    try {
      Object.assign(config, JSON.parse(fs.readFileSync(configPath, 'utf8')));
      console.log(`Loaded configuration from: ${configPath}`);
    } catch (err) {
      console.error(`Error: Could not parse ${configPath}: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log('No configuration file found. Using defaults.');
    console.log(`Run '${SCRIPT_NAME} --init' to create a configuration file.`);
    console.log('');
  }
  return config;
}

function detectPackageManager(worktreePath, config) {
  if (config.packageManager !== 'auto') return config.packageManager;

  const has = (file) => fs.existsSync(path.join(worktreePath, file));
  if (has('pnpm-lock.yaml')) return 'pnpm';
  if (has('yarn.lock')) return 'yarn';
  if (has('package-lock.json')) return 'npm';
  if (has('package.json')) return 'npm'; // Default to npm if package.json exists
  if (has('requirements.txt') || has('Pipfile')) return 'python';
  if (has('Gemfile')) return 'bundler';
  return 'none';
}

function detectEditor(config) {
  if (config.editor !== 'auto') return config.editor;

  for (const editor of ['cursor', 'code', 'subl', 'vim']) {
    if (commandExists(editor)) return editor;
  }
  return 'none';
}

function findFiles(repoRoot, config) {
  // Walk the repo collecting files that match copyFiles (by name)
  // or copyPathPatterns (by trailing relative path).
  const matches = [];
  const excludeDirs = new Set(config.excludeDirs);

  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!excludeDirs.has(entry.name)) walk(fullPath);
      } else if (entry.isFile()) {
        const relativePath = path.relative(repoRoot, fullPath);
        const nameMatch = config.copyFiles.includes(entry.name);
        const pathMatch = config.copyPathPatterns.some(
          (pattern) => relativePath === pattern || relativePath.endsWith(`/${pattern}`)
        );
        if (nameMatch || pathMatch) matches.push(relativePath);
      }
    }
  };

  walk(repoRoot);
  return matches;
}

function findAndCopyConfigFiles(repoRoot, targetRoot, config) {
  if (config.copyFiles.length === 0 && config.copyPathPatterns.length === 0) {
    console.log('No files configured for copying.');
    return;
  }

  console.log('Copying configuration files...');

  const files = findFiles(repoRoot, config);
  let copiedCount = 0;

  for (const relativePath of files) {
    const sourceFile = path.join(repoRoot, relativePath);
    const targetFile = path.join(targetRoot, relativePath);
    try {
      fs.mkdirSync(path.dirname(targetFile), { recursive: true });
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`  ✓ Copied ${relativePath}`);
      copiedCount++;
    } catch {
      console.log(`  ⚠ Failed to copy ${relativePath}`);
    }
  }

  if (files.length > 0) {
    console.log(`  Configuration files: ${copiedCount}/${files.length} copied successfully`);
  }
}

function installPackages(worktreePath, pkgManager, skipInstall) {
  if (skipInstall) {
    console.log('Skipping package installation (--no-install flag)');
    return;
  }

  switch (pkgManager) {
    case 'npm':
    case 'yarn':
    case 'pnpm':
      console.log(`Installing packages with ${pkgManager}...`);
      spawnSync(pkgManager, ['install'], { cwd: worktreePath, stdio: 'inherit', shell: process.platform === 'win32' });
      break;
    case 'python':
      console.log('Python project detected. Consider running:');
      console.log(`  cd ${worktreePath} && pip install -r requirements.txt`);
      break;
    case 'bundler':
      console.log('Ruby project detected. Consider running:');
      console.log(`  cd ${worktreePath} && bundle install`);
      break;
    case 'none':
      break;
    default:
      console.log(`Unknown package manager: ${pkgManager}`);
  }
}

function activateMcpTemplate(templateName, worktreePath, mainWorktree, config) {
  if (!config.mcpTemplateDir) {
    console.log('MCP templates not configured');
    return false;
  }

  const templateFile = path.join(mainWorktree, config.mcpTemplateDir, `.mcp.${templateName}.json`);

  if (!fs.existsSync(templateFile)) {
    console.log(`Error: MCP template '${templateName}' not found at ${templateFile}`);
    return false;
  }

  console.log(`Activating MCP template: ${templateName}`);
  fs.copyFileSync(templateFile, path.join(worktreePath, '.mcp.json'));
  console.log(`  ✓ Copied .mcp.${templateName}.json to .mcp.json`);
  return true;
}

function runPostCreateCommands(worktreePath, config) {
  if (config.postCreateCommands.length === 0) return;

  console.log('Running post-create commands...');
  for (const cmd of config.postCreateCommands) {
    console.log(`  Running: ${cmd}`);
    try {
      execSync(cmd, { cwd: worktreePath, stdio: 'inherit' });
      console.log('  ✓ Success');
    } catch {
      console.log(`  ⚠ Failed: ${cmd}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  let mcpTemplate = '';
  let branchInput = '';
  let useExisting = false;
  let skipInstall = false;
  let skipEditor = false;
  let needInit = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-h':
      case '--help':
        showHelp();
        return 0;
      case '--init':
        needInit = true;
        break;
      case '-e':
      case '--existing':
        useExisting = true;
        break;
      case '--mcp':
        if (args[i + 1] && !args[i + 1].startsWith('-')) {
          mcpTemplate = args[++i];
        } else {
          console.error('Error: --mcp requires a template name');
          return 1;
        }
        break;
      case '--no-install':
        skipInstall = true;
        break;
      case '--no-editor':
        skipEditor = true;
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          console.error('Use -h or --help for usage information');
          return 1;
        }
        branchInput = arg;
    }
  }

  // Get the git repository root
  const currentRoot = git(['rev-parse', '--show-toplevel']);
  if (!currentRoot) {
    console.error('Error: Not in a git repository');
    return 1;
  }

  // Find the main worktree
  const gitCommonDir = git(['rev-parse', '--git-common-dir']);
  const mainWorktree =
    gitCommonDir === '.git' || gitCommonDir === path.join(process.cwd(), '.git')
      ? currentRoot
      : path.dirname(path.resolve(gitCommonDir));

  if (needInit) {
    return initConfig(mainWorktree);
  }

  const config = loadConfig(mainWorktree);

  if (!branchInput) branchInput = config.defaultBranchSuffix;

  // Determine branch name based on whether using existing or creating new
  let branchName;
  let localBranchName;
  if (useExisting) {
    branchName = branchInput;
    localBranchName = branchName.replace(/^origin\//, '');
  } else {
    branchName = branchInput.startsWith(config.branchPrefix)
      ? branchInput
      : `${config.branchPrefix}${branchInput}`;
    localBranchName = branchName;
  }

  // Create worktree directory name by replacing slashes with dashes
  const worktreeDir = localBranchName.replace(/\//g, '-');

  console.log(`Repository root: ${mainWorktree}`);
  console.log(`Creating worktree: ${worktreeDir}`);
  console.log(useExisting ? `Using existing branch: ${branchName}` : `Creating new branch: ${branchName}`);

  // Stash any uncommitted changes
  console.log('Checking for uncommitted changes...');
  const isDirty =
    spawnSync('git', ['diff', '--quiet']).status !== 0 ||
    spawnSync('git', ['diff', '--cached', '--quiet']).status !== 0;
  let stashed = false;
  if (isDirty) {
    console.log('Stashing uncommitted changes...');
    gitOrExit(['stash', 'push', '-m', `Auto-stash before creating worktree ${branchName}`]);
    stashed = true;
  }

  // Ensure we're on the main branch
  const currentBranch = git(['branch', '--show-current']);
  if (currentBranch !== config.mainBranch) {
    console.log(`Switching to ${config.mainBranch} branch...`);
    gitOrExit(
      ['checkout', config.mainBranch],
      `Error: Could not checkout ${config.mainBranch} branch\nMake sure mainBranch is set correctly in ${CONFIG_FILE}`
    );
  }

  // Update git references
  console.log('Fetching latest from origin...');
  gitOrExit(['fetch', 'origin']);

  // Pull latest main branch only if creating a new branch
  if (!useExisting) {
    console.log(`Pulling latest ${config.mainBranch} branch...`);
    gitOrExit(['pull', 'origin', config.mainBranch]);
  }

  // Create the worktree
  const newWorktreePath = path.join(path.dirname(mainWorktree), worktreeDir);
  console.log(`Creating git worktree at: ${newWorktreePath}`);

  let created;
  if (useExisting) {
    // Check if branch exists on origin
    const remoteHeads = git(['ls-remote', '--heads', 'origin', localBranchName]) || '';
    if (!remoteHeads.includes(localBranchName)) {
      console.error(`Error: Branch '${localBranchName}' not found on origin`);
      console.error('Available remote branches:');
      const remoteBranches = (git(['branch', '-r']) || '')
        .split('\n')
        .filter((line) => !line.includes('HEAD'))
        .map((line) => line.trim().replace(/^origin\//, ''))
        .slice(0, 20);
      console.error(remoteBranches.join('\n'));
      return 1;
    }
    created = spawnSync('git', ['worktree', 'add', newWorktreePath, localBranchName], { stdio: 'inherit' }).status === 0;
  } else {
    created = spawnSync('git', ['worktree', 'add', newWorktreePath, '-b', branchName], { stdio: 'inherit' }).status === 0;
  }

  if (!created) {
    console.error('❌ Failed to create worktree');
    return 1;
  }

  console.log('✅ Worktree created successfully!');

  findAndCopyConfigFiles(mainWorktree, newWorktreePath, config);

  if (mcpTemplate) {
    activateMcpTemplate(mcpTemplate, newWorktreePath, mainWorktree, config);
  }

  const pkgManager = detectPackageManager(newWorktreePath, config);
  if (pkgManager !== 'none') {
    installPackages(newWorktreePath, pkgManager, skipInstall);
  }

  runPostCreateCommands(newWorktreePath, config);

  console.log('');
  console.log('🎉 SUCCESS! Git worktree created.');
  console.log(`Worktree location: ${newWorktreePath}`);
  console.log(`Branch: ${localBranchName}`);

  // Open in editor if configured
  if (!skipEditor) {
    const editorCmd = detectEditor(config);
    if (editorCmd !== 'none') {
      console.log(`Opening in ${editorCmd}...`);
      if (editorCmd === 'vim') {
        spawnSync('vim', ['.'], { cwd: newWorktreePath, stdio: 'inherit' });
      } else {
        spawnSync(editorCmd, [newWorktreePath], { stdio: 'inherit', shell: process.platform === 'win32' });
      }
    }
  }

  // If we stashed changes, apply them back
  if (stashed) {
    console.log(`Applying stashed changes back to ${config.mainBranch}...`);
    gitOrExit(['stash', 'pop']);
  }

  return 0;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err.message);
    process.exit(1);
  }
);
