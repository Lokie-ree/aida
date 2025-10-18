# Git Workflow Guide - Pelican AI

## 🚫 **Golden Rule: Never Push Directly to Main**

All changes must go through a feature branch → pull request → review → merge workflow.

---

## 📋 Standard Workflow

### 1. **Create Linear Issue (if needed)**

Before starting development, check if a Linear issue exists:

```bash
# Check existing issues
# Visit: https://linear.app/web-agency/team/web-agency/active
# Or search for related issues in Linear
```

**If no issue exists, create one:**
- Use Linear web interface or API
- Follow issue template format
- Set appropriate priority (P0/P1/P2)
- **Assign to appropriate agent** (see Agent Assignment Guide below)
- Link to any related issues

### 1.1. **Agent Assignment Guide**

**Assign issues based on the primary work type:**

**@.cursor/rules/engineer.mdc** - Implementation work:
- Frontend/backend development
- Bug fixes and feature implementation
- Code refactoring and optimization
- Technical debt resolution

**@.cursor/rules/architect.mdc** - System design:
- API design and architecture decisions
- Database schema changes
- Performance optimization
- Technical feasibility analysis

**@.cursor/rules/ux-designer.mdc** - User experience:
- UI/UX design and improvements
- Accessibility compliance
- User flow optimization
- Design system updates

**@.cursor/rules/security.mdc** - Security and compliance:
- Security vulnerability fixes
- FERPA compliance validation
- Security audits and scans
- Data protection measures

**@.cursor/rules/qa.mdc** - Quality assurance:
- Test development and execution
- Bug validation and reproduction
- Quality gates and acceptance criteria
- E2E testing and validation

**@.cursor/rules/wrecking-ball.mdc** - Simplification:
- Code cleanup and removal
- Technical debt elimination
- Documentation consolidation
- Dependency optimization

**@.cursor/rules/pm.mdc** - Product management:
- Feature prioritization
- User story definition
- Business requirements
- Stakeholder coordination

**@.cursor/rules/documentation.mdc** - Documentation:
- Documentation updates
- ADR creation and maintenance
- README and changelog updates
- Knowledge base management

### 2. **Create Feature Branch**

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

### 3. **Make Changes**

```bash
# Make your code changes
# Run tests frequently
npm run test:unit
npm run test:integration

# Update Linear issue status to "In Progress" if not already
# Visit: https://linear.app/web-agency/issue/WEB-XX

# Commit with clear messages (include Linear issue ID and agent)
git add .
git commit -m "feat(WEB-XX): add temporary password generation to beta signup (@engineer.mdc)"
```

**Commit Message Convention:**
- `feat(WEB-XX):` - New feature
- `fix(WEB-XX):` - Bug fix
- `docs(WEB-XX):` - Documentation only
- `test(WEB-XX):` - Adding/fixing tests
- `refactor(WEB-XX):` - Code refactoring
- `style(WEB-XX):` - Formatting, missing semicolons, etc.
- `chore(WEB-XX):` - Updating dependencies, build scripts, etc.

**Agent Coordination:**
- Include agent reference in commit messages: `(@agent.mdc)`
- Tag relevant agents in Linear issue comments for review
- Coordinate with other agents when work overlaps
- Use agent-specific tools and patterns

**Linear Integration:**
- Include Linear issue ID in commit messages
- Update issue status as you progress
- Add comments to Linear issue for major milestones
- Tag relevant agents for review and feedback

### 4. **Push Feature Branch**

```bash
# Push to remote
git push origin feature/WEB-XX-descriptive-name

# If branch doesn't exist yet, set upstream
git push -u origin feature/WEB-XX-descriptive-name
```

### 5. **Update Linear Issue Status**

```bash
# Update Linear issue to "In Review" status
# Visit: https://linear.app/web-agency/issue/WEB-XX
# Add comment with PR link and progress update
```

### 6. **Generate PR Title and Description**

After pushing your feature branch, generate a clear PR title and description:

**PR Title Format:**
- `feat: Add [feature name] (WEB-XX)` (e.g., "feat: Add privacy policy and terms of service modals (WEB-46)")
- `fix: Fix [issue description] (WEB-XX)` (e.g., "fix: Resolve authentication validation error (WEB-15)")
- `docs: Update [documentation] (WEB-XX)` (e.g., "docs: Update API guidelines (WEB-46)")

**PR Description Template:**
```markdown
## 📋 What Changed
- Brief bullet points of main changes
- New features added
- Bug fixes implemented

## 🎯 Why This Change
- Problem being solved
- User benefit
- Business value

## 🧪 Testing
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] Integration tests pass (`npm run test:integration`)
- [ ] Build successful (`npm run build`)
- [ ] Lint checks pass (`npm run lint`)
- [ ] Manual testing completed

## 📸 Screenshots (if UI changes)
- Before/after screenshots
- New UI components
- Mobile responsiveness

## 🔗 Related Issues
- Closes [WEB-XX](https://linear.app/web-agency/issue/WEB-XX)
- Related to [WEB-XX](https://linear.app/web-agency/issue/WEB-XX)

## 📝 Additional Notes
- Any special considerations
- Breaking changes
- Migration steps needed
- Linear issue status updates
```

