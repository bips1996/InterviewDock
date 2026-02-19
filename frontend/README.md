# InterviewDock Frontend

Modern React frontend for the InterviewDock Interview Preparation Platform.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Markdown**: react-markdown
- **Code Highlighting**: react-syntax-highlighter
- **Icons**: lucide-react

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── DifficultyBadge.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── QuestionFilters.tsx
│   │   └── index.ts
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── QuestionsPage.tsx
│   │   ├── QuestionDetailPage.tsx
│   │   └── index.ts
│   ├── services/         # API services
│   │   └── api.ts
│   ├── store/            # Zustand store
│   │   └── useAppStore.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── lib/              # Utilities
│   │   └── api.ts
│   ├── config/           # Configuration
│   │   └── index.ts
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.example
```

## Features

### Pages

1. **Home Page** (`/`)
   - Hero section
   - Feature highlights
   - Technology showcase
   - CTA to start preparing

2. **Questions Page** (`/questions`)
   - Sidebar with categories and technologies
   - Search and filter functionality
   - Paginated question list
   - Expandable question cards
   - Click to view full details

3. **Question Detail Page** (`/questions/:id`)
   - Full question with markdown-formatted answer
   - Code snippets with syntax highlighting
   - Tags and metadata
   - Breadcrumb navigation

### Components

- **Header**: Navigation bar with logo and links
- **Sidebar**: Category/Technology tree navigation
- **DifficultyBadge**: Color-coded difficulty indicator
- **CodeBlock**: Syntax-highlighted code display
- **QuestionFilters**: Search, difficulty, and tag filters

### State Management

Uses Zustand for lightweight, hook-based state management:

```typescript
const store = {
  categories: Category[],
  technologies: Technology[],
  selectedCategoryId: string | null,
  selectedTechnologyId: string | null,
  filters: QuestionFilters,
  // ...actions
}
```

### Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Responsive sidebar (collapsible on mobile)
- Adaptive layouts for all screen sizes

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Running backend API (see backend README)

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview  # Preview production build
```

The build output will be in the `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Styling

### Tailwind CSS

Custom configuration with:
- Extended color palette (primary shades)
- Custom component classes
- Utility classes for badges and buttons

### Custom Classes

```css
/* Buttons */
.btn             /* Base button */
.btn-primary     /* Primary button */
.btn-secondary   /* Secondary button */

/* Card */
.card            /* Card container */

/* Badges */
.badge           /* Base badge */
.badge-easy      /* Green badge */
.badge-medium    /* Yellow badge */
.badge-hard      /* Red badge */
```

## API Integration

### Axios Instance

Configured with:
- Base URL from environment
- JSON content type
- Response error interceptor

### API Services

Type-safe API calls using TypeScript:

```typescript
import { categoryApi, technologyApi, questionApi } from '@/services/api';

// Get all categories
const categories = await categoryApi.getAll();

// Get filtered questions
const result = await questionApi.getAll({
  technologyId: 'uuid',
  difficulty: Difficulty.MEDIUM,
  search: 'react hooks',
  page: 1,
  limit: 20,
});
```

## Routing

Using React Router v6:

```
/ → HomePage
/questions → QuestionsPage
/questions/:id → QuestionDetailPage
```

## TypeScript

Strict mode enabled with:
- Complete type definitions for all API responses
- Enum types for difficulty levels
- Interface definitions for all entities

## Features in Detail

### Search & Filtering

- **Text Search**: Search questions by title (case-insensitive)
- **Difficulty Filter**: Filter by Easy/Medium/Hard
- **Technology Filter**: Select from sidebar
- **Tag Filter**: Click tags to filter (future enhancement)
- **Clear Filters**: One-click reset

### Pagination

- Page numbers with ellipsis for large sets
- Previous/Next navigation
- Configurable page size
- Smooth scroll to top on page change

### Code Highlighting

Powered by react-syntax-highlighter:
- VS Code Dark+ theme
- Line numbers
- Multiple language support
- Syntax-aware formatting

### Markdown Support

Using react-markdown:
- Full markdown syntax support
- Headings, lists, bold, italic
- Code blocks
- Links and formatting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React.lazy (available for scaling)
- Optimized bundle with Vite
- Tree-shaking for smaller builds
- Fast refresh in development

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Bookmark questions
- [ ] Print-friendly view
- [ ] Share question links
- [ ] Progress tracking
- [ ] Filter by multiple tags
- [ ] Advanced search with operators
- [ ] Export questions as PDF

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

## Notes

- Assumes backend API is running on port 5000
- No authentication required (public app)
- All routes are publicly accessible
- Uses Vite's proxy in development for API calls
