# Movie Watchlist API

A RESTful API for managing movies and personal watchlists built with **Node.js**, **Express**, **Prisma**, and **Neon PostgreSQL**.

---

## 🏗️ Project Structure

```
src/
├── config/
│   └── db.js              # Database connection (Prisma + Neon)
├── controllers/
│   ├── authController.js  # Register, Login, Logout logic
│   ├── moviesController.js # CRUD operations for movies
│   └── watchListController.js # Watchlist management
├── middleware/
│   ├── authMiddleware.js  # JWT token verification
│   └── validateRequest.js # Zod schema validation
├── routes/
│   ├── authRoute.js       # /auth endpoints
│   ├── movieRoutes.js     # /movies endpoints
│   └── watchlistRoutes.js # /watchlist endpoints
├── validators/
│   ├── authValidator.js   # Auth request schemas
│   ├── movieValidator.js  # Movie request schemas
│   └── watchlistValidators.js # Watchlist schemas
├── utils/
│   └── generateToken.js   # JWT token generation
└── server.js              # Express app entry point
```

---

## 🔄 Data Flow Overview

```mermaid
flowchart LR
    Client([Client]) --> Server[Express Server]
    Server --> Routes[Routes]
    Routes --> Middleware{Middleware}
    Middleware --> |Validate| Validator[Zod Validator]
    Middleware --> |Auth| Auth[Auth Middleware]
    Validator --> Controller[Controller]
    Auth --> Controller
    Controller --> Prisma[Prisma Client]
    Prisma --> DB[(Neon PostgreSQL)]
```

---

## 📝 Request Lifecycle

### Example: Adding a New Movie

```mermaid
sequenceDiagram
    participant C as Client
    participant S as server.js
    participant R as movieRoutes.js
    participant V as validateRequest
    participant A as authMiddleware
    participant Ctrl as moviesController
    participant P as Prisma
    participant DB as Neon DB

    C->>S: POST /movies (with JWT + body)
    S->>R: Route matched
    R->>A: Check JWT token
    A->>A: Verify token, attach req.user
    A->>V: Token valid, continue
    V->>V: Validate body with Zod schema
    V->>Ctrl: Validation passed
    Ctrl->>P: prisma.movie.create()
    P->>DB: INSERT INTO movies
    DB-->>P: New movie record
    P-->>Ctrl: Movie object
    Ctrl-->>C: 201 { status, message, data }
```

---

## 🔐 Authentication Flow

### Register → Login → Access Protected Route

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant DB as Database

    Note over C,DB: 1. Registration
    C->>API: POST /auth/register {name, email, password}
    API->>API: Hash password (bcrypt)
    API->>DB: Create user
    DB-->>API: User created
    API-->>C: 201 {user: {id, name, email}}

    Note over C,DB: 2. Login
    C->>API: POST /auth/login {email, password}
    API->>DB: Find user by email
    DB-->>API: User record
    API->>API: Compare password (bcrypt)
    API->>API: Generate JWT token
    API-->>C: 200 {user, token} + Set-Cookie: jwt

    Note over C,DB: 3. Access Protected Route
    C->>API: GET /movies (Authorization: Bearer <token>)
    API->>API: authMiddleware verifies JWT
    API->>DB: Find user by decoded ID
    DB-->>API: User exists
    API->>API: Attach user to req.user
    API->>DB: Fetch movies
    DB-->>API: Movies list
    API-->>C: 200 {movies}
```

---

## 🎬 Movies API Flow

| Method | Endpoint      | Auth | Validation | Description             |
| ------ | ------------- | ---- | ---------- | ----------------------- |
| GET    | `/movies`     | ❌   | ❌         | Get all movies (public) |
| POST   | `/movies`     | ✅   | ✅         | Create a new movie      |
| PUT    | `/movies/:id` | ✅   | ✅         | Update your movie       |
| DELETE | `/movies/:id` | ✅   | ❌         | Delete your movie       |

### Authorization Check

Users can only update/delete movies they created:

```javascript
where: {
  id: req.params.id,
  createdBy: req.user.id  // Must match authenticated user
}
```

---

## 📋 Watchlist API Flow

| Method | Endpoint         | Auth | Validation | Description            |
| ------ | ---------------- | ---- | ---------- | ---------------------- |
| POST   | `/watchlist`     | ✅   | ✅         | Add movie to watchlist |
| PUT    | `/watchlist/:id` | ✅   | ❌         | Update watchlist item  |
| DELETE | `/watchlist/:id` | ✅   | ❌         | Remove from watchlist  |

### Watchlist Data Flow

```mermaid
flowchart TD
    A[POST /watchlist] --> B{Movie exists?}
    B -->|No| C[404 Movie not found]
    B -->|Yes| D{Already in watchlist?}
    D -->|Yes| E[400 Already added]
    D -->|No| F[Create WatchListItem]
    F --> G[Link to User + Movie]
    G --> H[201 Success]
```

---

## 🛡️ Middleware Pipeline

Every protected request goes through this pipeline:

```mermaid
flowchart LR
    A[Request] --> B[express.json]
    B --> C[Route Handler]
    C --> D{authMiddleware}
    D -->|No Token| E[401 Unauthorized]
    D -->|Invalid Token| E
    D -->|Valid Token| F{validateRequest}
    F -->|Invalid Body| G[400 Validation Error]
    F -->|Valid Body| H[Controller]
    H --> I[Response]
```

---

## 🗃️ Database Schema

```mermaid
erDiagram
    User ||--o{ Movie : creates
    User ||--o{ WatchListItem : has
    Movie ||--o{ WatchListItem : in

    User {
        string id PK
        string email UK
        string name
        string password
        datetime createdAt
        datetime updatedAt
    }

    Movie {
        string id PK
        string title
        string overview
        int releaseYear
        string[] genre
        int runtime
        string posterUrl
        string createdBy FK
        datetime createdAt
    }

    WatchListItem {
        string id PK
        string userId FK
        string movieId FK
        enum status
        int rating
        string note
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd backend-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Generate Prisma client
npx prisma db push

# Run development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
NODE_ENV="development"
```

---

## 📚 API Reference

See [docs/api-development-guide.md](docs/api-development-guide.md) for detailed information on creating new routes, validators, and middleware.
