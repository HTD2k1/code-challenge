# Live Scoreboard API - Execution Flow Diagrams

## System Architecture Flow (Express.js)

```mermaid
graph TB
    subgraph "Client Layer"
        A[User Action] --> B[Frontend App]
        B --> C[API Request]
        B --> D[Socket.io Connection]
    end
    
    subgraph "Express.js Server"
        E[Express App] --> F[Rate Limiter]
        F --> G[JWT Middleware]
        G --> H[Score Routes]
        H --> I[PostgreSQL]
        H --> J[Socket.io Server]
    end
    
    subgraph "Real-time Updates"
        J --> K[Connected Clients]
    end
    
    C --> E
    D --> J
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#fff3e0
```

## Score Update Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as Express Server
    participant DB as PostgreSQL
    participant WS as Socket.io
    participant Clients as Connected Clients
    
    U->>F: Completes Action
    F->>API: POST /api/scores/update
    API->>API: Rate Limiting Check
    API->>API: JWT Validation
    API->>API: Input Validation
    API->>DB: Update User Score
    DB-->>API: Updated Score
    API->>DB: Update Ranks
    API->>WS: Broadcast Update
    WS->>Clients: Send Score Update
    API-->>F: Success Response
    F->>U: Show Updated Score
```

## Security Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B{Rate Limit OK?}
    B -->|No| C[Return 429 Error]
    B -->|Yes| D{JWT Valid?}
    D -->|No| E[Return 401 Error]
    D -->|Yes| F{Input Valid?}
    F -->|No| G[Return 400 Error]
    F -->|Yes| H[Process Score Update]
    H --> I[Return Success]
    
    style C fill:#ffebee
    style E fill:#ffebee
    style G fill:#ffebee
    style I fill:#e8f5e8
```

## Real-time Update Flow (Socket.io)

```mermaid
graph LR
    subgraph "Score Update Process"
        A[Score Updated] --> B[PostgreSQL Update]
        B --> C[Socket.io Broadcast]
    end
    
    subgraph "Client Updates"
        C --> D[Update Leaderboard UI]
        C --> E[Update User Score UI]
        C --> F[Show Rank Change]
    end
    
    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#e8f5e8
    style F fill:#e8f5e8
```

## Database Schema (PostgreSQL)

```mermaid
erDiagram
    USER_SCORES {
        serial id PK
        varchar userId UK
        varchar username
        bigint score
        integer rank
        timestamp updatedAt
    }
    
    SCORE_UPDATE_LOGS {
        serial id PK
        varchar userId FK
        integer scoreIncrement
        bigint previousScore
        bigint newScore
        varchar actionType
        timestamp timestamp
        inet ipAddress
    }
    
    USER_SCORES ||--o{ SCORE_UPDATE_LOGS : generates
```

## Express.js Implementation Flow

```mermaid
graph TB
    subgraph "Server Setup"
        A[Express App] --> B[Middleware]
        B --> C[Routes]
        C --> D[Socket.io]
    end
    
    subgraph "Middleware Stack"
        E[express.json] --> F[rate-limit]
        F --> G[jwt-auth]
        G --> H[cors]
    end
    
    subgraph "Route Handlers"
        I[POST /api/scores/update] --> J[Validate Input]
        J --> K[Update Database]
        K --> L[Broadcast Update]
        M[GET /api/scores/leaderboard] --> N[Query Database]
        N --> O[Return Top 10]
    end
    
    B --> E
    I --> K
    M --> N
    
    style A fill:#e3f2fd
    style D fill:#f3e5f5
    style K fill:#fff3e0
```
