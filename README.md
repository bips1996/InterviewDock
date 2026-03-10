# PrepEasy - Interview Preparation Platform

> A production-ready full-stack web application for technical interview preparation. Browse and study interview questions across various technologies with no authentication required.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)

---

## 🎯 Overview

PrepEasy (also known as InterviewDock) is a comprehensive interview preparation platform featuring:

- **Organized Content** - Questions categorized by technology (React, Node.js, PostgreSQL, etc.) and difficulty
- **Rich Formatting** - Markdown support with syntax-highlighted code examples
- **Smart Filtering** - Search, filter by difficulty, and browse by technology
- **Public Access** - No login required, all content freely accessible
- **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🚀 Quick Start

### For Local Development

**Option 1: Automated Setup (macOS/Linux)**
```bash
chmod +x setup.sh
./setup.sh
```

**Option 2: Manual Setup**

See **[LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)** for detailed instructions.

### For Production Deployment

See **[PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)** for complete deployment guide.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md)** | Complete guide for setting up and running locally (Docker & Native) |
| **[PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)** | Production deployment on AWS EC2, Vercel, Netlify with SSL setup |
| **[API-DOCUMENTATION.md](API-DOCUMENTATION.md)** | Complete API reference and usage examples |

### Additional Resources

- **Database Backups**: See `backend/scripts/db_backup/Backup-Guide.md`
- **Postman Collection**: `PrepEasy-API.postman_collection.json` in project root
- **Environment Files**: `.env.example` files in backend and frontend directories

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router v6
- Zustand (state management)
- react-markdown with syntax highlighting

**Backend:**
- Node.js 18+ + Express
- TypeScript
- PostgreSQL 14+
- TypeORM (ORM)

**Deployment:**
- Frontend: Vercel / Netlify / Cloudflare Pages
- Backend: AWS EC2 + Docker
- Database: PostgreSQL (Docker or RDS)

### Project Structure

```
PrepEasy/
├── backend/              # Express REST API
│   ├── src/
│   │   ├── config/       # Database & app configuration
│   │   ├── entities/     # TypeORM entity models
│   │   ├── services/     # Business logic layer
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Helper functions
│   │   └── database/     # Seed scripts
│   ├── scripts/          # Deployment & backup scripts
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── store/        # Zustand state management
│   │   ├── types/        # TypeScript type definitions
│   │   └── lib/          # Utility functions
│   └── vite.config.ts
│
├── LOCAL-DEVELOPMENT.md       # Local setup guide
├── PRODUCTION-DEPLOYMENT.md   # Production deployment guide
├── API-DOCUMENTATION.md       # API reference
└── README.md                  # This file
```

---

## 🗄️ Database Schema

### Entity Relationship

```
Category (Frontend, Backend)
    ↓ 1:N
Technology (React, Node.js, PostgreSQL, etc.)
    ↓ 1:N
Question
    ↓ N:M
Tag
```

### Tables

- **categories** - Top-level groupings (Frontend, Backend, etc.)
- **technologies** - Specific tech stacks (React, Vue, Node.js, PostgreSQL, etc.)
- **questions** - Interview questions with answers, code snippets, and difficulty levels
- **tags** - Keywords/topics for questions
- **question_tags** - Many-to-many relationship between questions and tags

---

## ✨ Key Features

### For Users

- 🗂️ **Browse by Category** - Frontend, Backend, etc.
- 🔍 **Filter by Technology** - React, Node.js, PostgreSQL, and more
- 🔎 **Search** - Find questions by keywords
- 📊 **Difficulty Filtering** - Easy, Medium, Hard levels
- 📝 **Rich Content** - Markdown-formatted answers with syntax-highlighted code
- 📱 **Responsive Design** - Works on all devices
- 🔓 **No Login Required** - Public access to all content

### For Developers

- 🏛️ **Clean Architecture** - Layered backend (Routes → Controllers → Services)
- 🔒 **Type Safety** - Full TypeScript coverage
- ⚠️ **Error Handling** - Global error middleware
- 📄 **Pagination** - Efficient data loading
- 📦 **Docker Support** - Easy local development and deployment
- 🔧 **RESTful API** - Well-documented endpoints

