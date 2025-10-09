# Live Scoreboard API Module Specification

## Overview

This document specifies an Express.js API module for a live scoreboard that enables real-time updates of user scores with basic security measures to prevent unauthorized score manipulation.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Security Requirements](#security-requirements)
5. [Real-time Updates](#real-time-updates)
6. [Implementation Guidelines](#implementation-guidelines)

## System Architecture

### Core Components

1. **Express.js Server**: Main API server handling all requests
2. **Socket.io**: Real-time WebSocket connections for live updates
3. **Database**: PostgreSQL for storing scores
4. **Redis**: Basic caching and rate limiting
5. **JWT Middleware**: Basic authentication

### Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **WebSocket**: Socket.io
- **Authentication**: JWT tokens
- **Caching**: Redis
- **Rate Limiting**: express-rate-limit

## API Endpoints

### 1. Update User Score

**Endpoint**: `POST /api/scores/update`

**Description**: Updates a user's score after completing an action

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
- `scoreIncrement`: Number (required) - Points to add to user's score
- `actionType`: String (required) - Type of action completed

**Response**:
- `success`: Boolean - Indicates if request was successful
- `userId`: String - User identifier
- `newScore`: Number - Updated total score
- `rank`: Number - Current rank in leaderboard

### 2. Get Leaderboard

**Endpoint**: `GET /api/scores/leaderboard`

**Description**: Retrieves the top 10 users with their scores

**Response**:
- `success`: Boolean - Indicates if request was successful
- `leaderboard`: Array - List of top 10 users with their scores and ranks
  - `userId`: String - User identifier
  - `username`: String - Display name
  - `score`: Number - Current score
  - `rank`: Number - Current rank

### 3. Get User Score

**Endpoint**: `GET /api/scores/user/:userId`

**Description**: Retrieves a specific user's score and rank

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
- `success`: Boolean - Indicates if request was successful
- `userId`: String - User identifier
- `username`: String - Display name
- `score`: Number - Current score
- `rank`: Number - Current rank

### 4. WebSocket Connection (Socket.io)

**Connection**: Client connects to Socket.io server
**Authentication**: Send JWT token on connection

**Server Events**:
- `scoreUpdated`: Broadcast when any user's score changes
- `leaderboardUpdated`: Broadcast when leaderboard changes

**Event Data Structure**:
- `scoreUpdated`: Contains userId, username, newScore, rank
- `leaderboardUpdated`: Contains updated leaderboard array

## Data Models

### User Score Model (PostgreSQL)

**Table**: `user_scores`

**Fields**:
- `id`: SERIAL PRIMARY KEY - Auto-incrementing unique identifier
- `userId`: VARCHAR(255) UNIQUE NOT NULL - User identifier
- `username`: VARCHAR(255) NOT NULL - Display name
- `score`: BIGINT DEFAULT 0 - Current total score
- `rank`: INTEGER DEFAULT 0 - Current rank in leaderboard
- `updatedAt`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP - Last update timestamp

**Indexes**:
- Primary key on `id`
- Unique index on `userId`
- Index on `score` (descending) for leaderboard queries
- Index on `rank` for rank-based queries

### Score Update Log Model

**Table**: `score_update_logs`

**Fields**:
- `id`: SERIAL PRIMARY KEY - Auto-incrementing unique identifier
- `userId`: VARCHAR(255) NOT NULL - User identifier
- `scoreIncrement`: INTEGER NOT NULL - Points added in this update
- `previousScore`: BIGINT NOT NULL - Score before update
- `newScore`: BIGINT NOT NULL - Score after update
- `actionType`: VARCHAR(100) NOT NULL - Type of action that triggered update
- `timestamp`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP - When update occurred
- `ipAddress`: INET - Client IP address

**Indexes**:
- Primary key on `id`
- Index on `userId` for user-specific queries
- Index on `timestamp` for time-based queries
- Composite index on `(userId, timestamp)` for audit queries

**Foreign Key**:
- `userId` references `user_scores.userId`

## Security Requirements

### Authentication & Authorization

1. **JWT Token Validation**: All score update requests must include valid JWT tokens
2. **User Identity Verification**: Verify user identity matches the token
3. **Token Expiration**: Implement proper token expiration

### Rate Limiting

1. **Per-User Rate Limiting**: Maximum 10 score updates per minute per user
2. **Per-IP Rate Limiting**: Maximum 100 requests per minute per IP address

### Input Validation

1. **Score Increment Validation**: 
   - Must be positive integer
   - Maximum increment per request: 1000 points
2. **Action Type Validation**: Must be from allowed action types
3. **User ID Validation**: Must be valid user ID

### Basic Anti-Fraud Measures

1. **Duplicate Action Prevention**: Track and prevent duplicate submissions within 5 minutes
2. **IP Reputation**: Basic IP blocking for known malicious IPs

## Real-time Updates

### Socket.io Implementation

1. **Connection Management**:
   - Authenticate users with JWT tokens
   - Maintain connection state
   - Handle disconnections gracefully

2. **Message Broadcasting**:
   - Broadcast score updates to all connected clients
   - Send leaderboard updates when top 10 changes
   - Emit user-specific rank changes

### Update Triggers

1. **Score Changes**: Broadcast immediately when any user's score updates
2. **Leaderboard Changes**: Broadcast when top 10 positions change
3. **Rank Changes**: Notify users when their rank changes

## Implementation Guidelines

### Express.js Server Setup

**Required Dependencies**:
- express: Web framework
- socket.io: Real-time communication
- jsonwebtoken: JWT token handling
- express-rate-limit: Rate limiting middleware
- pg: PostgreSQL client for Node.js
- redis: Redis client for caching

**Server Configuration**:
- Set up Express application with JSON middleware
- Configure rate limiting (100 requests per 15 minutes per IP)
- Initialize Socket.io server
- Set up JWT authentication middleware

### Database Setup (PostgreSQL)

**Schema Requirements**:
- Create `user_scores` table with userId, username, score, rank, updatedAt fields
- Create `score_update_logs` table for audit trail
- Set up proper indexes for performance optimization
- Configure connection pooling for optimal database performance
- Implement foreign key constraints for data integrity

**Database Configuration**:
- Use connection pooling (recommended pool size: 10-20 connections)
- Configure connection timeout and retry logic
- Set up proper error handling for database operations
- Consider read replicas for leaderboard queries if needed

### API Routes Implementation

**Score Update Endpoint** (`POST /api/scores/update`):
- Validate JWT token and extract userId
- Validate input parameters (scoreIncrement, actionType)
- Update user score in database
- Recalculate ranks for all users
- Broadcast score update via Socket.io
- Return success response with updated score and rank

**Leaderboard Endpoint** (`GET /api/scores/leaderboard`):
- Query database for top 10 users sorted by score using ORDER BY
- Use LIMIT 10 to restrict results
- Return leaderboard array with user details
- Consider caching for performance optimization

**User Score Endpoint** (`GET /api/scores/user/:userId`):
- Validate JWT token
- Query database for specific user's score and rank
- Return user score information

### Socket.io Authentication

**Authentication Middleware**:
- Verify JWT token on connection
- Extract userId from token payload
- Attach userId to socket object for future use
- Handle authentication errors gracefully

**Connection Management**:
- Track connected users
- Handle disconnection events
- Maintain user-specific rooms for targeted updates

### Error Handling

**Error Response Format**:
- Consistent error response structure
- Appropriate HTTP status codes
- Detailed error messages for debugging
- Request ID for tracking

**Error Types**:
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid token)
- 404: Not Found (user not found)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error
