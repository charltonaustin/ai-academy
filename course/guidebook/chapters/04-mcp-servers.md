# Chapter 04: MCP Server Configuration

## Overview

This chapter provides comprehensive details about MCP (Model Context Protocol) servers: how to configure them, the
difference between global and project-specific installations, and the various methods for adding them to your Claude
Code environment.

---

## 1. What Are MCP Servers?

### Definition

**MCP (Model Context Protocol) servers** are specialized plugins that extend Claude Code with additional capabilities
beyond its default toolkit.

Think of them as **superpowers for specific tasks:**

- Access to up-to-date documentation (Context7)
- Browser automation for testing (Playwright)
- Enhanced file operations (Filesystem)
- Symbolic code analysis (Serena)
- And many more...

### Why MCP Servers Matter

**Without MCP servers:**

- Claude Code has basic capabilities (read/write files, run commands)
- No access to current documentation (relies on training data)
- Can't launch browsers for testing
- Limited semantic code understanding

**With MCP servers:**

- Extended capabilities for specialized tasks
- Access to real-time documentation
- Browser automation for end-to-end testing
- Brownfield codebase intelligence

---

## 2. Understanding MCP Server Scopes

Claude Code supports **three different scopes** for MCP server configuration. Understanding these scopes is crucial
because the terminology can be confusing!

### The Three Scopes

#### 1. **User Scope** (Formerly "Global")

**Location:** `~/.claude.json` (in your home directory)

**Scope:** Available to you across ALL projects on your machine

**Use when:**

- ✅ Tool is universally useful (Context7, Filesystem)
- ✅ Configuration is the same across all projects
- ✅ You want the tool available everywhere you work

**Example user scope config:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/projects"
      ]
    },
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7"
      ],
      "env": {
        "UPSTASH_REDIS_REST_URL": "your-redis-url",
        "UPSTASH_REDIS_REST_TOKEN": "your-redis-token"
      }
    }
  }
}
```

---

#### 2. **Project Scope** (Team-Shared)

**Location:** `.mcp.json` (in your project root directory)

**Scope:** Available to EVERYONE working on this project (team-shared)

**Use when:**

- ✅ Tool is needed by the whole team (Serena for brownfield analysis)
- ✅ Configuration should be version controlled
- ✅ Want to ensure consistent tooling across team members

**Example project scope config:**

```json
{
  "mcpServers": {
    "serena": {
      "command": "npx",
      "args": [
        "-y",
        "@oraios/serena",
        "--cwd",
        "."
      ]
    },
    "project-specific-tool": {
      "command": "node",
      "args": [
        "./custom-mcp-server.js"
      ],
      "env": {
        "PROJECT_API_KEY": "project-specific-key"
      }
    }
  }
}
```

**Important:** This file is designed to be committed to git and shared with your team!

---

#### 3. **Local Scope** (Default)

**Location:** `~/.claude.json` (in your home directory, but linked to specific project)

**Scope:** Available only to YOU in THIS specific project

**Use when:**

- ✅ You want project-specific configuration that's NOT shared with team
- ✅ Testing a new MCP server before sharing with team
- ✅ Personal overrides for your development workflow

**How it works:**

- Configuration is stored in `~/.claude.json`
- But it's associated with the specific project path
- Only applies when you're working in that project directory

---

### Scope Priority

When servers with the same name exist at multiple scopes:

**Priority order:** `local` → `project` → `user`

1. **Local scope** (highest priority) - Your project-specific personal config
2. **Project scope** - Team-shared config from `.mcp.json`
3. **User scope** (lowest priority) - Your global config

**Example:**

If you have `serena` configured in all three scopes, Claude Code will use:

1. Local scope version if it exists (just for you in this project)
2. Otherwise project scope version (team-shared)
3. Otherwise user scope version (your global fallback)

---

### Configuration File Locations Summary

| Scope       | Location                            | Shared with Team | Committed to Git |
|-------------|-------------------------------------|------------------|------------------|
| **user**    | `~/.claude.json`                    | ❌ No             | ❌ No             |
| **project** | `.mcp.json`                         | ✅ Yes            | ✅ Yes            |
| **local**   | `~/.claude.json` (project-specific) | ❌ No             | ❌ No             |

---

### Common Confusion: "Project" vs "Local"

**⚠️ Common misconception:**

You might think `--scope project` means "just for this project" but it actually means "**shared** with the team for this
project"!

- `--scope local` = Just for you in this project (default)
- `--scope project` = Shared with team via `.mcp.json`
- `--scope user` = For you across all projects

---

## 3. How to Add MCP Servers

### Method 1: Claude MCP Add Command (Recommended)

**The easiest way** to install MCP servers is using Claude Code's built-in command:

```bash
claude mcp add [OPTIONS] <name> -- <command> [args...]
```

#### User Scope Installation (Global)

**Use `--scope user`** to make MCP server available across all your projects:

```bash
claude mcp add --scope user <name> -- npx -y <package-name> [args]
```

**Example:**

```bash
# Install for all projects (user scope)
claude mcp add --scope user filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/yourname/projects
claude mcp add --scope user context7 -- npx -y @upstash/context7
```

**What happens:**

1. Claude Code adds configuration to `~/.claude.json`
2. Server is available in ALL projects on your machine
3. Configuration is personal (not shared with team)

---

#### Project Scope Installation (Team-Shared)

**Use `--scope project`** to share MCP server with your team via `.mcp.json`:

```bash
claude mcp add --scope project <name> -- npx -y <package-name> [args]
```

**Example:**

```bash
# Install for team (project scope)
cd ~/my-project
claude mcp add --scope project serena -- npx -y @oraios/serena --cwd .
```

**What happens:**

1. Claude Code creates/updates `.mcp.json` in current directory
2. Server available to everyone working on this project
3. Configuration should be committed to git (team-shared)
4. Team members see prompt to approve project-scoped servers

---

#### Local Scope Installation (Personal Project-Specific)

**Use `--scope local`** (or omit flag - it's the default) for personal project-specific config:

```bash
claude mcp add <name> -- npx -y <package-name> [args]
# OR explicitly:
claude mcp add --scope local <name> -- npx -y <package-name> [args]
```

**Example:**

```bash
# Install for just you in this project (local scope - default)
cd ~/my-project
claude mcp add test-server -- npx -y @some/test-server
```

**What happens:**

1. Claude Code adds configuration to `~/.claude.json`
2. But configuration is linked to this specific project path
3. Server only available to YOU when working in THIS project
4. Not shared with team (stays in your personal config)

---

### Method 2: Manual JSON Configuration

#### Step 1: Locate Configuration File

**Global:** Create or edit `~/.claude.json`

```bash
# Check if it exists
ls -la ~/.claude.json

