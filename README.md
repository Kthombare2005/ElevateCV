# ElevateCV

A modern CV builder application built with Next.js, Clerk Authentication, and Google's Gemini AI.

## Environment Setup

Before running the application, you need to set up your environment variables. Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

You can obtain these keys from:
- Clerk Dashboard: https://dashboard.clerk.dev
- Google AI Studio: https://makersuite.google.com/app/apikey

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Security Notes

- Never commit your `.env` file to version control
- Always use environment variables for sensitive information
- Keep your API keys private and secure
- Regularly rotate your API keys if possible

## Features

- Modern authentication with Clerk
- AI-powered CV generation with Gemini AI
- Beautiful UI with Tailwind CSS
- Responsive design
- Dark mode support