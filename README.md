# InterviewDock - Interview Preparation Platform

A production-ready full-stack web application for technical interview preparation. Browse and study interview questions across various technologies, all publicly accessible with no authentication required.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)

## 🎯 Overview

InterviewDock is a comprehensive interview preparation platform featuring:

- **Organized Content**: Questions categorized by technology and difficulty
- **Rich Formatting**: Markdown support with syntax-highlighted code examples
- **Smart Filtering**: Search, filter by difficulty, and browse by technology
- **Public Access**: No login required - all content is freely accessible
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router v6
- Zustand (state management)
- Axios
- react-markdown
- react-syntax-highlighter

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- TypeORM

### Project Structure

```
InterviewDock/
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/    # Configuration
│   │   ├── entities/  # TypeORM entities
│   │   ├── services/  # Business logic
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/    # API routes
│   │   ├── middleware/ # Custom middleware
│   │   ├── utils/     # Utilities
│   │   └── database/  # Seeds and migrations
│   └── package.json
│
└── frontend/          # React application
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── services/   # API services
    │   ├── store/      # Zustand store
    │   ├── types/      # TypeScript types
    │   └── lib/        # Utilities
    └── package.json
```

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

1. **categories** - Frontend, Backend, etc.
2. **technologies** - React, Vue, Node.js, PostgreSQL, etc.
3. **questions** - Interview questions with answers
4. **tags** - Keywords for questions
5. **question_tags** - Many-to-many relationship

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=interviewdock
   PORT=5000
   ```

4. **Create database:**
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE interviewdock;
   \q
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Seed the database:**
   ```bash
   npm run seed
   ```

   This populates the database with sample categories, technologies, and questions.

The backend API will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Ensure the API URL matches your backend:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:3000`

## 📡 API Endpoints

### Categories
```
GET /api/categories
```

### Technologies
```
GET /api/technologies?categoryId={id}
```

### Questions
```
GET /api/questions?technologyId={id}&difficulty={level}&search={query}&page={n}&limit={n}
GET /api/questions/:id
```

**Query Parameters:**
- `technologyId`: Filter by technology
- `difficulty`: Easy, Medium, or Hard
- `tag`: Filter by tag slug
- `search`: Search in titles
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

## ✨ Features

### For Users

- **Browse by Category**: Frontend, Backend, etc.
- **Filter by Technology**: React, Node.js, PostgreSQL, and more
- **Search**: Find questions by keywords
- **Difficulty Filtering**: Easy, Medium, Hard
- **Rich Content**: Markdown-formatted answers with code examples
- **Responsive**: Works on all devices
- **No Login**: Public access to all content

### For Developers

- **Clean Architecture**: Layered backend (routes → controllers → services → repositories)
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Global error middleware
- **Pagination**: Efficient data loading
- **Code Quality**: ESLint configured
- **Scalable**: Easy to add new categories and technologies

## 🎨 UI Features

- Modern, clean design
- Syntax-highlighted code blocks
- Collapsible sidebar navigation
- Responsive pagination
- Difficulty badges (color-coded)
- Tag system
- Smooth transitions

## 📦 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

Deploy the `dist/` directory to your hosting provider.

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | DB username | postgres |
| DB_PASSWORD | DB password | postgres |
| DB_DATABASE | Database name | interviewdock |
| DEFAULT_PAGE_SIZE | Pagination size | 20 |
| MAX_PAGE_SIZE | Max page size | 100 |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## 🧪 Sample Data

The seed script includes:

**Categories:**
- Frontend
- Backend

**Technologies:**
- React
- Vue.js
- JavaScript
- Node.js
- PostgreSQL
- Spring Boot

**Sample Questions:**
- React: Virtual DOM, Hooks, useMemo vs useCallback
- JavaScript: Event Loop, == vs ===
- Node.js: Express middleware
- PostgreSQL: ACID properties

## 📚 Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [Frontend README](frontend/README.md) - Detailed frontend documentation

## 🛠️ Development

### Folder Structure Best Practices

- **Entities**: Database models with TypeORM decorators
- **Services**: Business logic, no HTTP concerns
- **Controllers**: Handle requests/responses, call services
- **Routes**: Define API endpoints
- **Components**: Reusable React components
- **Pages**: Route-level components
- **Store**: Global state management with Zustand

### Adding New Questions

1. Add via seed script (`backend/src/database/seed.ts`)
2. Or create API endpoints for CRUD operations (future enhancement)

### Adding New Technologies

Update the seed script with new technology objects:

```typescript
const newTech = technologyRepo.create({
  name: 'Angular',
  slug: 'angular',
  description: 'Platform for building web applications',
  icon: '🅰️',
  categoryId: frontendCategory.id,
  order: 4,
});
```

## 🚦 Common Issues

### Database Connection Failed
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify database exists

### Port Already in Use
- Change port in backend `.env`
- Update frontend `.env` to match

### Frontend Can't Reach API
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled

## 🔐 Security Note

This is a **public application** with no authentication. All data is publicly accessible. Do not store sensitive information.

## 📝 License

This project is provided as-is for educational and interview preparation purposes.

## 🎯 Future Enhancements

- [ ] Admin panel for content management
- [ ] User accounts and progress tracking
- [ ] Bookmarking questions
- [ ] Dark mode
- [ ] Question difficulty voting
- [ ] Community-contributed questions
- [ ] Export questions as PDF
- [ ] Practice mode with random questions
- [ ] Analytics and tracking

## 👨‍💻 Development Commands

### Backend
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm start        # Run production build
npm run seed     # Seed database
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

---

**Built with ❤️ for developers preparing for technical interviews**