# Create if it doesn't exist
touch ~/.claude.json
```

**Project:** Create or edit `.mcp.json` in project root

```bash
# In your project directory
touch .mcp.json
```

#### Step 2: Add Server Configuration

**Basic structure:**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": [
        "-y",
        "package-name",
        "...additional-args"
      ],
      "env": {
        "ENV_VAR_1": "value1",
        "ENV_VAR_2": "value2"
      }
    }
  }
}
```

**Parameters explained:**

- **`server-name`**: Friendly name for the server (shows in `/mcp` command)
- **`command`**: How to run the server (`npx`, `node`, `python`, etc.)
- **`args`**: Array of arguments passed to the command
- **`env`**: (Optional) Environment variables the server needs

#### Step 3: Verify Installation

```bash
# List all MCP servers
claude mcp list

# Check server status
claude # then type: /mcp
```

---

## 4. Common MCP Servers for This Course

### Essential Servers (Install Globally)

#### 1. Filesystem MCP

**What:** Enhanced file operations with better context awareness

**Installation:**

```bash
claude mcp add @modelcontextprotocol/server-filesystem
```

**Manual config:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/projects"
      ]
    }
  }
}
```

**Verify:**

```
You: "Use Filesystem MCP to list files in this directory"
Expected: Enhanced file listing with metadata
```

---

#### 2. Playwright MCP

**What:** Browser automation for testing features end-to-end

**Installation:**

```bash
claude mcp add @microsoft/playwright-mcp
```

**Manual config:**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@microsoft/playwright-mcp"
      ]
    }
  }
}
```

**Verify:**

```
You: "Use Playwright to open google.com and take a screenshot"
Expected: Browser opens, screenshot saved and displayed
```

---

#### 3. Context7 MCP

**What:** Retrieves current documentation for libraries (not outdated training data)

**Installation:**

```bash
claude mcp add @upstash/context7
```

