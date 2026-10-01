# Project state
Last updated: 2026-09-23

## Works
- Next.js site (App Router, TypeScript, plain CSS) is deployed on Vercel at https://ai-workshop-kappa-ruddy.vercel.app/
- A Supabase project exists and is linked to the repo lb9382/AI-Workshop.

## Broken or flaky
- Nothing known. The code and logs have not been reviewed yet, so this means unchecked, not confirmed clean.

## Environment notes
- The site does not use Supabase yet: no login, no database tables.
- Unknown: whether the Supabase URL and key are already set as environment variables in Vercel and in a local .env.local file. Check before starting Slice 1.
- Claude Code runs in the browser at claude.ai/code with the repo already selected.
- All data in the app is fake: fake names, fake emails, fake tasks.

## Next session
- Decide: turn off email confirmation in Supabase login settings. Recommended yes. Fake emails cannot receive a confirmation link, so Slice 1 cannot pass without this.
- Start Slice 1: sign up and log in.
