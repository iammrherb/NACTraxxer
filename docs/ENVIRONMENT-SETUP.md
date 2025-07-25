# Environment Variables Setup Guide

## 🚀 Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Supabase credentials** (see detailed steps below)

3. **Generate a JWT secret** (see options below)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📋 Required Variables

### 1. **Supabase Database Setup**

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New Project"
3. Choose your organization and create a new project
4. Wait for the project to be ready (2-3 minutes)

#### Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 3: Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Run the database setup scripts from the `scripts/` folder:
   - `scripts/init-database.sql`
   - `scripts/seed-sample-data.sql`

### 2. **JWT Secret Generation**

Choose one of these methods to generate a secure JWT secret:

#### Option A: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Option B: Using OpenSSL
```bash
openssl rand -hex 64
```

#### Option C: Online Generator
Visit [generate-secret.vercel.app](https://generate-secret.vercel.app/64) for a 64-character secret

```env
JWT_SECRET=your_generated_64_character_secret_here
```

---

## 🌍 Environment-Specific Setup

### **Development (.env)**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **Production**
For production deployment, you'll need to update:

```env
NODE_ENV=production
VITE_API_URL=https://your-backend-domain.com
PORT=3001  # or whatever your hosting provider uses
```

---

## 🚀 Deployment Platform Setup

### **Frontend Deployment (Netlify/Vercel)**

#### Netlify:
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in **Site settings** → **Environment variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

#### Vercel:
1. Import your GitHub repository
2. Framework preset: **Vite**
3. Add environment variables in **Settings** → **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### **Backend Deployment (Railway/Heroku)**

#### Railway:
1. Connect your GitHub repository
2. Add environment variables in **Variables** tab:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

#### Heroku:
1. Create new app: `heroku create your-app-name`
2. Set environment variables:
   ```bash
   heroku config:set SUPABASE_URL=https://your-project.supabase.co
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **"Cannot connect to database"**
- ✅ Check your `SUPABASE_URL` is correct
- ✅ Verify your `SUPABASE_SERVICE_ROLE_KEY` has proper permissions
- ✅ Ensure your database schema is set up

#### 2. **"JWT malformed" errors**
- ✅ Make sure `JWT_SECRET` is at least 32 characters long
- ✅ Don't include quotes around the secret in your .env file

#### 3. **"API calls failing"**
- ✅ Check `VITE_API_URL` points to your backend
- ✅ Ensure CORS is properly configured
- ✅ Verify your backend is running and accessible

#### 4. **"Authentication not working"**
- ✅ Verify `SUPABASE_ANON_KEY` is correct
- ✅ Check Row Level Security (RLS) policies in Supabase
- ✅ Ensure user exists in the database

### Testing Your Setup:

1. **Test database connection:**
   ```bash
   npm run dev
   # Check server logs for "✅ Database connection successful"
   ```

2. **Test authentication:**
   - Go to http://localhost:5173/login
   - Use demo credentials: demo@portnox.com / demo123

3. **Test API endpoints:**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"healthy"}
   ```

---

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Check server logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure your Supabase project is active and accessible

---

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- **Use different JWT secrets** for development and production
- **Rotate your secrets regularly** in production
- **Use environment-specific Supabase projects** for development and production