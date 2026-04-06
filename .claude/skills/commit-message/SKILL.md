---
name: commit-message

description: Analyzes staged git changes and generates a clear, conventional commit message following the [Conventional Commits](https://www.conventionalcommits.org/) specification.
---

## Trigger

Use this skill when the user asks to:

- "generate a commit message"
- "write a commit message"
- "commit my changes"
- "what should my commit say?"

## Steps

1. **Inspect staged changes**

   ```bash
   git diff --cached
   ```

2. **Inspect unstaged changes** (if nothing is staged)

   ```bash
   git diff
   ```

3. **Check recently modified files**

   ```bash
   git status
   ```

4. **Analyze the diff** and identify:
   - What changed (files, functions, logic)
   - Why it likely changed (bug fix, new feature, refactor, etc.)
   - What scope is affected (module, component, service)

5. **Generate the commit message** using the format below.

6. **Present the message** to the user and ask for confirmation or edits before running `git commit`.

## Commit Message Format

```
<type>(<scope>): <short summary>

[optional body — explain WHY, not just WHAT]

[optional footer — issue refs, breaking changes]
```

### Types

| Type       | When to use                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore`    | Build process, dependency updates, tooling              |
| `docs`     | Documentation only changes                              |
| `test`     | Adding or updating tests                                |
| `style`    | Formatting, missing semicolons, whitespace              |
| `perf`     | Performance improvements                                |
| `ci`       | CI/CD configuration changes                             |

### Rules

- Summary line: **≤ 72 characters**, imperative mood ("add" not "added")
- Body: wrap at **72 characters per line**
- Reference issues in footer: `Closes #123`, `Fixes #456`
- Mark breaking changes: `BREAKING CHANGE: <description>`

## Example Output

```
feat(auth): add Google OAuth2 login

Implement OAuth2 flow using passport.js. On success,
users are redirected to their dashboard. Tokens are
stored in HTTP-only cookies for security.

Closes #142
```

## Notes

- If the diff is large or spans multiple concerns, suggest **splitting into multiple commits**.
- If no changes are staged, prompt the user to stage files first or offer to stage all with `git add -A`.
- Never commit automatically — always confirm with the user first.
