# Deploying SchoolAssist to GitHub Pages

This document contains instructions for deploying the SchoolAssist app to GitHub Pages.

## Prerequisites

1. The SchoolAssist application relies on the Anthropic API, which requires an API key.
2. You need a GitHub account and a repository to deploy to GitHub Pages.

## Step 1: Create a GitHub Repository

1. Go to GitHub and create a new repository named `schoolassist`
2. Initialize it with a README file

## Step 2: Prepare Your Application Files

The application needs to be modified to work without a backend server since GitHub Pages only supports static websites. Here's how to prepare your files:

1. Download all the files from Replit
2. Make the following modifications:

## Step 3: Create a Client-Side Only Version

Since GitHub Pages doesn't support server-side code, we'll need to adapt the app to handle API calls from the browser. This requires using environment variables and a client-side API implementation.

1. Create a `.env` file in the root of your project with:
   ```
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

2. Update the client code to use the API key directly:
   - Modify `client/src/pages/Home.tsx` to handle API calls directly without a backend
   - Create a new utility file for direct API calls

3. Note that for security reasons, you should NOT expose your API key in a public website. The better approach would be:
   - Use a serverless function with Netlify, Vercel, or similar
   - Create a proxy service that securely stores your API key

## Step 4: Build and Deploy

1. Run the build command:
   ```
   npm run build
   ```

2. Copy the contents of the `dist/public` directory to your GitHub repository

3. Enable GitHub Pages in your repository settings, setting the source to the main branch and the folder to `/docs`

4. Your app will be available at `https://yourusername.github.io/schoolassist/`

## Important Security Notes

Remember that including API keys in client-side code is NOT secure for production websites. Anyone viewing your site can see your API key in the network requests or source code.

For a production deployment, consider using:
1. A serverless function or backend service to handle API calls
2. Environment variables in a secure hosting service
3. A proxy service that keeps your API keys secure