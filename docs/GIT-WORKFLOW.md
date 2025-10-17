# Git Workflow Guide - Pelican AI

## 🚫 **Golden Rule: Never Push Directly to Main**

All changes must go through a feature branch → pull request → review → merge workflow.

---

## 📋 Standard Workflow

### 1. **Create Feature Branch**

```bash
# Start from updated main
git checkout main
git pull origin main

# Create descriptive feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/documentation-update
```

**Branch Naming Convention:**
- `feature/` - New features (e.g., `feature/email-scheduling`)
- `fix/` - Bug fixes (e.g., `fix/auth-validation-error`)
- `docs/` - Documentation updates (e.g., `docs/api-guidelines`)
- `refactor/` - Code refactoring (e.g., `refactor/test-organization`)
- `test/` - Test additions/fixes (e.g., `test/e2e-beta-flow`)

### 2. **Make Changes**

```bash
# Make your code changes
# Run tests frequently
npm run test:unit
npm run test:integration

# Commit with clear messages
git add .
git commit -m "feat: add temporary password generation to beta signup"
```

**Commit Message Convention:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `test:` - Adding/fixing tests
- `refactor:` - Code refactoring
- `style:` - Formatting, missing semicolons, etc.
- `chore:` - Updating dependencies, build scripts, etc.

### 3. **Push Feature Branch**

```bash
# Push to remote
git push origin feature/your-feature-name

# If branch doesn't exist yet, set upstream
git push -u origin feature/your-feature-name
```

### 4. **Generate PR Title and Description**

After pushing your feature branch, generate a clear PR title and description:

**PR Title Format:**
- `feat: Add [feature name]` (e.g., "feat: Add privacy policy and terms of service modals")
- `fix: Fix [issue description]` (e.g., "fix: Resolve authentication validation error")
- `docs: Update [documentation]` (e.g., "docs: Update API guidelines")

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
- Closes #[issue-number]
- Related to #[issue-number]

## 📝 Additional Notes
- Any special considerations
- Breaking changes
- Migration steps needed
```

### 5. **Create Pull Request**

1. Go to GitHub repository: https://github.com/Lokie-ree/aida
2. Click "Compare & pull request" (appears after push)
3. Use the generated PR title and description from step 4
4. Request review (if working with team)
5. Link related issues

### 6. **Merge & Cleanup**

```bash
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feature/your-feature-name  # Delete local branch
git push origin --delete feature/your-feature-name  # Delete remote branch
```

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

## 🎯 Example: Complete Feature Workflow

```bash
# 1. Start fresh
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/database-schema-update

# 3. Make changes, test frequently
# ... edit files ...
npm run test:unit
npm run test:integration

# 4. Commit
git add .
git commit -m "feat: add temporaryPassword field to betaSignups schema"

# 5. Push feature branch
git push -u origin feature/database-schema-update

# 6. Generate PR title and description
# Title: "feat: Add temporaryPassword field to betaSignups schema"
# Description: Use the template from step 4 above

# 7. Create PR on GitHub
# ... use generated title and description ...

# 8. After approval & merge, clean up
git checkout main
git pull origin main
git branch -d feature/database-schema-update
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

