# Cloudflare Deployment Guide

## Architecture
```
Cloudflare Pages (Angular SPA)
       |
       | (API calls to backend)
       v
Railway / Render / Fly.io (Express Backend)
       |
       | (Mongoose)
       v
MongoDB Atlas (Database)
```

---

## Step 1: MongoDB Atlas

1. اذهب إلى https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user (username + password)
4. Add IP whitelist: `0.0.0.0/0` (allow all)
5. Copy connection string: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/TourMate`

---

## Step 2: Backend (Render)

1. اذهب إلى https://render.com
2. New + Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `TourMate-backend_node.js (2)/TourMate-backend_node.js`
   - **Build Command**: `npm install`
   - **Start Command**: `npx tsx src/index.ts`
5. Add Environment Variables (from `.env`):
   - `PORT` = `10000`
   - `DB_URL_LOCAL` = `mongodb+srv://...` (Atlas URL)
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, etc.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `USER_EMAIL`, `USER_PASSWORD`
   - `ENCRYPTION_SECRET_KEY`, `IV_LENGTH`, `SALT_ROUNDS`
6. Deploy
7. Copy the URL (e.g., `https://tourmate-backend.onrender.com`)

---

## Step 3: Frontend (Cloudflare Pages)

1. Build Angular locally:
   ```bash
   cd tourmate_frontend/tourmate-frontend
   npm install
   npm run build -- --configuration production
   ```

2. Create `_redirects` file inside `dist/tourmate-frontend/`:
   ```
   /* /index.html 200
   ```
   ده ضروري عشان SPA routing يشتغل على Cloudflare Pages.

3. Go to https://dash.cloudflare.com
4. Pages + Create a project
5. Connect your GitHub repo OR upload the `dist/tourmate-frontend/` folder manually
6. Settings → Environment Variables:
   - `API_URL` = backend URL (from Render step)
7. Deploy

---

## Step 4: Connect Frontend to Backend

في ملف `src/environments/environment.prod.ts` (في Angular):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tourmate-backend.onrender.com'  // URL بتاع Render
};
```

وبعد كدا اعمل `ng build --configuration production` تاني وارفعه.

---

## ملاحظات مهمة

- **Socket.IO مش هيشتغل**: Vercel/Render/Cloudflare Workers مش بيدعموا WebSocket persistent connections. الشات والـ real-time notifications هتشتغل بالـ HTTP polling بدل كدا.
- **Uploads**: Cloudinary شغال عادي من أي host.
- **Cold starts**: Render و Workers بياخدوا 2-5 ثواني في أول request بعد فترة inactivity.
- **Cost**: Cloudsflare Pages (مجاني) + Render free tier + MongoDB Atlas free tier = $0