**Manual config:**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7"
      ]
    }
  }
}
```

**Verify:**

```
You: "Use Context7 to get the latest Sequelize model definition syntax"
Expected: Current Sequelize documentation (not outdated patterns)
```

---

### Project-Specific Servers (Install Per-Project)

#### 4. Serena MCP

**What:** Semantic code analysis for brownfield codebases

**Installation:**

```bash
cd ~/your-project
claude mcp add @oraios/serena --project
```

**Manual config:**

```json
{
  "mcpServers": {
    "serena": {
      "command": "npx",
      "args": [
        "-y",
        "@oraios/serena",
        "--cwd",
        "."
      ]
    }
  }
}
```

**When to use:**

- Working in existing codebase (not greenfield)
- Need to understand existing patterns
- Finding references across large codebase
- Refactoring complex systems

**Verify:**

```
You: "Use Serena to find all references to UserService"
Expected: List of files/locations using UserService
```

---

## 5. Managing MCP Servers

### Listing Installed Servers

```bash
# CLI command
claude mcp list

# In Claude Code session
/mcp
```

**Expected output:**

```
Global MCP Servers:
  ✓ filesystem (connected)
  ✓ playwright (connected)
  ✓ context7 (connected)

Project MCP Servers:
  ✓ serena (connected)
```

---

### Checking Server Status

**In Claude Code session:**

```
/mcp
```

**What it shows:**

- Which servers are running
- Which servers failed to start
- Connection status for each

**Use when:**

- Tools seem slow or unresponsive
- Getting errors from MCP operations
- Verifying new server installation

---

### Removing MCP Servers

**Method 1: CLI command**

```bash
# Remove global server
claude mcp remove <server-name>

# Remove project server
claude mcp remove <server-name> --project
```

**Method 2: Manual deletion**

Edit `~/.claude.json` or `.mcp.json` and remove the server configuration block.

---

### Troubleshooting MCP Servers

#### Server Not Responding

**Symptom:** Tool calls timeout or hang

**Check:**

```
/mcp    # In Claude Code - shows server status
```

**Common causes:**

1. Server process crashed
2. Network issues (Context7 requires internet)
3. Missing environment variables
4. Conflicting configuration

**Fix:**

```bash
# Restart Claude Code session
# Or manually restart server by editing config
```

---

#### Server Not Found

**Symptom:** "MCP server 'xyz' not found"

**Check:**

```bash
claude mcp list
```

**Common causes:**

1. Server not installed
2. Wrong server name in request
3. Project-specific server, but working globally

**Fix:**

```bash
# Install if missing
claude mcp add @package/name

# Or verify correct server name
/mcp
```

---

#### High Context Usage

**Symptom:** Session runs out of context quickly

**Check:**

```
/context    # Shows context usage
```

**Common causes:**

- Too many MCP servers installed
- MCP operations returning large results
- Multiple parallel MCP calls

**Fix:**

- Remove unnecessary MCP servers
- Be selective about which MCP tools to use
- Start fresh session with `/clear`

---

## 6. Best Practices

### Configuration Management

**Do:**

- ✅ Install universal tools with `--scope user` (Context7, Filesystem)
- ✅ Install team-shared tools with `--scope project` (Serena for brownfield)
- ✅ Use `--scope local` (default) for personal project-specific overrides
- ✅ Commit `.mcp.json` to version control (contains project scope servers)
- ✅ Document custom MCP servers in project README
- ✅ Use environment variables for API keys (don't commit secrets)

**Don't:**

- ❌ Confuse `--scope project` with "just for this project" (it means team-shared!)
- ❌ Duplicate servers across scopes unless you need to override
- ❌ Commit API keys to version control
- ❌ Install every MCP server you find (context overhead)
- ❌ Use `--scope user` for project-specific tools

---

### ⚠️ Common Pitfall: The `--scope project` Confusion

**What you might expect:**

```bash
# "I want this MCP server just for MY work on this project"
claude mcp add --scope project serena -- npx -y @oraios/serena --cwd .
```

**What actually happens:**

- ✅ Creates/updates `.mcp.json` in your project directory
- ✅ Available to EVERYONE on the team (when they pull the repo)
- ✅ Meant to be committed to git

**If you wanted it just for you:**

```bash
# Use --scope local (or omit flag) instead
claude mcp add serena -- npx -y @oraios/serena --cwd .
# OR explicitly:
claude mcp add --scope local serena -- npx -y @oraios/serena --cwd .
```

**Quick decision guide:**

- "Want it everywhere I work?" → `--scope user`
- "Want the whole team to have it?" → `--scope project`
- "Want it just for me in this project?" → `--scope local` (or no flag)

---

### Performance Optimization

**Minimize context usage:**

- Only install MCP servers you actually use
- Remove unused servers
- Be selective about when to use MCP tools vs built-in tools

**Example:**

```
# Instead of always using MCP Filesystem
Bad:  "Use Filesystem MCP to read file.txt" (overhead)
Good: "Read file.txt" (built-in Read tool)

