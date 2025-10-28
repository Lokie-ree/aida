# Contributing to Pelican AI

**Last Updated:** October 20, 2025  
**Status:** Active Development Guidelines

Welcome! This guide covers everything you need to know about developing Pelican AI, from setting up your environment to shipping production code.

---

## Table of Contents

- [🚫 Golden Rule](#-golden-rule)
- [📋 Development Workflow](#-development-workflow)
- [🤖 Agent System](#-agent-system)
- [🧪 Testing](#-testing)
- [📝 Code Standards](#-code-standards)
- [🏗️ Development Setup](#️-development-setup)
- [🔧 Common Tasks](#-common-tasks)
- [🚨 Emergency Procedures](#-emergency-procedures)
- [📚 Resources](#-resources)

---

## 🚫 Golden Rule

**Never push directly to `main`**

All changes must go through a feature branch → pull request → review → merge workflow.

---

## 📋 Development Workflow

### 1. Create Linear Issue (if needed)

Before starting development, check if a Linear issue exists:

```bash
# Check existing issues
# Visit: https://linear.app/web-agency/team/web-agency/active
```

**If no issue exists, create one:**
- Use Linear web interface or API
- Follow issue template format
- Set appropriate priority (P0/P1/P2)
- **Assign to appropriate agent** (see Agent Assignment Guide below)
- Link to any related issues

### 2. Create Feature Branch

```bash
# Start from updated main
git checkout main
git pull origin main

# Create descriptive feature branch (include Linear issue ID if applicable)
git checkout -b feature/WEB-XX-descriptive-name
# or
git checkout -b fix/WEB-XX-bug-description
# or
git checkout -b docs/WEB-XX-documentation-update
```

**Branch Naming Convention:**
- `feature/WEB-XX-` - New features (e.g., `feature/WEB-18-framework-library-ui`)
- `fix/WEB-XX-` - Bug fixes (e.g., `fix/WEB-15-auth-endpoint-issues`)
- `docs/WEB-XX-` - Documentation updates (e.g., `docs/WEB-46-test-data-management`)
- `refactor/WEB-XX-` - Code refactoring (e.g., `refactor/WEB-16-test-coverage`)
- `test/WEB-XX-` - Test additions/fixes (e.g., `test/WEB-23-e2e-validation`)

### 3. Make Changes

```bash
# Make your code changes
# Run tests frequently
pnpm test:unit
pnpm test:integration

# Update Linear issue status to "In Progress" if not already
# Visit: https://linear.app/web-agency/issue/WEB-XX

# Commit with clear messages (include Linear issue ID and agent)
git add .
git commit -m "feat(WEB-XX): add temporary password generation to beta signup (@developer.mdc)"
```

**Commit Message Convention:**
- `feat(WEB-XX):` - New feature
- `fix(WEB-XX):` - Bug fix
- `docs(WEB-XX):` - Documentation only
- `test(WEB-XX):` - Adding/fixing tests
- `refactor(WEB-XX):` - Code refactoring
- `style(WEB-XX):` - Formatting, missing semicolons, etc.
- `chore(WEB-XX):` - Updating dependencies, build scripts, etc.

### 4. Push Feature Branch

```bash
# Push to remote
git push origin feature/WEB-XX-descriptive-name

# If branch doesn't exist yet, set upstream
git push -u origin feature/WEB-XX-descriptive-name
```

### 5. Create Pull Request

#### AI-Assisted PR Generation

After pushing your feature branch, use AI to generate a professional PR title and description:

**Option A: Using Cursor AI**
1. After pushing, open a chat in Cursor
2. Use this prompt template:
```
Generate a PR title and description for my recent commits. 
Review the changes in [feature branch name] compared to main.

Include:
- Clear, descriptive title following the format: [type]: [description] (WEB-XX)
- Summary of changes
- Testing performed
- Linear issue links
- Any breaking changes or migration notes
```

3. Copy the generated title and description
4. Create the PR on GitHub using the AI-generated content

**Option B: Manual PR Creation**
1. Go to GitHub repository: https://github.com/Lokie-ree/aida
2. Click "Compare & pull request" (appears after push)
3. Use clear PR title and description following the format below
4. Request review (if working with team)
5. Link related Linear issues in PR description

**PR Title Format:**
- `feat: Add [feature name] (WEB-XX)` (e.g., "feat: Add privacy policy and terms of service modals (WEB-46)")
- `fix: Fix [issue description] (WEB-XX)` (e.g., "fix: Resolve authentication validation error (WEB-15)")
- `docs: Update [documentation] (WEB-XX)` (e.g., "docs: Update API guidelines (WEB-46)")

**PR Description Template:**
```markdown
## Summary
[Brief description of what this PR does]

## Changes
- [ ] Feature X implemented
- [ ] Bug Y fixed  
- [ ] Documentation updated

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Related Issues
Closes #WEB-XX

## Deployment Notes
[N/A or specific deployment instructions]
```

### 6. Merge & Cleanup

```bash
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feature/WEB-XX-descriptive-name  # Delete local branch
git push origin --delete feature/WEB-XX-descriptive-name  # Delete remote branch

# Update Linear issue to "Done" status
# Visit: https://linear.app/web-agency/issue/WEB-XX
# Add completion comment with summary of changes
# Link to merged PR for reference
```

---

## 🤖 Agent System

Pelican AI uses role-based AI agents defined in `.cursor/rules/` to coordinate development.

### Agent Roles

**@.cursor/rules/product.mdc** - Product & Design
- Business strategy, user experience
- User stories and acceptance criteria
- Design system and brand compliance

**@.cursor/rules/developer.mdc** - Full-Stack Development
- System architecture and implementation
- Technical decisions and coding
- Database design and API development

**@.cursor/rules/security.mdc** - Security & Compliance
- FERPA compliance validation
- Security audits (Semgrep)
- Vulnerability detection

**@.cursor/rules/qa.mdc** - Quality Assurance
- Test planning and execution
- Bug reporting and validation
- Quality gates and acceptance

### Agent Assignment Guide

**Assign issues based on the primary work type:**

- **@.cursor/rules/developer.mdc** - Implementation work (frontend/backend development, bug fixes, code refactoring)
- **@.cursor/rules/product.mdc** - Product management (feature prioritization, user story definition, business requirements)
- **@.cursor/rules/security.mdc** - Security and compliance (vulnerability fixes, FERPA compliance, security audits)
- **@.cursor/rules/qa.mdc** - Quality assurance (test development, bug validation, quality gates)

### Using Agents

**Single agent mode** (focused work):
```
@.cursor/rules/developer.mdc Help me implement authentication flow
```

**Multi-agent mode** (cross-functional):
```
@.cursor/rules/product.mdc @.cursor/rules/developer.mdc 
Design and implement the framework library UI
```

**Agent coordination patterns:**
1. **Product → Developer:** Requirements → Implementation
2. **Developer → QA:** Implementation → Validation
3. **QA → Developer:** Bug report → Fix
4. **Security → Developer:** Audit findings → Remediation

### Agent Commit Patterns

Include agent reference in commits:

```bash
git commit -m "feat(WEB-47): implement framework modal (@developer.mdc)"
git commit -m "test(WEB-48): add innovation form tests (@qa.mdc)"
git commit -m "fix(WEB-49): resolve header z-index issue (@developer.mdc)"
```

---

## 🧪 Testing

### Test Suite Overview
- **Unit Tests:** Individual function testing
- **Integration Tests:** Component interaction testing
- **E2E Tests:** Full user flow testing
- **API Tests:** Backend endpoint validation
- **Diagnostic Tests:** Environment and database state

### Running Tests
```bash
# Run all tests
pnpm test:beta-auth

# Run specific test types
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e            # End-to-end tests only
```

**Note:** See **[scripts/README.md](../scripts/README.md)** for current test coverage and detailed testing documentation.

### Test Data Management
- **Deployment Separation:** Tests run against Dev deployment (`kindly-setter.convex.cloud`)
- **Production Isolation:** Production deployment (`outgoing-parttridge.convex.cloud`) remains clean
- **Manual Cleanup:** Dev deployment data can be manually cleaned when needed
- **No Flags Needed:** Environmental separation eliminates need for test data flags

### Writing Tests

**Test file naming:**
```
scripts/unit/test-unit-[feature].js
scripts/integration/test-integration-[flow].js
scripts/e2e/test-e2e-[journey].js
```

**Test structure:**
```javascript
async function testFeatureName(runner, client) {
  runner.log("🧪 Testing feature name...");
  
  try {
    // Arrange: Set up test data
    const testData = { ... };
    
    // Act: Perform action
    const result = await client.mutation("feature:action", testData);
    
    // Assert: Verify results
    if (result.success) {
      runner.recordTest("Feature Name", true, "Success message");
    } else {
      runner.recordTest("Feature Name", false, "Failure message");
    }
  } catch (error) {
    runner.recordTest("Feature Name", false, error.message);
  }
}
```

### Test Coverage Goals
- **Unit Tests:** 90%+ coverage
- **Integration Tests:** All critical user flows
- **E2E Tests:** Complete user journeys
- **Current Status:** See **[Test Suite Documentation](../scripts/README.md)** for complete testing results

---

## 📝 Code Standards

### TypeScript
- **Mandatory:** All code must be TypeScript
- **Type Safety:** Strict type checking enabled
- **No `any`:** Avoid `any` types, use proper typing

**Always use strict mode** (already configured in `tsconfig.json`):

```typescript
// ✅ GOOD: Explicit types
const getUserProfile = async (userId: Id<"user">): Promise<UserProfile | null> => {
  return await ctx.db.query("userProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
};

// ❌ BAD: Implicit any
const getUserProfile = async (userId) => {
  return await ctx.db.query("userProfiles").unique();
};
```

### Convex Functions

**Always include validators** for args and returns:

```typescript
// ✅ GOOD: Complete function definition
export const recordFrameworkUsage = mutation({
  args: {
    frameworkId: v.id("frameworks"),
    action: v.union(v.literal("viewed"), v.literal("copied")),
    timeSaved: v.number(),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    // Implementation
    return { success: true };
  },
});

// ❌ BAD: Missing validators
export const recordFrameworkUsage = mutation(async (ctx, args) => {
  // Implementation
});
```

### React Components

**Use functional components with hooks:**

```typescript
// ✅ GOOD: Typed functional component
interface FrameworkCardProps {
  framework: Framework;
  onSelect: (id: Id<"frameworks">) => void;
}

export const FrameworkCard: React.FC<FrameworkCardProps> = ({ 
  framework, 
  onSelect 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Card onClick={() => onSelect(framework._id)}>
      <h3>{framework.title}</h3>
      <p>{framework.description}</p>
    </Card>
  );
};
```

### FERPA Compliance

**Never log PII** (Personally Identifiable Information):

```typescript
// ✅ GOOD: No PII in logs
console.log("User signed up", { 
  userId: user.id, 
  timestamp: Date.now() 
});

// ❌ BAD: PII in logs (FERPA violation)
console.log("User signed up", { 
  email: user.email, 
  name: user.name,
  school: user.school 
});
```

### Code Organization

**Follow atomic design principles:**

```
src/components/
├── ui/              # Atoms (shadcn/ui components)
├── shared/          # Molecules (reusable components)
├── framework/       # Organisms (feature-specific)
├── dashboard/       # Organisms (feature-specific)
└── community/       # Organisms (feature-specific)
```

### Accessibility
- **WCAG 2.1 Level AA:** Mandatory compliance
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader:** Semantic HTML and ARIA labels
- **Color Contrast:** Minimum 4.5:1 for normal text

### Mobile-First Design
- **Responsive Design:** All components must work on mobile
- **Touch Targets:** Minimum 44px for mobile interaction
- **Performance:** <3s page load times

---

## 🏗️ Development Setup

### Prerequisites

```bash
Node.js 18+
pnpm (recommended) or npm
Convex account (free tier works)
Git
```

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Lokie-ree/aida.git
cd aida

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials:
# - VITE_CONVEX_URL (from Convex dashboard)
# - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# - RESEND_API_KEY (from Resend dashboard)

# Start development servers
pnpm dev
```

### Environment Variables
- **Convex:** `CONVEX_DEPLOYMENT` and `CONVEX_URL`
- **Better Auth:** `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`
- **Resend:** `RESEND_API_KEY`
- **OpenAI:** `OPENAI_API_KEY` (Phase 2+)

### Verify Setup

```bash
# Run tests to ensure everything works
pnpm test:unit

# Check that you can access:
# - Frontend: http://localhost:5173
# - Convex Dashboard: npx convex dashboard
```

### Available Scripts

```bash
# Development
pnpm dev                 # Start both frontend and backend
pnpm dev:frontend        # Frontend only (Vite)
pnpm dev:backend         # Backend only (Convex)

# Building
pnpm build               # Build for production
pnpm lint                # Run TypeScript and build checks

# Testing
pnpm test:beta-auth      # Run all tests (72.7% success rate - auth endpoint issues)
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e            # End-to-end tests only
```

---

## 🔧 Common Tasks

### Adding a New Convex Function

```typescript
// 1. Define in convex/[feature].ts
export const myNewFunction = mutation({
  args: {
    field: v.string(),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    // Implementation
    return { success: true };
  },
});

// 2. Generate types
// Run: npx convex dev (auto-generates types)

// 3. Use in frontend
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const myFunction = useMutation(api.feature.myNewFunction);
await myFunction({ field: "value" });
```

### Adding a New Component

```typescript
// 1. Create component file
// src/components/[feature]/ComponentName.tsx

import { type FC } from "react";

interface ComponentNameProps {
  title: string;
  onAction: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

// 2. Export from index
// src/components/[feature]/index.ts
export { ComponentName } from "./ComponentName";

// 3. Use in parent component
import { ComponentName } from "@/components/feature";
```

### Running Convex Functions Manually

```bash
# Query (read-only)
npx convex run frameworks:getAllFrameworks

# Mutation (write)
npx convex run betaSignup:approveBetaSignup \
  --signupId "j123..." \
  --temporaryPassword "TempPass123" \
  --notes "Approved for testing"

# Action (external API)
npx convex run email:sendWelcomeEmail --userId "j123..."
```

### Database Migrations

Convex handles migrations automatically when you update `convex/schema.ts`:

```bash
# 1. Update schema
# Edit convex/schema.ts

# 2. Validate locally
npx convex dev  # Convex validates changes

# 3. Deploy to production
npx convex deploy  # Schema updates automatically
```

**No manual migration scripts needed!** Convex handles:
- Adding new tables
- Adding new fields (backward compatible)
- Adding/modifying indexes

---

## 🚨 Emergency Procedures

### Already Pushed to Main?

If you accidentally pushed to main:

**Option 1: Revert Commit (Safest)**
```bash
# Create a new commit that undoes the changes
git revert HEAD
git push origin main
```

**Option 2: Reset (Use with Caution!)**
```bash
# ⚠️ ONLY if no one else has pulled your changes
git reset --hard HEAD~1
git push --force origin main  # Requires force push
```

**⚠️ WARNING:** Only use reset/force push if:
- You're the only developer
- No one has pulled your changes
- You're absolutely certain

### Working with Team

**Before Starting New Work**
```bash
git checkout main
git pull origin main  # Get latest changes
```

**Keep Feature Branch Updated**
```bash
# While working on long-lived feature branch
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main  # Merge latest main into your branch
# or
git rebase main  # Rebase your changes on top of main (cleaner history)
```

**Resolve Merge Conflicts**
```bash
# If conflicts occur during merge/rebase
# 1. Open conflicted files, resolve conflicts
# 2. Mark as resolved
git add .
git commit -m "merge: resolve conflicts with main"
# or (if rebasing)
git rebase --continue
```

---

## 📚 Resources

### Documentation
- **[README.md](../README.md)** - Quick start and current status
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[AGENT.md](../AGENT.md)** - Agent collaboration patterns
- **[Product Requirements](PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Complete product specification
- **[Brand Guidelines](PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice
- **[Decision Records](decisions/)** - Architectural decisions (ADRs)

### External Resources
- **Convex Docs:** https://docs.convex.dev
- **Better Auth:** https://www.better-auth.com/docs
- **React 19:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

### Support Channels
- **Issues:** GitHub Issues for bug reports
- **Linear:** https://linear.app/web-agency for task tracking
- **Discord:** [Convex Community](https://discord.gg/convex) for Convex help

### Troubleshooting

**Build fails:**
```bash
# Clear caches and reinstall
rm -rf node_modules .next out
pnpm install
```

**Convex connection issues:**
```bash
# Check deployment
npx convex dashboard

# Verify environment variables
cat .env.local | grep CONVEX
```

**Test failures:**
```bash
# Clean test data
pnpm test:cleanup

# Run specific test
node scripts/unit/test-unit-frameworks.js
```

---

## Development Checklist

### Before Committing
- [ ] Code follows TypeScript strict mode
- [ ] All functions have validators (args + returns)
- [ ] No PII in console logs (FERPA compliance)
- [ ] Tests pass (`pnpm test:unit`)
- [ ] No linter errors (`pnpm lint`)
- [ ] Commit message follows convention

### Before Creating PR
- [ ] Branch is up to date with main
- [ ] All tests pass (unit, integration, E2E)
- [ ] Build succeeds (`pnpm build`)
- [ ] PR description complete
- [ ] Linear issue linked
- [ ] Screenshots for UI changes

### Before Merging
- [ ] PR approved by reviewer
- [ ] All CI checks pass
- [ ] No merge conflicts
- [ ] Linear issue updated
- [ ] Ready for production

---

## Project Structure

```
pelican-ai/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── framework/     # Framework library UI
│   │   ├── community/     # Community features UI
│   │   └── ui/            # shadcn/ui components
│   ├── emails/            # Email templates
│   └── lib/               # Utilities and configurations
├── convex/                # Backend (Convex functions)
│   ├── auth.ts           # Authentication logic
│   ├── frameworks.ts     # Framework library backend
│   ├── innovations.ts    # Community innovations
│   └── schema.ts         # Database schema
├── docs/                  # Documentation
├── scripts/               # Testing and utility scripts
└── public/                # Static assets
```

---

## Learning Resources

- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Convex Documentation](https://docs.convex.dev/)
- [React 19 Documentation](https://react.dev/)

---

**Remember:** Feature branches are cheap, PRs are valuable, and `main` should always be deployable! 🚀

---

*Questions? Check the docs or ask in the team channel. Happy coding! 🦅*