---

## 📡 API Overview

**Base URL:** `http://localhost:5001/api`

### Main Endpoints

```bash
# Categories
GET /api/categories

# Technologies
GET /api/technologies
GET /api/technologies?categoryId={id}

# Questions
GET /api/questions
GET /api/questions?technologyId={id}&difficulty={level}&search={query}
GET /api/questions/:id
POST /api/questions
PUT /api/questions/:id
DELETE /api/questions/:id
```

For complete API documentation, see **[API-DOCUMENTATION.md](API-DOCUMENTATION.md)**.

---

## 🧪 Sample Data

The database seed includes:

**Categories:**
- Frontend Development
- Backend Development

**Technologies:**
- React, Vue.js, JavaScript (Frontend)
- Node.js, PostgreSQL, MongoDB (Backend)

**Sample Questions:**
- "What is the Virtual DOM in React?" (Easy)
- "Explain useCallback vs useMemo" (Medium)
- "How does the Event Loop work in Node.js?" (Hard)
- And more...

---

## 🛠️ Development Commands

### Backend
```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build TypeScript for production
npm start          # Run production build
npm run seed       # Seed database with sample data
npm run seed:docker # Seed database in Docker
```

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Docker
```bash
# Backend directory
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f            # View logs
docker-compose restart            # Restart services
./scripts/docker-seed.sh          # Seed database
./scripts/db_backup/backup-db.sh  # Backup database
```

---

## 🔧 Environment Variables

### Backend (.env)

```bash
NODE_ENV=development
PORT=5001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interviewdock
DB_SYNCHRONIZE=true    # Auto-sync schema (dev only!)
DB_LOGGING=false

CORS_ORIGIN=*          # Use specific origin in production
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5001/api
```

---

## 🚀 Deployment

### Backend (AWS EC2 + Docker)

See **[PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)** for:
- EC2 setup and configuration
- Docker deployment
- SSL/HTTPS setup with Let's Encrypt
- nginx reverse proxy
- Database backups
- PM2 process management

### Frontend (Vercel/Netlify)

See **[PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md)** for:
- Vercel deployment
- Netlify deployment
- Cloudflare Pages deployment
- Custom domain setup
- Environment configuration

---

## 📚 Additional Documentation

- **Backend Details**: See [backend/README.md](backend/README.md)
- **Database Backups**: See `backend/scripts/db_backup/Backup-Guide.md`
- **Postman Testing**: Import `PrepEasy-API.postman_collection.json`

---

## 🚦 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps` or `brew services list`
- Verify credentials in `.env` file
- Check database exists: `psql -U postgres -l`

### Port Conflicts
- Backend uses port 5001 (configurable via `PORT` in `.env`)
- Frontend uses port 3000 (Vite auto-assigns if occupied)

### API Connection Issues
- Verify backend is running: `curl http://localhost:5001/health`
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

For more troubleshooting, see:
- [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md#troubleshooting)
- [PRODUCTION-DEPLOYMENT.md](PRODUCTION-DEPLOYMENT.md#troubleshooting-production-issues)

---

## 🔐 Security Notes

- This is a **public application** with no authentication
- All content is publicly accessible
- Don't store sensitive information
- In production, configure `CORS_ORIGIN` to specific domains
- Set `DB_SYNCHRONIZE=false` after initial deployment
- Use strong database passwords
- Enable HTTPS in production

---

## 🎯 Future Enhancements

- [ ] Admin panel for content management
- [ ] User authentication and accounts
- [ ] Progress tracking and bookmarks
- [ ] Dark mode
- [ ] Question difficulty voting
- [ ] Community-contributed questions
- [ ] Export to PDF
- [ ] Practice mode with random questions
- [ ] Question comments and discussions

---

## 📝 License

This project is provided as-is for educational and interview preparation purposes.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Support

For issues or questions:
1. Check the documentation files
2. Review troubleshooting sections
3. Check application logs
4. Open an issue on GitHub

---

**Made with ❤️ for interview preparation**
```
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

---

**Built with ❤️ for developers preparing for technical interviews**
