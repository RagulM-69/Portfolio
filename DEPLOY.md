# 🚀 Deployment Guide — Ragul M Portfolio

## Prerequisites
- Git installed on your PC
- GitHub account → [github.com](https://github.com)
- Vercel account → [vercel.com](https://vercel.com) (sign up with GitHub)

---

## Part 1 — Push to GitHub

Open a **new terminal** (not the one running `npm run dev`) and run these commands:

```bash
cd "C:\Users\Ragul\OneDrive\Desktop\Projects\Portfolio Sample"

git init
git add .
git commit -m "Initial commit — Portfolio"
```

Then on GitHub:
1. Go to **github.com** → click **"New"** (top left)
2. Repository name: `portfolio`
3. Set to **Public** → click **"Create repository"**
4. Copy and run the commands GitHub shows under **"…or push an existing repository"**:

```bash
git remote add origin https://github.com/RagulM-69/portfolio.git
git branch -M main
git push -u origin main
```

---

## Part 2 — Deploy on Vercel

1. Go to **vercel.com** → Log in with GitHub
2. Click **"Add New Project"** → Import your `portfolio` repo
3. Vercel auto-detects Vite — **do not change** the build settings
4. Scroll down to **"Environment Variables"** and add these 5 variables:

| Variable Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://wdmbptpkauggazmfwdia.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(copy from your .env.local)* |
| `VITE_EMAILJS_SERVICE_ID` | `service_cthms0n` |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_lgj8i2s` |
| `VITE_EMAILJS_PUBLIC_KEY` | `9AWcSlykXq1335A4M` |

5. Click **"Deploy"** → your site goes live in ~60 seconds ✅

Your live URL will be: `https://portfolio-xxxx.vercel.app`

---

## Future Updates

Whenever you make changes to the code:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel will **automatically redeploy** on every push. No manual steps needed.

---

## Adding a Custom Domain (Optional)

1. Vercel Dashboard → your project → **"Settings"** → **"Domains"**
2. Add your domain → follow the DNS setup instructions

---

## Important Notes

- ✅ `.env.local` is in `.gitignore` — your secret keys are **never uploaded to GitHub**
- ✅ All 5 environment variables must be added in Vercel or the contact form won't work
- ✅ EmailJS free tier = 200 emails/month (enough for a portfolio)
