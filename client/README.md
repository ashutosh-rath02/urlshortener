# URL Shortener - Next.js Client

A modern, responsive web application for shortening URLs built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile First**: Optimized for all device sizes
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🔗 **URL Shortening**: Create short, memorable links
- 📊 **Analytics**: Track clicks and engagement
- 📋 **Copy to Clipboard**: One-click copying of shortened URLs
- 🎨 **Beautiful Design**: Modern gradient backgrounds and smooth animations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── shorten/       # URL shortening endpoint
│   │   └── s/             # Short URL redirects
│   │   └── [shortCode]/   # Dynamic redirect pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
└── components/            # React components
    ├── Header.tsx         # Navigation header
    ├── UrlShortenerForm.tsx # URL shortening form
    └── UrlList.tsx        # List of shortened URLs
```

## Components

### Header

Navigation component with branding and menu items.

### UrlShortenerForm

Main form component for creating shortened URLs with:

- URL validation
- Loading states
- Error handling
- Success feedback

### UrlList

Displays created URLs with:

- Copy to clipboard functionality
- Click analytics
- Test links
- Responsive design

## API Integration

The client is designed to work with your Node.js backend API. Currently, it uses mock data for demonstration purposes.

### API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /s/[shortCode]` - Redirect to original URL

### Backend Integration

To connect with your backend:

1. Update the API calls in `UrlShortenerForm.tsx` to point to your backend server
2. Update the redirect logic in `s/[shortCode]/page.tsx` to fetch from your backend
3. Configure CORS on your backend to allow requests from the client

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file for environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Deployment

The app can be deployed to Vercel, Netlify, or any other platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
