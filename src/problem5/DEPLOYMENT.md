# 🚀 Vercel Deployment Guide

This guide will help you deploy your ExpressJS TypeScript CRUD API to Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Your code pushed to GitHub

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub with the following files:
- `vercel.json` ✅
- `package.json` (with vercel-build script) ✅
- `.vercelignore` ✅
- `.env.development` ✅ (for local development)

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - Framework Preset: `Other`
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the following:
     ```
     NODE_ENV=production
     DB_PATH=/tmp/database.sqlite
     CORS_ORIGIN=*
     LOG_LEVEL=info
     DB_LOGGING=false
     ```

6. **Click "Deploy"**

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? `N`
   - Project name: `your-api-name`
   - Directory: `./`
   - Override settings? `N`

## 🔧 Configuration

### Environment Variables

Set these in your Vercel project settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `DB_PATH` | `/tmp/database.sqlite` | Database file path |
| `CORS_ORIGIN` | `*` | CORS allowed origins |
| `LOG_LEVEL` | `info` | Logging level |
| `DB_LOGGING` | `false` | Database logging |

### Important Notes

1. **Database**: SQLite files are stored in `/tmp` directory (ephemeral)
2. **CORS**: Set to `*` for public API access
3. **Logging**: Reduced logging for production
4. **Port**: Vercel handles port automatically

## 📱 Testing Your Deployed API

Once deployed, you'll get a URL like: `https://your-project-name.vercel.app`

### Test Endpoints:

1. **Health Check:**
   ```bash
   curl https://your-project-name.vercel.app/health
   ```

2. **API Documentation:**
   ```
   https://your-project-name.vercel.app/api-docs
   ```

3. **Create User:**
   ```bash
   curl -X POST https://your-project-name.vercel.app/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","age":30}'
   ```

4. **Get Users:**
   ```bash
   curl https://your-project-name.vercel.app/api/users
   ```

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to your main branch:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Vercel will automatically:**
   - Build your project
   - Deploy to production
   - Update your live URL

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check `package.json` scripts
   - Ensure TypeScript compiles without errors
   - Check Vercel build logs

2. **Database Issues:**
   - SQLite files are ephemeral on Vercel
   - Consider using Vercel Postgres for persistent data

3. **CORS Issues:**
   - Update `CORS_ORIGIN` environment variable
   - Check your frontend domain

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names and values

### Useful Commands:

```bash
# Check build locally
npm run build

# Test production build locally
npm start

# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs
```

## 📊 Monitoring

Vercel provides built-in monitoring:

1. **Function Logs**: View in Vercel Dashboard
2. **Performance**: Monitor response times
3. **Errors**: Track and debug issues
4. **Analytics**: Usage statistics

## 🎯 Next Steps

1. **Add Custom Domain** (optional)
2. **Set up Monitoring** (optional)
3. **Add Rate Limiting** (recommended)
4. **Implement Caching** (for better performance)
5. **Add Tests** (for reliability)

## 📝 Notes

- **Free Tier**: 100GB bandwidth, 1000 serverless function invocations
- **Cold Starts**: First request may be slower
- **Database**: Consider upgrading to Vercel Postgres for production
- **Security**: Add authentication for production use

---

**Your API will be live at:** `https://your-project-name.vercel.app`

**API Documentation:** `https://your-project-name.vercel.app/api-docs`
