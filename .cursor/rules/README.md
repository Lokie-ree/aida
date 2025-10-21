# Agent Rules

This directory contains specialized agent rules for Pelican AI development. Each agent focuses on specific responsibilities and uses targeted MCP tools.

## Available Agents

- **product.mdc** - Product & Design (business strategy, user experience, Louisiana educator empowerment)
- **developer.mdc** - Developer (full-stack implementation, system architecture, technical execution)
- **qa.mdc** - Quality Assurance (test planning, E2E testing, bug reporting, Phase 1 MVP validation)
- **security.mdc** - Security Specialist (Semgrep analysis, FERPA compliance, vulnerability detection)

## Usage

Reference specific agents in your prompts:

```
@.cursor/rules/product.mdc Help me prioritize these features for Phase 2 transition
@.cursor/rules/developer.mdc Implement the Better Auth integration with user profiles
@.cursor/rules/security.mdc Run Semgrep security scan on the authentication flow
@.cursor/rules/qa.mdc Create E2E test plan for beta signup flow
```

## Documentation Structure

**Two-Tier System:**
- **`.cursorrules`** - Project essentials (identity, tech stack, design system, agent selection)
- **`AGENT.md`** - Agent collaboration patterns, workflows, shared context, and quality standards
- **Individual Agent Rules** - Role-specific responsibilities, MCP tools, and quality standards

## Shared Context

All agents reference the centralized **[AGENT.md](../../AGENT.md)** file for:
- User personas and user stories
- Current system status and critical blockers
- MCP tool configurations and usage patterns
- Multi-agent collaboration workflows
- Quality standards and success metrics

This approach eliminates redundancy and ensures consistency across all agents.
