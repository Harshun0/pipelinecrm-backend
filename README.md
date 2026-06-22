# PipelineCRM — Backend

A secure Node.js + Express REST API for the PipelineCRM Mini CRM Opportunity Tracker. Handles authentication, authorization, and opportunity management with JWT-based ownership validation.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + bcrypt
- **Deployment:** Render

## Project Structure

```
/backend
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me
│   │   └── opportunityController.js  # CRUD + ownership validation
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Opportunity.js      # Opportunity schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── opportunityRoutes.js
│   └── server.js
├── .env.example
└── package.json
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get logged-in user profile |

### Opportunities (all protected — requires Bearer token)

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/opportunities` | All logged-in users |
| POST | `/api/opportunities` | All logged-in users |
| GET | `/api/opportunities/:id` | All logged-in users |
| PUT | `/api/opportunities/:id` | Owner only |
| DELETE | `/api/opportunities/:id` | Owner only |

> Owner is derived from the JWT token on the backend. `user_id` is never accepted from the request body.

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=https://your-frontend-vercel-url.vercel.app
NODE_ENV=production
```

## Local Setup

```bash
# Clone the repo
git clone https://github.com/Harshun0/pipelinecrm-backend.git
cd pipelinecrm-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET

# Start development server
npm start
```

Server runs on `http://localhost:5000`

Health check: `GET /api/health` → `{ "status": "ok" }`

## Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo
4. Set environment variables in Render dashboard
5. Build command: `npm install`
6. Start command: `npm start`

Live backend: `https://pipelinecrm-backend.onrender.com`

## Security Notes

- Passwords hashed with **bcrypt**
- JWT tokens expire in **2 hours**
- Ownership validated on backend for all update/delete operations — frontend-only hiding is not sufficient
- Secrets stored in environment variables — never committed to Git
- CORS restricted to allowed frontend origins

## Known Limitations / Pending Improvements

- No pagination on GET /api/opportunities (can be added with `?page=` query param)
- No rate limiting on auth endpoints
- Unit tests not included in this version
