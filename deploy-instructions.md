# SchoolAssist GitHub Pages Deployment Guide

This guide will walk you through the steps to deploy your SchoolAssist app to GitHub Pages.

## Step 1: Download Your Files

First, download all files from your Replit project:
1. In Replit, click the three dots (...) in the Files panel
2. Select "Download as zip"
3. Extract the zip file on your local machine

## Step 2: Prepare Your GitHub Repository

1. Create a new GitHub repository named `schoolassist`
2. Initialize it with a README file

## Step 3: Set Up GitHub Pages Version

This version uses a client-side approach since GitHub Pages doesn't support server-side code:

1. Use the GitHub Pages specific files I've prepared:
   - `client/src/App.github.tsx` → rename to `client/src/App.tsx`
   - `client/src/main.github.tsx` → rename to `client/src/main.tsx`
   - Keep `client/src/lib/anthropicClient.ts` and `client/src/pages/Home.github.tsx`

2. Add your Anthropic API key:
   Create a `.env` file in the root of your project with:
   ```
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

## Step 4: Create a Simple Build Script

Create a `package.json` file in your project root:

```json
{
  "name": "schoolassist",
  "version": "1.0.0",
  "description": "SchoolAssist AI Educational Chatbot",
  "scripts": {
    "build": "vite build --outDir docs && cp docs/index.html docs/404.html"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.5.5",
    "@hookform/resolvers": "^3.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.274.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-hook-form": "^7.0.0",
    "tailwind-merge": "^1.0.0",
    "tailwindcss-animate": "^1.0.0",
    "wouter": "^2.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
```

## Step 5: Create a Simple Vite Config

Create `vite.config.js` in the root:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/schoolassist/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'docs'),
    emptyOutDir: true,
  },
});
```

## Step 6: Build and Deploy

1. Install dependencies and build:
   ```
   npm install
   npm run build
   ```

2. This will create a `docs` folder with your static site

3. Push everything to your GitHub repository:
   ```
   git add .
   git commit -m "Initial SchoolAssist deployment"
   git push origin main
   ```

4. Enable GitHub Pages in your repository settings:
   - Go to your repository settings
   - Scroll down to "GitHub Pages" section
   - Set the source to the main branch and the folder to `/docs`

5. Your site will be available at `https://yourusername.github.io/schoolassist/`

## Important Security Note

⚠️ **CAUTION**: This approach exposes your API key in client-side code. It is **NOT SECURE** for production use.

For a more secure deployment, consider:
1. Using a serverless function (Netlify Functions, Vercel Edge Functions)
2. Setting up a small proxy server (Railway, Render, Fly.io)
3. Using environment variables in a secure hosting platform