# Use MCP when it adds value
Good: "Use Filesystem MCP to analyze directory structure with metadata"
```

---

### Team Collaboration

**Sharing project MCP configuration:**

1. Commit `.mcp.json` to git
2. Document required environment variables in README
3. Provide setup instructions for new team members

**Example README section:**

````markdown
## MCP Server Setup

This project uses Serena MCP for codebase analysis.

### Installation

```bash
# Install project MCP servers
claude mcp add @oraios/serena --project
```
````

---

## 7. Advanced: Custom MCP Servers

### When to Build Custom MCP Server

**Consider building custom MCP server when:**

- Need project-specific integrations (internal APIs, tools)
- Want to extend Claude Code with domain-specific knowledge
- Require custom data sources or processing

**Don't build when:**

- Existing MCP server already does it
- Simple bash script would suffice
- Overhead not justified by use frequency

---

### Basic Custom MCP Server Structure

**Example: Simple custom server**

```javascript
// custom-mcp-server.js
const {Server} = require("@modelcontextprotocol/sdk");

const server = new Server({
    name: "custom-project-server",
    version: "1.0.0",
});

// Define tools the server provides
server.tool("get-project-info", async () => {
    return {
        name: "My Project",
        version: "1.0.0",
        // Custom project data
    };
});

server.start();
```

**Configuration:**

```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": [
        "./custom-mcp-server.js"
      ]
    }
  }
}
```

---

## Key Takeaways

- [ ] MCP servers extend Claude Code with specialized capabilities
- [ ] Three scopes: **user** (all projects), **project** (team-shared), **local** (personal project-specific)
- [ ] `--scope user` = Available everywhere you work (stored in `~/.claude.json`)
- [ ] `--scope project` = Shared with team via `.mcp.json` (commit to git)
- [ ] `--scope local` = Just for you in this project (default, stored in `~/.claude.json` but project-linked)
- [ ] Priority: local → project → user
- [ ] Common confusion: `--scope project` means TEAM-SHARED, not "just for this project"
- [ ] Essential servers: Filesystem, Context7 (install with `--scope user`)
- [ ] Team tools like Serena: install with `--scope project`
- [ ] Monitor with `/mcp` and `/context` commands
- [ ] Only install MCP servers you actually use (context overhead)

---

## Quick Reference

### Essential Commands

```bash
# Install for all your projects (user scope)
claude mcp add --scope user <name> -- npx -y <package> [args]

# Install for team (project scope - creates .mcp.json)
claude mcp add --scope project <name> -- npx -y <package> [args]

# Install for just you in this project (local scope - default)
claude mcp add <name> -- npx -y <package> [args]

# List servers
claude mcp list

# Remove server
claude mcp remove <server-name>
```

### Scope Quick Reference

| Scope   | Flag                      | Location                          | Shared     | Use Case           |
|---------|---------------------------|-----------------------------------|------------|--------------------|
| User    | `--scope user`            | `~/.claude.json`                  | No         | Universal tools    |
| Project | `--scope project`         | `.mcp.json`                       | Yes (team) | Team tools         |
| Local   | `--scope local` (default) | `~/.claude.json` (project-linked) | No         | Personal overrides |

### In Claude Code Session

```
/mcp        # Check server status
/context    # Check context usage
/help       # General help
```

### Configuration Locations

- **User scope:** `~/.claude.json`
- **Project scope:** `.mcp.json` (project root)
- **Local scope:** `~/.claude.json` (but project-specific)

---

**Related Content:**

- [Day 1: Tools & Setup](../companion/day-1/tools-setup.md) - Hands-on MCP setup

---

**Next Chapter:** [To be determined]
