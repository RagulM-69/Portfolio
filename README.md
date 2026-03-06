# Ragul M — Personal Portfolio

A cinematic, dark-themed personal portfolio built with **React + Vite**, featuring smooth animations, interactive project cards, and a Supabase contact form.

---

## 🚀 Getting Started (Run Locally)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✏️ Updating Your Content

All portfolio content lives in **`/src/data/`** — no need to touch any components:

| File | What to edit |
|---|---|
| `src/data/projects.js` | Add/edit projects — title, description, tech stack, link |
| `src/data/skills.js` | Add/remove skills and categories |
| `src/data/academics.js` | Update academic history |

---

## ⚙️ Supabase Setup (Contact Form)

1. Go to [supabase.com](https://supabase.com) and open your project's **SQL Editor**
2. Run this SQL to create the contact submissions table:

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

3. Your `.env.local` already contains the credentials — no changes needed.
4. To view submissions, open your Supabase dashboard → Table Editor → `contact_submissions`

---

## 📄 Adding Your Resume

Replace the placeholder by placing your resume PDF at:
```
/public/resume.pdf
```

The "Download Resume" button in the Hero section will automatically serve it.

---

## 🌐 Deploy to Vercel (One-Click)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

4. Click **Deploy** — done! 🎉

---

## 🗂 Project Structure

```
src/
  components/       # All UI sections
  data/             # Edit projects, skills, academics
  lib/supabase.js   # Supabase client
  styles/globals.css
  App.jsx / main.jsx
```

---

Built with React, Vite, Tailwind CSS, GSAP, Framer Motion, Lenis, and Supabase.
