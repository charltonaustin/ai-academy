# Git Worktree Tools - Quick Guide

A complete worktree management solution with two complementary scripts for creating and cleaning up Git worktrees.

## Installation

### Prerequisites

- Git 2.7+ (for worktree support)
- Node.js 18+ (the scripts are plain Node with no dependencies)
- GitHub CLI (`gh`) for PR status checking

### Setup

1. **Initialize configuration files**:

```bash
./worktree.js --init           # Creates .worktree-config.json
./worktree-cleanup.js --init    # Creates .worktree-cleanup-config.json
```

2. **Install GitHub CLI** (for PR checking):

```bash
# macOS
brew install gh
gh auth login

# Linux
sudo apt install gh
gh auth login
```

---

## Script 1: Worktree Creator (`worktree.js`)

Creates new worktrees with automatic environment setup, file copying, and package installation.

### Basic Usage

```bash
# Create new worktree with new branch
./worktree.js my-feature         # Creates branch: gw-my-feature

# Use existing branch from origin
./worktree.js -e feature/existing

# Quick options
./worktree.js my-feature --no-install    # Skip package installation
./worktree.js my-feature --no-editor     # Don't open editor
```

### Configuration (`.worktree-config.json`)

```json
{
  "branchPrefix": "gw-",
  "defaultBranchSuffix": "test",
  "mainBranch": "main",

  "packageManager": "auto",
  "editor": "auto",

  "copyFiles": [".env", ".env.local", ".env.development", ".env.production"],

  "copyPathPatterns": [".vscode/settings.json", ".vscode/tasks.json"],

  "excludeDirs": ["node_modules", ".git", ".next", "dist", "build"],

  "postCreateCommands": ["npm run prepare", "git config user.email 'team@company.com'"]
}
```

- `branchPrefix` - Prefix for new branches; `defaultBranchSuffix` is used if no name is provided
- `mainBranch` - Usually `"main"` or `"master"`
- `packageManager` - `"auto"` detects from lock files; also `"npm"`, `"yarn"`, `"pnpm"`, `"none"`
- `editor` - `"auto"` detects an installed editor; also `"cursor"`, `"code"`, `"vim"`, `"none"`
- `copyFiles` - Files (matched by name anywhere in the repo) copied to new worktrees
- `copyPathPatterns` - Paths (relative to repo root) copied to new worktrees
- `excludeDirs` - Directories skipped when searching for files to copy
- `postCreateCommands` - Shell commands run in the new worktree after creation

### How It Works

1. **Stashes** any uncommitted changes
2. **Creates worktree** in sibling directory (e.g., `../repo-gw-feature/`)
3. **Copies** configured files from main worktree
4. **Installs** packages automatically
5. **Opens** in your editor
6. **Restores** stashed changes to original worktree

---

## Script 2: Worktree Cleanup (`worktree-cleanup.js`)

Interactive tool to view and delete worktrees, with PR status checking.

### Basic Usage

```bash
# Interactive cleanup interface
./worktree-cleanup.js

# Skip PR checking (faster)
./worktree-cleanup.js --no-pr-check

# Auto-select merged PRs
./worktree-cleanup.js --auto-merged
```

### Interactive Controls

| Key            | Action                   |
|----------------|--------------------------|
| `↑/↓` or `j/k` | Navigate list            |
| `Space`        | Toggle selection         |
| `a`            | Select all non-protected |
| `m`            | Select all merged PRs    |
| `u`            | Unselect all             |
| `d`            | Delete selected          |
| `r`            | Refresh PR statuses      |
| `q`            | Quit                     |

### Visual Interface

```
Git Worktree Cleanup Manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] WORKTREE              BRANCH         PR STATUS    MERGED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] main (protected)      main           PROTECTED    false
[X] gw-auth              gw-auth         PR #123      true   ← Green (merged)
[ ] gw-ui-fix            gw-ui-fix       PR #124      false  ← Cyan (open)
[X] gw-experiment        gw-experiment   NO PR        false  ← Yellow (no PR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: Total: 4 | Selected: 2 | Merged: 1
Legend: ● Merged ● Open PR ● No PR ● Protected
```

### Configuration (`.worktree-cleanup-config.json`)

```json
{
  "useGithubCli": true,
  "checkPrStatus": true,
  "autoDetectRepo": true,

  "protectedPatterns": ["main", "master", "develop", "release/.*", "hotfix/.*"],

  "showDebugInfo": false,
  "confirmDeletion": true,
  "autoSelectMerged": false,

  "editorCommand": "cursor",

  "preDeleteCommands": ["docker-compose down 2>/dev/null || true"]
}
```

- `useGithubCli` / `checkPrStatus` - Use the `gh` CLI to check PR status per branch
- `autoDetectRepo` - Detect the GitHub repo from the origin remote
- `protectedPatterns` - Regex patterns for branches that can never be deleted
- `showDebugInfo` / `confirmDeletion` / `autoSelectMerged` - UI behavior
- `editorCommand` - Optional editor to open a selected worktree with `o`
- `preDeleteCommands` - Shell commands run in each worktree before deletion

---

## Common Workflows

### Daily Development Flow

```bash
# Morning: Create feature worktree
./worktree.js user-auth

# Work on feature...
cd ../gw-user-auth
# Make changes, commit, push, create PR

# After PR is merged: Clean up
./worktree-cleanup.js --auto-merged
# Press 'd' to delete merged worktrees
```

### Quick Experimentation

```bash
# Create test worktree without setup
./worktree.js experiment --no-install --no-editor

# Later: Clean up all experiments
./worktree-cleanup.js
# Press 'a' to select all, then 'd' to delete
```

### Working with Multiple Features

```bash
# Create multiple worktrees
./worktree.js feature-1
./worktree.js feature-2
./worktree.js bugfix-1

# View all worktrees
git worktree list

# Clean up merged ones
./worktree-cleanup.js
# Press 'm' to select merged, 'd' to delete
```

---

## Tips & Tricks

### Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias wt='./scripts/worktree.js'
alias wtc='./scripts/worktree-cleanup.js'
alias wtl='git worktree list'
```

### Quick Commands

```bash
# List all worktrees
git worktree list

# Manually remove a worktree
git worktree remove ../gw-feature --force
git branch -D gw-feature

# Check PR status manually
gh pr status
```

### Configuration Tips

- Set `"autoSelectMerged": true` to pre-select merged PRs
- Use `editorCommand` to quickly jump between worktrees
- Add project-specific setup to `postCreateCommands`

---

## Troubleshooting

### Common Issues

**"GitHub CLI not installed"**

```bash
brew install gh && gh auth login
```

**"Cannot delete worktree"**

- Has uncommitted changes → Script uses `--force`
- Branch checked out elsewhere → Delete manually

**"Config file in wrong place"**

- Scripts always create configs in repository root
- Can be run from any subdirectory

**"No PR status shown"**

- Check `gh auth status`
- Ensure repository is on GitHub
- Branch must be pushed to origin

### Debug Mode

```bash
# Enable debug output
./worktree-cleanup.js --debug
```

---

## Quick Reference

### Worktree Creator Options

- `--init` - Create config file
- `-e, --existing` - Use existing branch
- `--no-install` - Skip package installation
- `--no-editor` - Don't open editor
- `-h, --help` - Show help

### Cleanup Manager Options

- `--init` - Create config file
- `--no-pr-check` - Skip PR checking
- `--auto-merged` - Auto-select merged PRs
- `--debug` - Show debug info
- `-h, --help` - Show help

---

_Version 3.0.0 | Requires Git 2.7+, Node.js 18+_
