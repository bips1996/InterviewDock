# 🚀 Quick Deploy Guide - Choose Your Platform

Your frontend is ready to deploy! Choose one of these platforms:

---

## ⭐ OPTION 1: Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ Perfect for React/Vite
- ✅ 3-click deployment
- ✅ Automatic SSL
- ✅ Easy custom domain setup

### Deploy in 5 Minutes:

1. **Go to [vercel.com](https://vercel.com)** and login with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repo** (PrepEasy)

4. **Configure:**
   ```
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

5. **Add Environment Variable:**
   ```
   Name: VITE_API_URL
   Value: http://13.235.133.89:5001/api
   ```

6. **Click Deploy** 🚀

7. **Add your domain:**
   - Go to project settings → Domains
   - Add: `prepeasy.biplaba.me`
   - Copy the CNAME record Vercel provides
   - Add CNAME to your domain DNS:
     ```
     Type: CNAME
     Name: prepeasy
     Value: cname.vercel-dns.com (or what Vercel shows)
     ```

**Done!** Your site will be live at `https://prepeasy.biplaba.me`

---

## 🔷 OPTION 2: Netlify

### Deploy Steps:

1. **Go to [netlify.com](https://netlify.com)** and login

2. **"Add new site" → "Import from Git"**

3. **Configure:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Environment variable:**
   - Settings → Environment variables
   - Add: `VITE_API_URL` = `http://13.235.133.89:5001/api`

5. **Add custom domain:**
   - Domain settings → Add custom domain
   - Enter: `prepeasy.biplaba.me`
   - Add CNAME to your DNS pointing to netlify

---

## 🟠 OPTION 3: Cloudflare Pages

### Best if your domain is already on Cloudflare!

1. **Go to [dash.cloudflare.com](https://dash.cloudflare.com)**

2. **Pages → Create project**

3. **Configure:**
   ```
   Framework: Vite
   Build command: cd frontend && npm run build
   Output directory: frontend/dist
   ```

4. **Environment variable:**
   ```
   VITE_API_URL = http://13.235.133.89:5001/api
   ```

5. **Custom domain:**
   - If biplaba.me is on Cloudflare, DNS is automatic!
   - Just add: `prepeasy.biplaba.me`

---

## 📋 After Deployment - IMPORTANT!

### Update Backend CORS

You MUST update your backend to allow requests from your domain:

```bash
# SSH to your EC2
ssh -i "myaws.pem" ec2-user@ec2-3-109-123-31.ap-south-1.compute.amazonaws.com

# Edit the backend app.ts
nano PrepEasy/backend/src/app.ts
```

Update the CORS configuration:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://prepeasy.biplaba.me',  // Your domain
  ],
  credentials: true
}));
```

Rebuild and restart:
```bash
cd PrepEasy/backend
docker-compose down
docker-compose up -d --build
```

---

## ✅ Verification Checklist

After deployment, test:
- [ ] Site loads at your custom domain
- [ ] SSL (https) is working
- [ ] Categories page loads
- [ ] Technologies page loads
- [ ] Questions page shows data
- [ ] Search works
- [ ] Filters work
- [ ] Question detail pages open
- [ ] No CORS errors in browser console
- [ ] Mobile responsive

---

## 🎯 Suggested Subdomain Names

- `prepeasy.biplaba.me` ⭐
- `interview.biplaba.me`
- `prep.biplaba.me`
- `learn.biplaba.me`

---

## 📁 Files Created for You

✅ `frontend/.env.production` - Production environment config
✅ `frontend/vercel.json` - Vercel configuration
✅ `frontend/netlify.toml` - Netlify configuration
✅ Build tested and working!

---

## 🆘 Need Help?

See the full guide: [FRONTEND-DEPLOYMENT.md](FRONTEND-DEPLOYMENT.md)

**Ready to deploy? Pick a platform and let's go! 🚀**

I recommend Vercel for the easiest setup.
