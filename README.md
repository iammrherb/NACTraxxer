# Portnox Deployment Tracker

A comprehensive enterprise platform for managing NAC (Network Access Control) deployments with intelligent automation, real-time analytics, and multi-tenant architecture.

## Features

- **Project Management**: Complete lifecycle management from planning to deployment
- **Site Management**: Comprehensive site tracking with progress monitoring
- **Analytics Dashboard**: Real-time insights and performance metrics
- **Multi-tenant Architecture**: Organization-level isolation and customization
- **Authentication System**: Secure JWT-based authentication
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **JWT** for secure authentication
- **CORS** and security middleware

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portnox-deployment-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials and other configuration:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts/` directory to set up your database schema
   - Enable Row Level Security (RLS) on your tables

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This will start both the frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

### Demo Login
- **Email**: demo@portnox.com
- **Password**: demo123

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── stores/            # State management
│   ├── lib/               # Utilities and helpers
│   └── main.tsx           # App entry point
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   └── index.ts           # Server entry point
├── scripts/               # Database setup scripts
└── docs/                  # Documentation
```

## Available Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run dev:client` - Start only the frontend development server
- `npm run dev:server` - Start only the backend development server
- `npm run build` - Build the frontend for production
- `npm run build:server` - Build the backend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set up environment variables in your hosting provider's dashboard

### Backend Deployment (Railway/Heroku/DigitalOcean)
1. Build the backend: `npm run build:server`
2. Deploy to your preferred hosting provider
3. Set up environment variables
4. Ensure your database is accessible from the hosting environment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@portnox.com or create an issue in the repository.