### 7. **Create Pull Request**

1. Go to GitHub repository: https://github.com/Lokie-ree/aida
2. Click "Compare & pull request" (appears after push)
3. Use the generated PR title and description from step 6
4. Request review (if working with team)
5. Link related Linear issues in PR description

### 8. **Update Linear Issue During Review**

```bash
# Add comments to Linear issue as PR progresses
# Update status to "In Review" if not already
# Add PR link to Linear issue comments
# Respond to any feedback or questions
```

### 9. **Merge & Cleanup**

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

## 📊 Linear Integration

### Linear Issue Lifecycle

1. **Todo** → **In Progress** → **In Review** → **Done**
2. **Canceled** (if work is no longer needed)

### Linear Issue Status Updates

```bash
# When starting work
# Update status to "In Progress"
# Add comment: "Starting work on [feature description]"

# When creating PR
# Update status to "In Review" 
# Add comment: "PR created: [PR link]"

# When work is complete
# Update status to "Done"
# Add comment: "Completed: [summary of changes]"
```

### Linear Issue Templates

**Feature Development:**
- Title: `feat: [Feature Name]`
- Priority: P0 (Critical), P1 (High), P2 (Medium)
- Labels: `feature`, `frontend`/`backend`/`fullstack`
- Assignee: Developer working on the issue

**Bug Fixes:**
- Title: `fix: [Bug Description]`
- Priority: Based on severity
- Labels: `bug`, `frontend`/`backend`/`fullstack`
- Assignee: Developer fixing the issue

**Documentation:**
- Title: `docs: [Documentation Update]`
- Priority: P2 (Medium)
- Labels: `documentation`
- Assignee: Developer updating docs

### Linear Issue Links

- **Team Issues:** https://linear.app/web-agency/team/web-agency/active
- **Create Issue:** https://linear.app/web-agency/issue/new
- **Issue Template:** Use existing WEB-XX format

## 🤝 Agent Collaboration Patterns

### Multi-Agent Workflows

**Feature Development (Engineer + UX Designer + QA):**
1. **UX Designer** creates design specs and user flows
2. **Engineer** implements the feature
3. **QA** validates implementation against acceptance criteria
4. **Security** reviews for vulnerabilities (if needed)

**Bug Fix (QA + Engineer + Security):**
1. **QA** reproduces and documents the bug
2. **Engineer** implements the fix
3. **Security** validates fix doesn't introduce vulnerabilities
4. **QA** validates fix resolves the issue

**Architecture Changes (Architect + Engineer + Security):**
1. **Architect** designs the solution
2. **Engineer** implements the changes
3. **Security** reviews for security implications
4. **QA** tests the implementation

**Documentation Updates (Documentation + PM + Engineer):**
1. **PM** defines requirements
2. **Engineer** provides technical details
3. **Documentation** creates/updates docs
4. **PM** reviews for accuracy

### Agent Handoff Patterns

**When to Hand Off:**
- **Engineer → QA:** Feature implementation complete
- **QA → Engineer:** Bug reproduction steps documented
- **Architect → Engineer:** Technical design approved
- **UX Designer → Engineer:** Design specs finalized
- **Any Agent → Documentation:** Major changes completed

**Handoff Checklist:**
- [ ] Work is complete and tested
- [ ] Linear issue updated with current status
- [ ] Next agent tagged in Linear issue
- [ ] Handoff notes added to issue comments
- [ ] Any blockers or dependencies documented

### Agent-Specific Commit Patterns

**Engineer commits:**
```bash
git commit -m "feat(WEB-XX): implement user authentication flow (@engineer.mdc)"
git commit -m "fix(WEB-XX): resolve CORS issues in auth endpoints (@engineer.mdc)"
```

**UX Designer commits:**
```bash
git commit -m "feat(WEB-XX): add mobile-responsive signup form (@ux-designer.mdc)"
git commit -m "style(WEB-XX): update button colors per brand guidelines (@ux-designer.mdc)"
```

**QA commits:**
```bash
git commit -m "test(WEB-XX): add E2E tests for signup flow (@qa.mdc)"
git commit -m "fix(WEB-XX): update test fixtures for new auth flow (@qa.mdc)"
```

**Security commits:**
```bash
git commit -m "fix(WEB-XX): sanitize user input in email templates (@security.mdc)"
git commit -m "feat(WEB-XX): add FERPA compliance validation (@security.mdc)"
```

