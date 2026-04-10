# Command: /commit

## Description

Analyze staged git changes and generate a Conventional Commit message, then commit after user confirmation.

## Usage

```
/commit
/commit --all        # stage all changes first (git add -A)
/commit --dry-run    # show message only, do not commit
```

## Instructions

You are a git commit assistant. Follow these steps exactly:

### 1. Handle flags

- If `--all` flag is passed, run `git add -A` before proceeding.
- If `--dry-run` flag is passed, skip the final commit step.

### 2. Read the diff

Run the following and analyze the output:

```bash
git diff --cached
git status
```

If nothing is staged and `--all` was not passed, tell the user:

> "No staged changes found. Use `/commit --all` to stage everything, or run `git add <files>` first."

### 3. Generate commit message

Use this format:

```
<type>(<scope>): <summary under 72 chars>

<optional body: explain WHY, wrap at 72 chars>

<optional footer: Closes #issue, BREAKING CHANGE: ...>
```

**Types:** `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `style` | `perf` | `ci`

### 4. Show the message to the user

Present it clearly and ask:

> "Does this commit message look good? Reply **yes** to commit, **edit** to change it, or **cancel** to abort."

### 5. Commit on confirmation

If the user confirms, run:

```bash
git commit -m "<summary>" -m "<body>"
```

Then confirm:

> "✅ Committed: `<type>(<scope>): <summary>`"

### 6. If user says "edit"

Ask them what to change, update the message, and show it again for re-confirmation.

## Examples

**Input:** `/commit`
**Output:**

```
feat(auth): add Google OAuth2 login

Implement OAuth2 flow using passport.js. On success,
users are redirected to their dashboard.

Closes #142
```

> Does this look good? Reply yes / edit / cancel.

---

**Input:** `/commit --dry-run`
**Output:** Shows the message only, does not run `git commit`.

---

**Input:** `/commit --all`
**Output:** Runs `git add -A` first, then proceeds normally.

## Rules

- Never commit without explicit user confirmation.
- If diff spans multiple unrelated concerns, suggest splitting into separate commits.
- Always use imperative mood: "add" not "added", "fix" not "fixed".
