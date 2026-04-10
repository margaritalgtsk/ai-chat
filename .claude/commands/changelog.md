# Command: /changelog

## Description

Analyze git commit history and generate a structured, human-readable `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/) format.

## Usage

```
/changelog                   # generate from last tag to HEAD
/changelog --from v1.2.0     # generate from a specific tag
/changelog --range v1.0.0..v2.0.0  # generate between two tags
/changelog --preview         # print to chat only, do not write file
```

## Instructions

You are a changelog generation assistant. Follow these steps exactly:

### 1. Handle flags

- No flags → use `git log <last-tag>..HEAD`
- `--from <tag>` → use `git log <tag>..HEAD`
- `--range <from>..<to>` → use `git log <from>..<to>`
- `--preview` → print output to chat only, skip writing to file

### 2. Get the latest tag (if no flag provided)

```bash
git describe --tags --abbrev=0
```

If no tags exist, fall back to the full history:

```bash
git log --oneline
```

### 3. Read commit history

```bash
git log <range> --pretty=format:"%h %s" --no-merges
```

### 4. Categorize commits by type

Map conventional commit prefixes to changelog sections:

| Commit type       | Changelog section |
| ----------------- | ----------------- |
| `feat`            | ### Added         |
| `fix`             | ### Fixed         |
| `perf`            | ### Changed       |
| `refactor`        | ### Changed       |
| `docs`            | ### Changed       |
| `chore`, `ci`     | (skip or group)   |
| `BREAKING CHANGE` | ### Breaking      |

### 5. Get the next version

Ask the user:

> "What version is this release? (e.g. `v1.3.0`). Press enter to use `Unreleased`."

### 6. Generate CHANGELOG entry

Use this format:

```markdown
## [v1.3.0] - 2024-06-01

### Breaking

- Removed support for Node.js 16 (#201)

### Added

- Google OAuth2 login flow (#142)
- Dark mode toggle in settings (#155)

### Fixed

- Duplicate items in cart on rapid click (#87)
- Token expiry not handled on refresh (#91)

### Changed

- Improved response time for search queries (#110)
- Updated README setup instructions (#130)
```

### 7. Write or preview

- If `--preview` → print the entry to chat only.
- Otherwise, **prepend** the new entry to the top of `CHANGELOG.md` (create the file if it doesn't exist), then confirm:
  > "✅ CHANGELOG.md updated with `v1.3.0`"

### 8. Offer next step

After writing, ask:

> "Would you like me to also create a git tag for this release? (`git tag v1.3.0`)"

## Example

**Input:** `/changelog --from v1.2.0`

**Output written to `CHANGELOG.md`:**

```markdown
## [v1.3.0] - 2024-06-01

### Added

- Google OAuth2 login flow (#142)

### Fixed

- Duplicate items in cart on rapid click (#87)

### Changed

- Updated README setup instructions (#130)
```

> ✅ CHANGELOG.md updated. Want me to tag this release?

## Rules

- Skip merge commits and `chore`/`ci` commits unless they are significant.
- Group multiple small fixes into one line if they touch the same area.
- Always link issue numbers as `(#123)` when available in the commit message.
- Never overwrite existing changelog entries — only prepend new ones.
