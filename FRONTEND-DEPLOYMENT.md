# Frontend Deployment Guide

## 🚀 Deploying to Vercel (Recommended)

Vercel is the best option for your Vite/React app with the easiest setup.

### Prerequisites
- GitHub account
- Code pushed to GitHub repository
- Domain: biplaba.me

### Step 1: Prepare Your Repository

1. **Commit and push your code** (if not already done):
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign up/login with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository** (PrepEasy)

4. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `http://13.235.133.89:5001/api`

6. **Click "Deploy"**

   Vercel will automatically build and deploy your app!

### Step 3: Add Custom Domain

1. **In Vercel Dashboard**, go to your project settings

2. **Click "Domains"** tab

3. **Add domain:** `prepeasy.biplaba.me` (or your preferred subdomain)

4. **Vercel will provide DNS records.** You'll see something like:
   ```
   Type: CNAME
   Name: prepeasy
   Value: cname.vercel-dns.com
   ```

5. **Add the CNAME record to your domain:**
   - Go to your domain registrar (where you manage biplaba.me)
   - Add a CNAME record:
     - Host/Name: `prepeasy`
     - Points to: `cname.vercel-dns.com` (or the value Vercel provides)
     - TTL: 3600 (or default)

6. **Wait for DNS propagation** (usually 5-30 minutes)

7. **Vercel automatically provisions SSL certificate** ✅

Your app will be live at: **https://prepeasy.biplaba.me**

---

## 🔷 Alternative: Deploying to Netlify

### Step 1: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign up/login

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub** and select your repository

4. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

5. **Add Environment Variable:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `http://13.235.133.89:5001/api`

6. **Click "Deploy site"**

### Step 2: Add Custom Domain on Netlify

1. In site settings, go to **Domain management**

2. **Click "Add custom domain"**

3. Enter: `prepeasy.biplaba.me`

4. **Add CNAME record** to your domain:
   ```
   Type: CNAME
   Name: prepeasy
   Value: your-site-name.netlify.app
   ```

5. **SSL will be auto-provisioned**

---

## 🟠 Alternative: Cloudflare Pages

Perfect if your domain is already on Cloudflare!

### Step 1: Deploy to Cloudflare Pages

1. **Go to [Cloudflare Dashboard](https://dash.cloudflare.com)**

2. **Pages → Create a project**

3. **Connect to GitHub** and select repository

4. **Configure build:**
   - **Framework preset:** Vite
   - **Build command:** `cd frontend && npm run build`
   - **Build output directory:** `frontend/dist`
   - **Root directory:** `/`

5. **Environment variables:**
   - Production: `VITE_API_URL` = `http://13.235.133.89:5001/api`

6. **Click "Save and Deploy"**

### Step 2: Custom Domain (Easy if domain on Cloudflare)

1. In your Pages project, go to **Custom domains**

2. **Click "Set up a custom domain"**

3. Enter: `prepeasy.biplaba.me`

4. **If biplaba.me is on Cloudflare**, it will automatically add the DNS record!

5. **SSL is automatic** ✅

---

## 🎯 Quick Comparison

| Feature | Vercel | Netlify | Cloudflare Pages |
|---------|--------|---------|------------------|
| **Setup Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Custom Domain** | Very Easy | Very Easy | Easiest (if using CF DNS) |
| **Performance** | Excellent | Excellent | Excellent |
| **Bandwidth** | 100 GB/month | 100 GB/month | Unlimited |
| **Build Speed** | Fast | Fast | Very Fast |
| **Preview Deploys** | ✅ | ✅ | ✅ |
| **Analytics** | ✅ (paid) | ✅ (basic free) | ✅ (free) |

---

## 📝 Suggested Subdomain Names

- `prepeasy.biplaba.me` (recommended)
- `interview.biplaba.me`
- `prep.biplaba.me`
- `learn.biplaba.me`
- `study.biplaba.me`

---

## ⚠️ Important: Update Backend CORS

After deployment, update your backend to allow requests from your domain:

**On your EC2 instance**, update the CORS configuration:

```typescript
// backend/src/app.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://prepeasy.biplaba.me',  // Add your domain
    'https://www.prepeasy.biplaba.me'  // If using www
  ],
  credentials: true
}));
```

Then rebuild and restart your backend:
```bash
ssh -i "myaws.pem" ec2-user@ec2-3-109-123-31.ap-south-1.compute.amazonaws.com
cd PrepEasy/backend
# Update the cors configuration
docker-compose down
docker-compose up -d --build
```

---

## 🔄 Automatic Deployments

All three platforms support automatic deployments:
- Push to `main` branch → Automatic production deployment
- Push to other branches → Preview deployments
- Pull requests → Preview deployments

---

## ✅ Post-Deployment Checklist

After deployment:

1. **Test your app** at your custom domain
2. **Check browser console** for any errors
3. **Test all features:**
   - Categories loading
   - Technologies loading
   - Questions filtering
   - Search functionality
   - Question detail pages
4. **Verify API calls** are going to production backend
5. **Test on mobile devices**
6. **Check SSL certificate** is working (https)
7. **Update backend CORS** to allow your domain

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in deployment platform
- Verify `package.json` has correct build script
- Test local build: `npm run build`

### Blank Page After Deployment
- Check routing configuration (vercel.json / netlify.toml)
- Verify environment variable is set correctly
- Check browser console for errors

### API Not Working
- Verify `VITE_API_URL` environment variable
- Check CORS is configured on backend
- Test backend API directly: `curl http://13.235.133.89:5001/health`

### Custom Domain Not Working
- Wait for DNS propagation (can take up to 48 hours, usually 5-30 min)
- Verify CNAME record is correct
- Check DNS with: `nslookup prepeasy.biplaba.me`

---

## 🚀 Ready to Deploy?

**I recommend starting with Vercel:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set `VITE_API_URL` environment variable
5. Deploy!

Let me know which platform you'd like to use, and I can help with any specific setup questions!
