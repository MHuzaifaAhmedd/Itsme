# Portfolio Website

A modern portfolio website built with Next.js 16 (frontend) and Express.js (backend).

## 🚀 Tech Stack

### Frontend
- **Next.js 16.1.3** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling

### Backend
- **Express.js 5.2.1** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose 9.1.4** - MongoDB object modeling
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
itsme/
├── frontend/          # Next.js application
│   ├── src/
│   │   └── app/      # App Router pages and layouts
│   ├── public/       # Static assets
│   └── package.json
│
└── backend/          # Express.js API server
    ├── src/
    │   ├── config/   # Configuration files
    │   │   └── database.ts  # MongoDB connection
    │   ├── models/   # Mongoose models
    │   │   ├── Project.ts
    │   │   └── Contact.ts
    │   ├── routes/   # API routes
    │   │   ├── projects.ts
    │   │   └── contact.ts
    │   └── index.ts  # Main server file
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20.9 or higher
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend/` directory (copy from `env.example`):
```env
PORT=4000
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/portfolio

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

**Note:** Make sure MongoDB is running locally, or use MongoDB Atlas for cloud hosting.

#### Frontend (.env.local) - Optional
Create a `.env.local` file in the `frontend/` directory (copy from `env.local.example`):
```env
# Backend API URL (for API proxy rewrites)
BACKEND_URL=http://localhost:4000

# Public environment variables (accessible in browser)
# Must be prefixed with NEXT_PUBLIC_ to be available in client-side code
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note:** 
- `BACKEND_URL` is used in `next.config.ts` for API rewrites
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- `.env.local` is automatically ignored by git (already in `.gitignore`)

## 🏃 Running the Application

### Development Mode

You need to run both frontend and backend servers simultaneously.

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Build

**Build Backend:**
```bash
cd backend
npm run build
npm start
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 📡 API Endpoints

The backend provides the following API endpoints:

### Health Check
- `GET /api/health` - Health check endpoint (includes database status)

### Projects
- `GET /api/projects` - Get all portfolio projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project by ID
- `POST /api/projects` - Create new project (requires validation)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin)
- `GET /api/contact/:id` - Get single contact message
- `PUT /api/contact/:id/read` - Mark contact as read

### Example API Usage

From the frontend, you can call the API using:
```typescript
// The /api prefix is automatically proxied to the backend
const response = await fetch('/api/health');
const data = await response.json();
```

## 🎨 Features

- ✅ Modern Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Express.js REST API
- ✅ MongoDB database integration
- ✅ Mongoose ODM with type-safe models
- ✅ API proxy configuration
- ✅ CORS enabled for development
- ✅ Environment variable support
- ✅ Input validation and error handling
- ✅ Security best practices (no known vulnerabilities)

## 📝 Next Steps

1. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Update `MONGODB_URI` in your `.env` file

2. **Customize the portfolio:**
   - Update `frontend/src/app/page.tsx` with your content
   - Add your projects using the API or directly in MongoDB

3. **Add projects to database:**
   ```bash
   # You can use the API or MongoDB directly
   POST /api/projects
   {
     "title": "My Project",
     "description": "Project description",
     "technologies": ["Next.js", "TypeScript"],
     "githubUrl": "https://github.com/...",
     "liveUrl": "https://example.com",
     "featured": true
   }
   ```

4. **Implement email functionality:**
   - Add email service (e.g., SendGrid, Nodemailer) to contact form
   - Update `backend/src/routes/contact.ts`

5. **Add authentication** (optional):
   - Implement JWT authentication for admin routes
   - Protect project creation/update/delete endpoints

6. **Deploy:**
   - Frontend: Vercel, Netlify
   - Backend: Render, Railway, or AWS
   - Database: MongoDB Atlas (recommended)

## 🔧 Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## 📄 License

ISC

---

Built with ❤️ using Next.js and Express.js
