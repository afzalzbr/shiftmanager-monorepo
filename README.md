# 🚀 Shiftmanager Shift Manager - Monorepo

A comprehensive shift management application built with React frontend and Node.js backend in a monorepo structure.

## 📂 Project Structure

```
shiftmanager-full-stack-monorepo/
├── packages/
│   ├── api/                 # Backend API (Node.js + Express + MongoDB)
│   └── web/                 # Frontend App (React + Tailwind CSS)
├── package.json             # Root package with workspace configuration
├── README.md               # This file
└── .gitignore              # Git ignore rules
```

## ✨ Features

### Backend (API)
- ✅ User authentication (JWT-based)
- 🔐 Protected routes and middleware
- 🔁 Password reset via email
- 📄 Swagger API documentation
- 🗄️ MongoDB database integration
- 🛡️ Security best practices

### Frontend (Web)
- ⚛️ React 18 with modern hooks
- 🎨 Tailwind CSS for styling
- 🔐 Authentication flow
- 📅 Shift management interface
- 📱 Responsive design
- 🎯 Component-based architecture

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/afzalzbr/shiftmanager-monorepo.git
   cd shiftmanager-monorepo
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This will install dependencies for both the root project and all packages.

3. **Set up environment variables**
   ```bash
   # Copy example env file for API
   cp packages/api/.env.example packages/api/.env
   ```
   
   Edit `packages/api/.env` with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/shift-manager
   PORT=8000
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the API server (port 8000) and React app (port 3000) concurrently.

## 📜 Available Scripts

### Root Level Scripts
- `npm install` - Install dependencies for all packages
- `npm run dev` - Start both API and web in development mode
- `npm run start` - Alias for dev
- `npm run build` - Build both packages for production
- `npm run test` - Run tests for all packages
- `npm run clean` - Clean all node_modules and build directories

### Package-Specific Scripts
- `npm run dev:api` - Start only the API server
- `npm run dev:web` - Start only the React app
- `npm run build:web` - Build React app for production
- `npm run test:api` - Run API tests
- `npm run test:web` - Run React app tests

### Working with Individual Packages

You can also work with individual packages using npm workspaces:

```bash
# Install a dependency to the API package
npm install express --workspace=packages/api

# Install a dependency to the web package
npm install axios --workspace=packages/web

# Run a script in a specific package
npm run dev --workspace=packages/api
```

## 🌐 API Documentation

When the API is running, Swagger documentation is available at:
- **Local**: http://localhost:8000/api/docs
- **Production**: Check your deployed API URL + `/api/docs`

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGO_URI` in `packages/api/.env`

### MongoDB Atlas (Cloud)
1. Create account at MongoDB Atlas
2. Create a cluster and database
3. Get connection string
4. Update `MONGO_URI` in `packages/api/.env`

## 🚀 Deployment

### Frontend (Web)
The React app can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting

```bash
npm run build:web
# Deploy the packages/web/build directory
```

### Backend (API)
The API can be deployed to:
- Render
- Heroku
- Railway
- DigitalOcean App Platform

Make sure to set environment variables in your hosting provider.

## 🔧 Development Workflow

1. **Feature Development**
   ```bash
   # Create a feature branch
   git checkout -b feature/your-feature-name
   
   # Start development
   npm run dev
   
   # Make changes to packages/api or packages/web
   # The servers will auto-reload
   ```

2. **Adding Dependencies**
   ```bash
   # For API
   npm install package-name --workspace=packages/api
   
   # For Web
   npm install package-name --workspace=packages/web
   
   # For development tools (root level)
   npm install -D package-name
   ```

3. **Testing Changes**
   ```bash
   npm run test
   ```

## 📱 Package Details

### API Package (`packages/api`)
- **Tech Stack**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT tokens
- **Documentation**: Swagger/OpenAPI 3.0
- **Port**: 8000 (development)

### Web Package (`packages/web`)
- **Tech Stack**: React, Tailwind CSS, React Router
- **State Management**: Context API
- **Components**: Radix UI components
- **Port**: 3000 (development)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Create a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**
   - API default: 8000
   - Web default: 3000
   - Update ports in respective package.json files if needed

2. **MongoDB connection issues**
   - Check if MongoDB is running locally
   - Verify MONGO_URI in .env file
   - Check network access for MongoDB Atlas

3. **CORS issues**
   - Ensure FRONTEND_URL is set correctly in API .env
   - Check CORS configuration in API

4. **Dependencies not installing**
   ```bash
   npm run clean
   npm install
   ```

### Getting Help

- Check package-specific README files
- Review API documentation at `/api/docs`
- Open an issue on GitHub

---

**Happy coding! 🎉**