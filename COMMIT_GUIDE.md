# 🧭 Commit Convention – KIWAME Project

This document defines the commit message standard for the **KIWAME Project**,  
following the **Conventional Commits** format.  
It ensures all commits are **consistent**, **meaningful**, and **easy to track** throughout development.

## 📦 Commit Message Format

> **`<type>(<scope>): <short summary>`**  

>**Example**: `feat(video): add upload and playback functionality`

## 🧩 Commit Types

| Type | Description | Example |
|------|--------------|----------|
| **feat** | Add a new feature | `feat(stream): add live streaming feature` |
| **fix** | Fix a bug | `fix(api): correct video metadata response` |
| **chore** | Tooling, dependencies, configs | `chore: setup Next.js + Supabase project` |
| **docs** | Documentation only | `docs: add API usage guide` |
| **style** | Code style or formatting | `style: format using Prettier rules` |
| **refactor** | Code refactor without behavior change | `refactor(db): simplify query structure` |
| **perf** | Performance improvement | `perf(video): reduce thumbnail load time` |
| **test** | Add or fix tests | `test: add auth integration tests` |
| **ci** | Continuous integration / deployment config | `ci: setup GitHub Actions pipeline` |
| **build** | Build system or dependencies | `build: update pnpm lockfile` |
| **revert** | Undo previous commits | `revert: feat(ai): remove TensorFlow module` |

---

## ✍️ Commit Best Practices

✅ Keep messages **short and clear** (≤ 72 chars)  
✅ Use **imperative mood** (e.g., “add”, not “added”)  
✅ Each commit should be **atomic** — one purpose only  
✅ Include `scope` when possible for clarity  
✅ Reference issues or PRs if relevant (e.g., `fix: resolve #42`)

---

## 🚀 Example Commit Flow

| Step | Example commit message |
|------|-------------------------|
| Initialize repo | `chore: initialize KIWAME fullstack base (Next.js, Supabase, AI, Docker)` |
| Add auth | `feat(auth): implement Supabase user login/signup` |
| Add video module | `feat(video): support upload and playback` |
| Fix bug | `fix(video): resolve playback issue on Safari` |
| Update docs | `docs: add environment setup instructions` |
| Deploy setup | `ci: add Render deploy pipeline` |

---


## 🧱 Commit Size & File Guidelines

### 🎯 1. One Commit = One Purpose
Each commit should represent a **single logical change**:
- ✅ Good: `feat(video): add video upload form`
- ❌ Bad: `feat: add upload form and fix login`

---

### 📁 2. Recommended File Change Limits

| Commit Type | Typical File Count | Notes |
|--------------|--------------------|-------|
| **fix** | 1–5 files | Small bug fixes only |
| **feat/refactor** | 5–15 files | Moderate new feature or update, Internal improvements or restructuring |
| **chore/docs/style** | 1–5 files | Configs, documentation, or formatting |

> ⚠️ Try to keep commits focused — typically **10–15 files is healthy**.  
> If a commit touches more than **20 files**, consider splitting it into smaller, meaningful commits.

## 🧠 References

- [Conventional Commits Spec](https://www.conventionalcommits.org/)
- [Commitlint Guide](https://commitlint.js.org/)
- [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)
