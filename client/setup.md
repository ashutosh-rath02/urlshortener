# Setup Guide

## Environment Configuration

Create a `.env.local` file in the client directory with the following content:

```env
BACKEND_URL=http://localhost:3000
```

## Quick Setup Commands

```bash
# Create environment file
echo "BACKEND_URL=http://localhost:3000" > .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

## Backend Requirements

Make sure your backend server is running on port 3000 before starting the frontend.

The backend should be accessible at: `http://localhost:3000`
