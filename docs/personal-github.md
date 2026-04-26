# Use your personal GitHub account

You can create and own this repository under **your** GitHub user (e.g. `https://github.com/<your-username>/orangehrm-playwright`).

## 1. Create a new public repository

1. Sign in to [GitHub](https://github.com) with your personal account.
2. **New repository** → name it (e.g. `orangehrm-playwright`) → **Public** → do **not** add a README (you already have one locally) → **Create repository**.

## 2. Connect your local project (first push)

In your project folder, if Git is not initialized yet:

```bash
git init
git add .
git commit -m "Initial commit: OrangeHRM Playwright E2E"
```

Add the **remote** using the URL GitHub shows (HTTPS or SSH):

```bash
# HTTPS example
git remote add origin https://github.com/<your-username>/orangehrm-playwright.git

# or SSH
git remote add origin git@github.com:<your-username>/orangehrm-playwright.git
```

Push the default branch (rename if your Git uses `main`):

```bash
git branch -M main
git push -u origin main
```

## 3. Auth tips

- **HTTPS:** GitHub may prompt for a [Personal Access Token (classic)](https://github.com/settings/tokens) instead of a password.
- **SSH:** Add an [SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) to your GitHub account, then use the `git@github.com:...` remote.

## 4. What gets pushed

- Source, tests, `README.md`, `docs/`, workflow under `.github/`.
- `node_modules/`, `playwright-report/`, and `test-results/` are listed in `.gitignore` and should not be committed.

## 5. Course submission

Paste your **public** repo link in the assignment (e.g. `https://github.com/<your-username>/orangehrm-playwright`).
