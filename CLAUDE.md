# CLAUDE.md

## Stack
- Next.js with the App Router, TypeScript
- Plain CSS. No Tailwind, no CSS frameworks.
- Supabase for login and the database
- Deployed on Vercel from the main branch
- Repo: lb9382/AI-Workshop

## Commands
- `npm install` installs dependencies
- `npm run dev` runs the site locally
- `npm run build` checks that the site builds; run it before saying a change is done
- `npm run lint` checks code style
- If one of these scripts is missing from package.json, say so instead of guessing a replacement.

## Never
- Add a dependency without asking first.
- Edit .env, .env.local, or any environment variable.
- Change auth configuration without saying what is changing and why.
- Create new top-level folders.
- Put passwords, API keys, or connection strings in code, commits, or chat.
- Use real personal data. Fake names, fake emails, and fake content only.
- Work on any slice other than the one marked ACTIVE in roadmap.md.
- Commit or merge without first showing what changed and getting approval.

## Conventions
- Explain every change in plain language for someone with no coding background, not only in code.
- Every Supabase table has row level security turned on, so each user can only read and write their own rows.
- Keep changes small and tied to one done-criterion at a time.
- Work on a branch and open a pull request. Never push straight to main.
- When a slice's done-criteria all pass on the live site, update its status in roadmap.md and update project-state.md.

## Current focus
See roadmap.md. Work only on the slice marked ACTIVE.
