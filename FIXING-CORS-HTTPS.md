# 🔧 Fixing "Provisional Headers" / Mixed Content Error

## The Problem

Your Vercel deployment uses **HTTPS**, but your backend API uses **HTTP**. Browsers block HTTPS sites from calling HTTP APIs for security (mixed content policy).

**Current Setup:**
- Frontend: `https://your-app.vercel.app` ✅ (HTTPS)
- Backend: `http://13.235.133.89:5001` ❌ (HTTP)
- Browser: **BLOCKS** the connection 🚫

---

## ✅ Solutions

### **Option 1: Use Vercel Rewrites (Easiest - 5 min)**

Let Vercel proxy API requests through HTTPS. This works immediately!

**Step 1:** Update `frontend/vite.config.ts`

No changes needed in Vite config for production.

**Step 2:** Add environment variable in Vercel

Instead of using the direct IP, use a relative API path:

In Vercel Dashboard:
- Settings → Environment Variables
- **Change:** `VITE_API_URL` from `http://13.235.133.89:5001/api` to `/api`

**Step 3:** Configure Vercel to proxy `/api` to your backend

Update `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://13.235.133.89:5001/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Pros:** Works immediately, no backend changes
**Cons:** Vercel proxies all API requests (fine for moderate traffic)

---

### **Option 2: Enable HTTPS on Backend (Recommended for Production)**

Add HTTPS to your backend using nginx reverse proxy.

**Requirements:**
- Domain or subdomain for API (e.g., `api.biplaba.me`)
- Free SSL certificate (Let's Encrypt)

**Steps:**

1. **Add subdomain in DNS:**
   ```
   Type: A
   Name: api
   Value: 13.235.133.89
   ```

2. **SSH to EC2:**
   ```bash
   ssh -i "myaws.pem" ec2-user@ec2-3-109-123-31.ap-south-1.compute.amazonaws.com
   ```

3. **Install nginx and certbot:**
   ```bash
   sudo yum install -y nginx certbot python3-certbot-nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

4. **Configure nginx as reverse proxy:**
   ```bash
   sudo nano /etc/nginx/conf.d/api.conf
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.biplaba.me;

       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d api.biplaba.me
   ```

6. **Update frontend environment variable:**
   - Vercel: `VITE_API_URL` = `https://api.biplaba.me/api`

7. **Update backend CORS** to allow `https://api.biplaba.me`

**Pros:** Professional, secure, scalable
**Cons:** Requires subdomain and setup time

---

### **Option 3: Deploy Backend on Railway/Render (Free HTTPS)**

Move backend to a platform that provides HTTPS automatically.

**Railway.app (Recommended):**
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Gets HTTPS URL automatically: `https://your-app.railway.app`

**Render.com:**
1. Go to [render.com](https://render.com)
2. Create Web Service from GitHub
3. Gets HTTPS URL: `https://your-app.onrender.com`

**Pros:** Free tier, automatic HTTPS, easy deployment
**Cons:** Need to migrate database or keep it on EC2

---

## 🎯 Recommended Quick Fix

**Use Vercel Rewrites (Option 1)** - Works in 5 minutes!

Here's what to do:

1. **Update `frontend/vercel.json`** (I'll do this for you)
2. **Change environment variable in Vercel:**
   - `VITE_API_URL` = `/api` (remove the full URL)
3. **Redeploy in Vercel**
4. **Update backend CORS** (already done in local code)
5. **Deploy backend changes to EC2**

---

## 📝 Deploy Backend Changes to EC2

After updating CORS locally, deploy to EC2:

```bash
# 1. Commit changes
git add .
git commit -m "Update CORS configuration"
git push

# 2. SSH to EC2
ssh -i "myaws.pem" ec2-user@ec2-3-109-123-31.ap-south-1.compute.amazonaws.com

# 3. Pull latest changes
cd PrepEasy/backend
git pull

# 4. Rebuild and restart Docker
docker-compose down
docker-compose up -d --build

# 5. Verify it's running
docker-compose ps
curl http://localhost:5001/health
```

---

## ✅ Testing After Fix

1. **Open your deployed app** on Vercel
2. **Open Browser DevTools** (F12)
3. **Go to Network tab**
4. **Navigate to a page** that calls the API
5. **Check:**
   - Requests should show status 200 (not blocked)
   - No "provisional headers" error
   - Data loads correctly

---

## 🆘 Still Not Working?

**Check:**
1. Browser console for specific errors
2. Vercel deployment logs
3. Backend is running: `curl http://13.235.133.89:5001/health`
4. CORS headers in network response
5. Try in incognito mode (clear cache)

---

Let's implement the quick fix first - I'll update your Vercel config and guide you through the steps!
