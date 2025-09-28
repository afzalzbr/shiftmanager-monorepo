# 🚀 Shift Manager Backend API

This is the backend system for the **Shift Manager** application, built with **Node.js**, **Express**, and **MongoDB**. It supports:

- ✅ User registration and login with JWT authentication
- 🔐 Protected routes for shift management
- 🔁 Password reset via email with secure token flow
- 📄 Auto-generated API docs using Swagger (OpenAPI 3.0)

---

## 📂 Folder Structure

```
packages/api/
├── controllers/           # Route handlers (User, Shift, Forgot Password)
├── middleware/            # JWT authentication middleware
├── models/                # Mongoose schemas (User, Shift)
├── routes/                # API route definitions
├── migrations/            # Database seeding scripts
├── swagger/               # Swagger config for auto docs
├── .env                   # Environment variables (not committed)
├── package.json
├── server.js              # Entry point
└── README.md              # This file
```

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/afzalzbr/shiftmanager-monorepo.git
cd shiftmanager-monorepo
```

### 2. Install dependencies

```bash
# Install dependencies for the entire monorepo
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the `packages/api` directory with the following variables:

```env
MONGO_URI=<your-mongodb-connection-uri>
PORT=8000
JWT_SECRET=secret1234
NODE_ENV=development
```

---

### 4. Run the server

```bash
# From the root of the monorepo, run the API server
npm run dev:api

# Or run both API and web app together
npm run dev
```

> Server will run locally on: [http://localhost:8000](http://localhost:8000)

---

## 📁 API Documentation

When the API server is running, Swagger UI is available at:

- **Local Development**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **Production**: Check your deployed API URL + `/api/docs`

---

## 🔐 Authenticated Endpoints

Use the `/user/login` route to get a JWT. Then include it in your requests:

```
Authorization: Bearer <token>
```

---

## 📄 License

MIT
