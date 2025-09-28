# 🧑‍💻 Development Guide

This guide will help you get started with development in the Shift Manager monorepo.

## Quick Start

1. **Run the setup script** (recommended for first time):
   ```bash
   npm run setup
   ```

2. **Or install dependencies manually**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Copy `packages/api/.env.example` to `packages/api/.env`
   - Update the configuration values

4. **Start development servers**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Working with the API (Backend)
- **Location**: `packages/api/`
- **Start only API**: `npm run dev:api`
- **Port**: 8000
- **API Docs**: http://localhost:8000/api/docs

### Working with the Web App (Frontend)
- **Location**: `packages/web/`
- **Start only Web**: `npm run dev:web`
- **Port**: 3000
- **URL**: http://localhost:3000

### Adding Dependencies

```bash
# For API package
npm install package-name --workspace=packages/api

# For Web package
npm install package-name --workspace=packages/web

# For development tools (root)
npm install -D package-name
```

### Running Tests

```bash
# All tests
npm run test

# API tests only
npm run test:api

# Web tests only
npm run test:web
```

### Building for Production

```bash
# Build everything
npm run build

# Build API only
npm run build:api

# Build Web only
npm run build:web
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both API and web in development |
| `npm run setup` | Run the setup script |
| `npm run clean` | Remove all node_modules and build folders |
| `npm run reset` | Clean and reinstall everything |
| `npm run build` | Build for production |
| `npm run test` | Run all tests |

## Package Structure

```
packages/
├── api/                    # Backend API
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── swagger/           # API documentation
│   ├── .env.example       # Environment template
│   └── server.js          # Entry point
└── web/                   # Frontend React app
    ├── public/            # Static assets
    ├── src/
    │   ├── components/    # React components
    │   ├── context/       # React context
    │   ├── hooks/         # Custom hooks
    │   └── lib/           # Utilities
    └── package.json
```

## Environment Variables

### API (.env)
```env
MONGO_URI=mongodb://localhost:27017/shift-manager
PORT=8000
JWT_SECRET=your-jwt-secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### Port Issues
- API uses port 8000
- Web uses port 3000
- Change ports in respective package.json if needed

### MongoDB Connection
- Ensure MongoDB is running locally OR
- Use MongoDB Atlas connection string

### CORS Issues
- Check `FRONTEND_URL` in API .env
- Verify CORS configuration in API

### Clean Install
```bash
npm run reset
```

## Tips

1. **Use workspaces**: Always specify `--workspace=packages/api` or `--workspace=packages/web` when installing packages
2. **Environment first**: Set up your .env file before starting development
3. **Check ports**: Make sure ports 3000 and 8000 are available
4. **API first**: Start with the API to ensure backend is working, then test with frontend