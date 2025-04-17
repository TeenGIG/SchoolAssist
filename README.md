# SchoolAssist AI Chatbot

SchoolAssist is an AI-powered educational chatbot that helps students with their studies, homework, and academic questions. It uses Anthropic's Claude AI model to provide intelligent, conversational responses in a beautiful, user-friendly interface.

## Features

- Clean, sleek dark-themed user interface
- Responsive design that works on mobile, tablet, and desktop devices
- Animated responses with typing effects and message transitions
- Step-by-step explanations for complex questions
- Proper formatting for mathematical problems, code snippets, and lists
- Conversation memory to maintain context between questions

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude API

## Running Locally

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Start the application with `npm run dev`
5. Open your browser to the URL displayed in the console (typically http://localhost:5173)

## Deployment Options

### Option 1: Deploy with a Server (Recommended)

The standard version of SchoolAssist requires a server to proxy requests to the Anthropic API. This is the most secure approach as it keeps your API key private.

You can deploy to platforms like:
- Replit
- Vercel
- Netlify
- Heroku
- Railway

### Option 2: GitHub Pages Deployment

For GitHub Pages deployment (which only supports static sites), you'll need to use the client-side only version:

1. Copy these files to use the GitHub Pages version:
   - Replace `client/src/App.tsx` with `client/src/App.github.tsx`
   - Replace `client/src/main.tsx` with `client/src/main.github.tsx`
   - Keep `client/src/pages/Home.github.tsx` and `client/src/lib/anthropicClient.ts`

2. Create a `.env` file with your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Copy the contents of the `dist/public` directory to your GitHub Pages repository

5. **IMPORTANT SECURITY NOTE**: This approach exposes your API key in the client-side code. It is provided for demonstration purposes only and not recommended for production use.

## Customization

- Modify styling in `client/src/index.css`
- Change theme colors in `theme.json`
- Update prompt instructions in `server/routes.ts` (server version) or `client/src/lib/anthropicClient.ts` (GitHub Pages version)

## License

MIT License