**Architect commits:**
```bash
git commit -m "feat(WEB-XX): redesign database schema for scalability (@architect.mdc)"
git commit -m "refactor(WEB-XX): optimize Convex query performance (@architect.mdc)"
```

**Wrecking Ball commits:**
```bash
git commit -m "refactor(WEB-XX): remove unused auth workarounds (@wrecking-ball.mdc)"
git commit -m "chore(WEB-XX): consolidate duplicate documentation (@wrecking-ball.mdc)"
```

**PM commits:**
```bash
git commit -m "docs(WEB-XX): update user stories and acceptance criteria (@pm.mdc)"
git commit -m "feat(WEB-XX): add feature flag for beta rollout (@pm.mdc)"
```

**Documentation commits:**
```bash
git commit -m "docs(WEB-XX): create ADR for test data management (@documentation.mdc)"
git commit -m "docs(WEB-XX): update README with new features (@documentation.mdc)"
```

## 🛠️ Agent-Specific Tools & Patterns

### Engineer (@.cursor/rules/engineer.mdc)
**Primary Tools:** Convex MCP, Playwright MCP, Context7, Firecrawl MCP
**Focus:** Implementation, bug fixes, code quality
**Commit Pattern:** `feat(WEB-XX): implement feature (@engineer.mdc)`

### Architect (@.cursor/rules/architect.mdc)
**Primary Tools:** Convex MCP, Playwright MCP, Context7, Firecrawl MCP
**Focus:** System design, API contracts, scalability
**Commit Pattern:** `feat(WEB-XX): design architecture (@architect.mdc)`

### UX Designer (@.cursor/rules/ux-designer.mdc)
**Primary Tools:** Playwright MCP, Context7, Firecrawl MCP
**Focus:** User experience, accessibility, design system
**Commit Pattern:** `feat(WEB-XX): improve UX (@ux-designer.mdc)`

### Security (@.cursor/rules/security.mdc)
**Primary Tools:** Semgrep MCP, Convex MCP, Playwright MCP, Firecrawl MCP
**Focus:** Security audits, FERPA compliance, vulnerability detection
**Commit Pattern:** `fix(WEB-XX): security fix (@security.mdc)`

### QA (@.cursor/rules/qa.mdc)
**Primary Tools:** Convex MCP, Playwright MCP, Linear, Firecrawl MCP
**Focus:** Testing, bug validation, quality gates
**Commit Pattern:** `test(WEB-XX): add tests (@qa.mdc)`

### Wrecking Ball (@.cursor/rules/wrecking-ball.mdc)
**Primary Tools:** Convex MCP, Playwright MCP, grep/codebase_search, file_search/glob
**Focus:** Simplification, technical debt removal, cleanup
**Commit Pattern:** `refactor(WEB-XX): simplify code (@wrecking-ball.mdc)`

### PM (@.cursor/rules/pm.mdc)
**Primary Tools:** Convex MCP, Playwright MCP, Linear, Firecrawl MCP
**Focus:** Product strategy, user stories, business requirements
**Commit Pattern:** `docs(WEB-XX): update requirements (@pm.mdc)`

### Documentation (@.cursor/rules/documentation.mdc)
**Primary Tools:** grep/codebase_search, file_search/glob, read_file, search_replace
**Focus:** Documentation maintenance, consistency, coordination
**Commit Pattern:** `docs(WEB-XX): update docs (@documentation.mdc)`

---

## 🔧 Quick Commands

### Check Current Branch
```bash
git branch
# or
git status
```

### Switch Branches
```bash
git checkout main
git checkout feature/your-feature-name
```

### View Uncommitted Changes
```bash
git status
git diff
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Stash Work in Progress
```bash
# Save current work temporarily
git stash

# Switch branches, do something else...

# Restore stashed work
git stash pop
```

---

## 🚨 Emergency: Already Pushed to Main?

If you accidentally pushed to main:

### Option 1: Revert Commit (Safest)
```bash
# Create a new commit that undoes the changes
git revert HEAD
git push origin main
```

### Option 2: Reset (Use with Caution!)
```bash
# ⚠️ ONLY if no one else has pulled your changes
git reset --hard HEAD~1
git push --force origin main  # Requires force push
```

**⚠️ WARNING:** Only use reset/force push if:
- You're the only developer
- No one has pulled your changes
- You're absolutely certain

---

## 📊 Pre-Push Checklist

Before pushing ANY branch:

- [ ] Tests pass (`npm run test:unit && npm run test:integration`)
- [ ] No linter errors (`npm run lint`)
- [ ] Commit messages are clear and conventional
- [ ] Branch name follows convention
- [ ] Changes are on feature branch (NOT main!)
- [ ] `.env` and secrets are not committed

---

## 🛡️ Branch Protection (Recommended)

### GitHub Settings

Enable these on your repository:

1. **Settings → Branches → Add rule for `main`**
2. **Check:**
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

### Setup Instructions

1. Go to: https://github.com/Lokie-ree/aida/settings/branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Select protection rules above
5. Click "Create" or "Save changes"

---

## 🎯 Example: Complete Feature Workflow with Agent Coordination

```bash
# 1. Start fresh
git checkout main
git pull origin main

