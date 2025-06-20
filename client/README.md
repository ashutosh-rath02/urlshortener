# URL Shortener - Next.js Client

A modern, responsive web application for shortening URLs built with Next.js, TypeScript, and Tailwind CSS. This frontend integrates with a Node.js backend API that implements Clean Architecture principles.

## Features

- 🚀 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile First**: Optimized for all device sizes
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🔗 **URL Shortening**: Create short, memorable links
- 📊 **Analytics**: Track clicks and engagement
- 📋 **Copy to Clipboard**: One-click copying of shortened URLs
- 🎨 **Beautiful Design**: Modern gradient backgrounds and smooth animations
- 🗄️ **Database Integration**: Uses backend API with database persistence

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **State Management**: React Hooks
- **Backend Integration**: RESTful API calls to Node.js backend

## Prerequisites

- Node.js 18+
- npm or yarn
- **Backend Server**: The Node.js backend must be running (see backend setup)

## Getting Started

### 1. Backend Setup

First, ensure your backend server is running:

```bash
# In the root directory (not client)
npm run dev
```

The backend should be running on `http://localhost:3000`

### 2. Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   # Create .env.local file
   echo "BACKEND_URL=http://localhost:3000" > .env.local
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxies to backend)
│   │   ├── shorten/       # URL shortening endpoint
│   │   └── redirect/      # URL redirect endpoint
│   ├── s/                 # Short URL redirects
│   │   └── [shortCode]/   # Dynamic redirect pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
└── components/            # React components
    ├── Header.tsx         # Navigation header
    ├── UrlShortenerForm.tsx # URL shortening form
    └── UrlList.tsx        # List of shortened URLs
```

## Backend Integration

The frontend now integrates with your Clean Architecture backend:

### API Endpoints Used

- `POST /api/urls` - Create short URL
- `GET /api/urls/:shortCode` - Redirect to original URL
- `GET /api/urls/:shortCode/info` - Get URL information

### Data Flow

1. **User enters URL** → Frontend validates and sends to backend
2. **Backend processes** → Creates short code and stores in database
3. **Frontend displays** → Shows shortened URL to user
4. **User clicks short URL** → Frontend calls backend for redirect
5. **Backend redirects** → Returns original URL for browser redirect

### Environment Variables

Create a `.env.local` file in the client directory:

```env
BACKEND_URL=http://localhost:3000
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Requirements

The backend must be running and accessible at the URL specified in `BACKEND_URL`. The backend should implement:

- Clean Architecture structure
- Database persistence (Prisma/PostgreSQL)
- URL shortening logic
- Redirect functionality
- Error handling

## Deployment

### Frontend Deployment

The app can be deployed to Vercel, Netlify, or any other platform that supports Next.js.

### Backend Deployment

Ensure the backend is deployed and update the `BACKEND_URL` environment variable accordingly.

### Environment Configuration

For production, update the environment variables:

```env
BACKEND_URL=https://your-backend-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
