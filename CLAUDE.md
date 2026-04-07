# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm start` - Start the production server (port 3001 by default)
- `npm run dev` - Start development server with nodemon auto-restart
- `node server.js` - Direct server execution

The server will be available at `http://localhost:3001` (or the PORT environment variable).

## Project Architecture

This is an AI chatbot demo with a Node.js/Express backend and static HTML/CSS/JS frontend.

**Backend (`server.js`)**:
- Express server serving static files from `public/`
- Two API endpoints:
  - `POST /api/chat` - Chat interface with simulated and real API modes
  - `GET /api/health` - Health check endpoint
- Simulated responses by default; real DeepSeek API integration requires API key configuration

**Frontend (`public/`)**:
- `index.html` - Main chat interface with theme toggle
- `style.css` - Responsive styling with dark/light themes
- `script.js` - Chat logic, API calls, local storage

**Key Dependencies**:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `nodemon` (dev) - Development auto-restart

## API Details

### Chat Endpoint
`POST /api/chat`
```json
{
  "message": "user message",
  "useRealAPI": false
}
```
Returns AI response with timestamp and model info.

### Health Check
`GET /api/health`
Returns server status and timestamp.

## Configuration

- **Port**: Set via `PORT` environment variable (default: 3001 in code, 3000 in README)
- **API Mode**: Toggle between simulated responses and real DeepSeek API via frontend switch
- **API Key**: For real API mode, configure DeepSeek API key in `server.js` line 32

## Development Notes

- No build step required - static files served directly
- Frontend communicates with backend via fetch API
- Chat history persists in browser's local storage
- The project was converted from a React app to a simple Node.js backend with static frontend