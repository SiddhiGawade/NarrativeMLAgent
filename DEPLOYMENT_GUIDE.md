# Deployment Guide for Echelon 2.0

## Quick Start

### 1. Backend Deployment (Render)

1. **Push your code to GitHub** (if not already done)

2. **Go to [Render.com](https://render.com)** and sign up/login

3. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Echelon2.0` repository

4. **Configure the service**:
   - **Name**: `echelon-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables** (if needed):
   - `GOOGLE_API_KEY` (if using Gemini API)
   - Other API keys as needed

6. **Deploy** and wait for it to complete

7. **Copy your backend URL** (e.g., `https://echelon-backend.onrender.com`)

---

### 2. Frontend Deployment (Vercel)

1. **Create `.env` file** in `frontend/` directory:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_BASE_URL=https://echelon-backend.onrender.com
   ```

2. **Go to [Vercel.com](https://vercel.com)** and sign up/login

3. **Import your project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository

4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Add Environment Variables**:
   - Copy all variables from your `.env` file
   - Add them in the Vercel dashboard under "Environment Variables"

6. **Deploy** and wait for completion

7. **Copy your frontend URL** (e.g., `https://echelon.vercel.app`)

---

### 3. Final Configuration

1. **Update Backend CORS**:
   - Go to Render dashboard → Your service → Environment
   - Add/Update: `CORS_ORIGINS=https://your-frontend.vercel.app`
   - Redeploy the backend

2. **Test Your Application**:
   - Visit your Vercel URL
   - Try logging in
   - Check if metrics load correctly

---

## Testing Production Build Locally

Before deploying, test the production build:

```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload
```

---

## Troubleshooting

### Backend Issues
- **500 Error**: Check Render logs for Python errors
- **CORS Error**: Verify `CORS_ORIGINS` environment variable
- **Timeout**: Free tier spins down after 15 min (first request takes ~30s)

### Frontend Issues
- **API Not Loading**: Check `VITE_API_BASE_URL` in Vercel environment variables
- **Firebase Error**: Verify all Firebase config variables are set
- **Build Failed**: Check build logs in Vercel dashboard

---

## Cost Summary

- **Render Free Tier**: $0/month (spins down after inactivity)
- **Vercel Free Tier**: $0/month (100GB bandwidth)
- **Firebase Free Tier**: $0/month (generous limits)

**Total**: $0/month for MVP/testing

---

## Next Steps After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure Firebase security rules
- [ ] Set up monitoring/analytics
- [ ] Consider upgrading to paid tiers for production
