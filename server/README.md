# StudyMate AI Backend API

This backend provides AI-powered study tools built with Node.js, Express, MongoDB, and Google Gemini API.

## Base URL
Production: `https://studymate-api.onrender.com`
Local: `http://localhost:5000`

## Authentication

All endpoints under `/api/pdfs`, `/api/chat`, and `/api/study` require a Bearer token in the Authorization header.

`Authorization: Bearer <your_jwt_token>`

## Endpoints

### Health
- `GET /api/health` - Check API status

### Auth
- `POST /api/auth/register` - Register a new user
  - Body: `name`, `email`, `password`
- `POST /api/auth/login` - Login user
  - Body: `email`, `password`
- `GET /api/auth/me` - Get current user profile (Auth required)

### PDFs
- `POST /api/pdfs/upload` - Upload a new PDF
  - Form-Data: `pdf` (File)
- `GET /api/pdfs` - Get all PDFs for the authenticated user
- `GET /api/pdfs/:id` - Get details of a single PDF
- `GET /api/pdfs/:id/content` - Get extracted text content of a PDF
- `PATCH /api/pdfs/:id` - Rename a PDF
  - Body: `fileName`
- `PATCH /api/pdfs/:id/favorite` - Toggle favorite status
- `DELETE /api/pdfs/:id` - Delete a PDF and its associated data

### AI Chat
- `POST /api/chat/:pdfId` - Send a message to AI about a specific PDF
  - Body: `message`
- `GET /api/chat/:pdfId/history` - Get chat history for a PDF
- `DELETE /api/chat/:pdfId/history` - Clear chat history

### Study Tools
- `POST /api/study/:pdfId/notes` - Generate study notes (Summary, Key Points, etc.)
- `POST /api/study/:pdfId/quiz` - Generate a multiple-choice quiz
- `POST /api/study/:pdfId/flashcards` - Generate flashcards

## Error Responses

The API uses standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (in dev mode)",
  "errors": [] // Array of validation errors if applicable
}
```

## Setup for Production (Render/Railway)
Set the following environment variables:
- `PORT` (e.g. 5000)
- `NODE_ENV=production`
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (Strong secret for tokens)
- `GEMINI_API_KEY` (Google Gemini API key)
- `FRONTEND_URL` (e.g. https://studymate-ai.vercel.app)
