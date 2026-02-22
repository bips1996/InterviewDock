# 🌐 Adding Custom Subdomain - Vercel + GoDaddy Guide

## Step 1: Add Domain in Vercel

1. **Go to Vercel Dashboard** → Your PrepEasy project

2. **Click "Settings"** tab

3. **Click "Domains"** in the left sidebar

4. **Add your subdomain:**
   - In the text box, enter: `prepeasy.biplaba.me` (or your preferred subdomain)
   - Click **"Add"**

5. **Vercel will show you DNS configuration needed:**
   
   You'll see something like:
   ```
   Type: CNAME
   Name: prepeasy
   Value: cname.vercel-dns.com
   ```
   
   **Keep this page open** - you'll need these values for GoDaddy!

---

## Step 2: Configure DNS in GoDaddy

1. **Go to [GoDaddy.com](https://godaddy.com)** and login

2. **Go to "My Products"**

3. **Find your domain** `biplaba.me` and click **"DNS"** or **"Manage DNS"**

4. **Add a new CNAME record:**
   
   Click **"Add"** button (usually at the bottom of DNS records)
   
   **Fill in the details:**
   ```
   Type: CNAME
   Name: prepeasy
   Value: cname.vercel-dns.com
   TTL: 600 seconds (or default)
   ```
   
   **Important Notes:**
   - **Name:** Just `prepeasy` (not the full domain)
   - **Value:** Exactly what Vercel showed (usually `cname.vercel-dns.com`)
   - Some GoDaddy interfaces might call "Name" as "Host"

5. **Click "Save"**

---

## Step 3: Wait for DNS Propagation

1. **In Vercel:** 
   - Go back to your project → Settings → Domains
   - You should see your domain with a status indicator
   - It might say "Pending" or show a warning initially

2. **DNS propagation takes time:**
   - Usually: 5-30 minutes
   - Sometimes: up to 48 hours (rare)
   - Average: 10-15 minutes

3. **Check propagation status:**
   ```bash
   # On your Mac terminal
   nslookup prepeasy.biplaba.me
   ```
   
   Once it shows Vercel's IP, you're good!

---

## Step 4: Verify SSL Certificate

1. **Vercel automatically provisions SSL certificate** (usually takes 1-2 minutes after DNS propagates)

2. **Check in Vercel:**
   - Settings → Domains
   - Your domain should show "Valid Configuration" with a green checkmark
   - SSL certificate status should be "Issued"

3. **Test your site:**
   - Visit: `https://prepeasy.biplaba.me`
   - Should load with SSL (🔒 padlock icon)

---

## 📋 Quick Reference

### Suggested Subdomain Names:
- `prepeasy.biplaba.me` ⭐ (Recommended)
- `interview.biplaba.me`
- `prep.biplaba.me`
- `learn.biplaba.me`

### DNS Record Details:
```
Type: CNAME
Name: prepeasy (or your chosen subdomain)
Value: cname.vercel-dns.com
TTL: 600 (or default)
```

---

## 🔍 Troubleshooting

### Domain shows "Invalid Configuration" in Vercel

**Check:**
1. DNS record is saved in GoDaddy
2. Correct CNAME value from Vercel
3. Wait longer (DNS can take time)
4. Check with: `nslookup prepeasy.biplaba.me`

### "This site can't be reached"

**Solutions:**
1. Clear browser cache
2. Try incognito/private mode
3. Wait for DNS propagation
4. Verify DNS with: `dig prepeasy.biplaba.me`

### SSL Certificate Not Issued

**Solutions:**
1. Wait 5-10 minutes after DNS propagates
2. In Vercel, try removing and re-adding the domain
3. Check CAA records in GoDaddy (usually not needed)

### Wrong CNAME Value

**Vercel might provide different values:**
- `cname.vercel-dns.com` (most common)
- `76.76.21.21` (IP address - use CNAME instead)
- Check your Vercel dashboard for exact value

---

## 🎯 Step-by-Step Visual Guide

### In Vercel:
```
Settings → Domains → Enter: prepeasy.biplaba.me → Add
↓
Copy the CNAME value shown
```

### In GoDaddy:
```
My Products → biplaba.me → DNS → Add Record
↓
Type: CNAME
Name: prepeasy
Value: cname.vercel-dns.com
↓
Save
```

### Wait & Verify:
```
Wait 10-30 minutes
↓
Check Vercel: Settings → Domains (Should show green ✓)
↓
Visit: https://prepeasy.biplaba.me
```

---

## ✅ Final Checklist

After setup:
- [ ] CNAME record added in GoDaddy
- [ ] Domain shows in Vercel dashboard
- [ ] DNS propagated (check with nslookup)
- [ ] SSL certificate issued (green checkmark in Vercel)
- [ ] Site loads at https://prepeasy.biplaba.me
- [ ] No CORS errors in browser console
- [ ] All pages working (categories, questions, etc.)

---

## 🔄 Don't Forget: Update Backend CORS!

After your domain is working, update your backend to allow requests from the new domain:

```bash
# SSH to EC2
ssh -i "myaws.pem" ec2-user@ec2-3-109-123-31.ap-south-1.compute.amazonaws.com

# Edit backend CORS configuration
cd PrepEasy/backend
nano src/app.ts
```

Update CORS:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://prepeasy.biplaba.me',  // Add your domain
  ],
  credentials: true
}));
```

Rebuild:
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🚀 You're Almost Done!

1. Add domain in Vercel ✅
2. Add CNAME in GoDaddy ✅
3. Wait for DNS ⏳
4. Update backend CORS ✅
5. Test your live site! 🎉

Let me know when the domain is added and I can help verify it's working correctly!
