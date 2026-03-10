# Documentation Quick Reference

Quick guide to finding the information you need.

## 📖 Main Documentation

| What do you want to do? | Read this document |
|--------------------------|-------------------|
| **Set up locally for development** | [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) |
| **Deploy to production** | [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md) |
| **Use the API / Add questions** | [API-DOCUMENTATION.md](API-DOCUMENTATION.md) |
| **Understand the project** | [README.md](README.md) |

## 🎯 Quick Tasks

### I want to run the app locally

**Docker (Recommended):**
```bash
cd backend
docker-compose up -d
cd ../frontend
npm install && npm run dev
```

**Learn more:** [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)

---

### I want to deploy to production

**Backend:** AWS EC2 + Docker  
**Frontend:** Vercel / Netlify

**Learn more:** [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)

---

### I want to add interview questions

Use the API to create questions:

```bash
curl -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your question title",
    "answer": "Your answer (supports Markdown)",
    "difficulty": "Easy",
    "technologyId": "tech-uuid-here",
    "tags": ["tag1", "tag2"]
  }'
```

**Learn more:** [API-DOCUMENTATION.md](API-DOCUMENTATION.md#adding-questions-guide)

---

### I want to test the API

Import Postman collection from project root:
- `PrepEasy-API.postman_collection.json`
- `PrepEasy-Environments.postman_environment.json`

**Learn more:** [API-DOCUMENTATION.md](API-DOCUMENTATION.md#postman-collection)

---

### I want to backup the database

```bash
cd backend
./scripts/db_backup/backup-db.sh
```

**Learn more:** `backend/scripts/db_backup/Backup-Guide.md`

---

### I'm having issues

**Common problems:**

1. **Database connection failed**
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - See: [LOCAL-DEVELOPMENT.md#troubleshooting](LOCAL-DEVELOPMENT.md#troubleshooting)

2. **API connection errors**
   - Verify backend is running: `curl http://localhost:5001/health`
   - Check `VITE_API_URL` in frontend `.env`
   - See: [LOCAL-DEVELOPMENT.md#troubleshooting](LOCAL-DEVELOPMENT.md#troubleshooting)

3. **Production deployment issues**
   - See: [PRODUCTION-DEPLOYMENT.md#troubleshooting-production-issues](PRODUCTION-DEPLOYMENT.md#troubleshooting-production-issues)

---

## 📂 Project Structure

```
PrepEasy/
├── README.md                      # Project overview
├── LOCAL-DEVELOPMENT.md           # Local setup guide
├── PRODUCTION-DEPLOYMENT.md       # Production deployment
├── API-DOCUMENTATION.md           # API reference
├── DOCS-GUIDE.md                  # This file
│
├── backend/                       # Backend API
│   ├── README.md                  # Backend details
│   ├── docker-compose.yml         # Docker configuration
│   ├── src/                       # Source code
│   └── scripts/                   # Utility scripts
│       └── db_backup/             # Backup scripts
│           └── Backup-Guide.md
│
├── frontend/                      # Frontend React app
│   ├── README.md                  # Frontend details
│   └── src/                       # Source code
│
└── docs/
    └── archive/                   # Old consolidated docs
```

---

## 🔗 External Resources

- **Postman Collections**: In project root
- **Backend API**: http://localhost:5001/api (local)
- **Frontend App**: http://localhost:3000 (local)

---

## 💡 Tips

1. **Start with the main README** - Get an overview first
2. **Use LOCAL-DEVELOPMENT.md** - For setup and running locally
3. **Save PRODUCTION-DEPLOYMENT.md** - For when you're ready to deploy
4. **Bookmark API-DOCUMENTATION.md** - For API reference
5. **Check troubleshooting sections** - Most issues are documented

---

**Need more help?** Check the relevant documentation file or review the troubleshooting sections.