# 2. Create Linear issue (assigned to @architect.mdc)
# Issue: WEB-47 - Add temporaryPassword field to betaSignups schema
# Priority: P1
# Assignee: @architect.mdc

# 3. Create feature branch
git checkout -b feature/WEB-47-temporary-password-field

# 4. Architect designs the solution
# @architect.mdc reviews schema changes, validates approach
git add .
git commit -m "feat(WEB-47): design temporaryPassword schema (@architect.mdc)"

# 5. Hand off to Engineer for implementation
# Update Linear issue: "Ready for implementation - @engineer.mdc"

# 6. Engineer implements the changes
# @engineer.mdc implements schema update, tests integration
npm run test:unit
npm run test:integration
git add .
git commit -m "feat(WEB-47): implement temporaryPassword field (@engineer.mdc)"

# 7. Hand off to QA for validation
# Update Linear issue: "Implementation complete - @qa.mdc"

# 8. QA validates the implementation
# @qa.mdc runs E2E tests, validates schema changes
git add .
git commit -m "test(WEB-47): add validation tests for temporaryPassword (@qa.mdc)"

# 9. Security review (if needed)
# @security.mdc reviews for FERPA compliance
git add .
git commit -m "fix(WEB-47): ensure FERPA compliance in password handling (@security.mdc)"

# 10. Documentation update
# @documentation.mdc updates schema documentation
git add .
git commit -m "docs(WEB-47): update schema documentation (@documentation.mdc)"

# 11. Push feature branch
git push -u origin feature/WEB-47-temporary-password-field

# 12. Generate PR title and description
# Title: "feat: Add temporaryPassword field to betaSignups schema (WEB-47)"
# Description: Include agent coordination details

# 13. Create PR on GitHub
# Link to Linear issue: WEB-47
# Tag relevant agents for review

# 14. After approval & merge, clean up
git checkout main
git pull origin main
git branch -d feature/WEB-47-temporary-password-field

# 15. Update Linear issue to "Done"
# Add completion comment with summary
```

---

## 📝 PR Generation Example

Based on your recent changes, here's how to generate PR content:

**For the current branch `feature/privacy-terms-modals-and-email-updates`:**

**PR Title:**
```
feat: Add privacy policy and terms of service modals with email updates
```

**PR Description:**
```markdown
## 📋 What Changed
- Add PrivacyPolicyModal and TermsOfServiceModal components
- Update LandingPage to include privacy/terms links
- Enhance email.ts with additional functionality
- Update README.md with latest project information
- Add LICENSE file
- Include Playwright MCP test screenshots

## 🎯 Why This Change
- Improves legal compliance with privacy policy and terms of service
- Enhances user trust with transparent legal documentation
- Provides better email functionality for user communication
- Updates project documentation for better maintainability

## 🧪 Testing
- [x] Unit tests pass (`npm run test:unit`)
- [x] Integration tests pass (`npm run test:integration`)
- [x] Build successful (`npm run build`)
- [x] Lint checks pass (`npm run lint`)
- [x] Manual testing completed

## 📸 Screenshots (if UI changes)
- New privacy policy modal component
- New terms of service modal component
- Updated landing page with legal links

## 🔗 Related Issues
- Improves legal compliance requirements
- Enhances user experience with clear legal documentation

## 📝 Additional Notes
- All components follow Pelican AI design system
- Modals are accessible and mobile-responsive
- Email updates maintain backward compatibility
```

---

## 🤝 Working with Team

### Before Starting New Work
```bash
git checkout main
git pull origin main  # Get latest changes
```

### Keep Feature Branch Updated
```bash
# While working on long-lived feature branch
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main  # Merge latest main into your branch
# or
git rebase main  # Rebase your changes on top of main (cleaner history)
```

### Resolve Merge Conflicts
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

## 📝 Alias Setup (Optional)

Add to `~/.gitconfig` or `~/.zshrc`:

```bash
# Git aliases
alias gs='git status'
alias gb='git branch'
alias gc='git checkout'
alias gcb='git checkout -b'
alias gp='git pull origin main'
alias gpu='git push'
alias gaa='git add .'
alias gcm='git commit -m'
alias glog='git log --oneline --graph --decorate'
```

---

## 🎓 Learning Resources

- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

---

**Remember:** Feature branches are cheap, PRs are valuable, and `main` should always be deployable! 🚀

