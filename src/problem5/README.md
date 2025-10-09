# ExpressJS TypeScript CRUD Backend

Problem 5: A backend server built with ExpressJS and TypeScript, featuring a clean architecture with controller + services + repositories pattern. This application provides a complete CRUD interface for managing users with data persistence using SQLite.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete users
- **Advanced Filtering**: Search and filter users by name, email, age range
- **Pagination**: Built-in pagination support for large datasets
- **Input Validation**: Comprehensive validation using Zod
- **Error Handling**: Robust error handling with meaningful messages
- **TypeScript**: Full type safety throughout the application
- **Clean Architecture**: Controller + Services + Repositories pattern
- **Database**: SQLite for data persistence
- **Security**: Helmet for security headers, CORS support
- **Logging**: Morgan for HTTP request logging
- **API Documentation**: Interactive Swagger UI for testing endpoints

## 🎯 Quick Start - Live Demo

**Want to see it in action? Try the live API right now!**

| 🔗 Link | 📝 Description |
|---------|----------------|
| [**API Documentation**](https://code-challenge-production.up.railway.app/api-docs/) | Interactive Swagger UI - test all endpoints |
| [**Health Check**](https://code-challenge-production.up.railway.app/health) | Verify the API is running |
| [**Users API**](https://code-challenge-production.up.railway.app/api/users) | Direct access to users endpoint |

**💡 Pro Tip**: Start with the API Documentation link to explore all features interactively!

## 📁 Project Structure

```
src/
├── controllers/          # HTTP request handlers
│   └── UserController.ts
├── services/            # Business logic layer
│   └── UserService.ts
├── repositories/        # Data access layer
│   └── UserRepository.ts
├── database/           # Database configuration
│   └── database.ts
├── routes/             # Express routes
│   └── userRoutes.ts
├── types/              # TypeScript type definitions
│   ├── User.ts
│   └── ApiResponse.ts
├── validation/         # Input validation schemas
│   └── userValidation.ts
├── swagger/            # API documentation
│   └── swaggerConfig.ts
├── app.ts              # Express application setup
└── index.ts            # Server entry point
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd /path/to/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` by default.

## 📖 API Documentation

### Swagger UI

The API includes interactive documentation powered by Swagger UI. You can view and test all endpoints through a web interface.

**Access the documentation:**
- **Live Demo**: [https://code-challenge-production.up.railway.app/api-docs/](https://code-challenge-production.up.railway.app/api-docs/)
- **Local Development**: `http://localhost:3000/api-docs/`

**Features:**
- Interactive endpoint testing
- Request/response examples
- Schema definitions
- Try-it-out functionality
- Real-time API testing

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/users` | Get all users (with filtering) |
| `GET` | `/api/users/:id` | Get user by ID |
| `POST` | `/api/users` | Create new user |
| `PATCH` | `/api/users/:id` | Update user (partial) |
| `DELETE` | `/api/users/:id` | Delete user |

## 📚 API Reference

### Base URL
```
http://localhost:3000/api/users
```

### Endpoints

#### 1. Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

#### 2. Get All Users (with filtering and pagination)
```http
GET /api/users?name=John&minAge=25&maxAge=35&limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

#### 3. Get User by ID
```http
GET /api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Update User
```http
PATCH /api/users/1
Content-Type: application/json

{
  "name": "John Smith",
  "age": 31
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "age": 31,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

#### 5. Delete User
```http
DELETE /api/users/1
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Query Parameters for GET /api/users

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `name` | string | Filter by name (partial match) | `?name=John` |
| `email` | string | Filter by email (partial match) | `?email=example.com` |
| `minAge` | number | Minimum age filter | `?minAge=25` |
| `maxAge` | number | Maximum age filter | `?maxAge=65` |
| `limit` | number | Number of results per page (1-100) | `?limit=20` |
| `offset` | number | Number of results to skip | `?offset=40` |

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": ["Validation error details"] // Only for validation errors
}
```

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./database.sqlite
```

## 🧪 Testing the API

### Using Swagger UI (Recommended)

The easiest way to test the API is through the interactive Swagger UI:

**Option 1: Live Demo (No setup required)**
1. **Open Live Demo**: Navigate to [https://code-challenge-production.up.railway.app/api-docs/](https://code-challenge-production.up.railway.app/api-docs/)
2. **Test endpoints**: Click on any endpoint to expand it, then click "Try it out"
3. **Fill parameters**: Enter the required data and click "Execute"
4. **View results**: See the response directly in the interface

**Option 2: Local Development**
1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: Navigate to `http://localhost:3000/api-docs/`
3. **Test endpoints**: Click on any endpoint to expand it, then click "Try it out"
4. **Fill parameters**: Enter the required data and click "Execute"
5. **View results**: See the response directly in the interface

### Using curl

**Live Demo Examples:**
1. **Create a user:**
   ```bash
   curl -X POST https://code-challenge-production.up.railway.app/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","age":30}'
   ```

2. **Get all users:**
   ```bash
   curl https://code-challenge-production.up.railway.app/api/users
   ```

3. **Get user by ID:**
   ```bash
   curl https://code-challenge-production.up.railway.app/api/users/1
   ```

4. **Update user:**
   ```bash
   curl -X PATCH https://code-challenge-production.up.railway.app/api/users/1 \
     -H "Content-Type: application/json" \
     -d '{"name":"John Smith","age":31}'
   ```

5. **Delete user:**
   ```bash
   curl -X DELETE https://code-challenge-production.up.railway.app/api/users/1
   ```

**Local Development Examples:**
1. **Create a user:**
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","age":30}'
   ```

2. **Get all users:**
   ```bash
   curl http://localhost:3000/api/users
   ```

3. **Get user by ID:**
   ```bash
   curl http://localhost:3000/api/users/1
   ```

4. **Update user:**
   ```bash
   curl -X PATCH http://localhost:3000/api/users/1 \
     -H "Content-Type: application/json" \
     -d '{"name":"John Smith","age":31}'
   ```

5. **Delete user:**
   ```bash
   curl -X DELETE http://localhost:3000/api/users/1
   ```

### Using Postman or similar tools

Import the following collection or manually test the endpoints:

- **Base URL:** `http://localhost:3000`
- **Health Check:** `GET /health`
- **Users API:** `GET/POST/PUT/DELETE /api/users`

## 🏗️ Architecture

### Controller Layer (`/controllers`)
- Handles HTTP requests and responses
- Input validation and sanitization
- Calls appropriate service methods
- Returns formatted API responses

### Service Layer (`/services`)
- Contains business logic
- Orchestrates data operations
- Handles business rules and validation
- Calls repository methods

### Repository Layer (`/repositories`)
- Abstracts database operations
- Handles data persistence
- Maps database rows to domain objects
- Provides clean data access interface

### Database Layer (`/database`)
- Database connection and configuration
- Schema initialization
- Connection management

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive validation using Zod
- **SQL Injection Protection**: Parameterized queries
- **Error Handling**: Secure error messages in production

## 🔗 Quick Links

### Live Demo (Railway)
- **API Documentation**: [https://code-challenge-production.up.railway.app/api-docs/](https://code-challenge-production.up.railway.app/api-docs/)
- **Health Check**: [https://code-challenge-production.up.railway.app/health](https://code-challenge-production.up.railway.app/health)
- **Users API**: [https://code-challenge-production.up.railway.app/api/users](https://code-challenge-production.up.railway.app/api/users)

### Local Development
- **API Documentation**: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)
- **Users API**: [http://localhost:3000/api/users](http://localhost:3000/api/users)

## 📝 Development

### Available Scripts

```bash
npm run dev      # Start development server with auto-reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests (if implemented)
```

### Database

The application uses SQLite for simplicity. The database file (`database.sqlite`) will be created automatically on first run. The schema includes:

- `users` table with id, name, email, age, createdAt, updatedAt columns
- Automatic timestamps for created and updated dates
- Unique constraint on email field

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Use a production database (PostgreSQL, MySQL, etc.)
4. Set up proper logging and monitoring
5. Configure reverse proxy (nginx, Apache)
6. Set up SSL/TLS certificates

## 📄 License

MIT License - feel free to use this code for your projects.

---

**Note:** This is a code challenge submission demonstrating ExpressJS + TypeScript backend development with clean architecture patterns.
