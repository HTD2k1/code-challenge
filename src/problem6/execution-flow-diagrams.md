# Live Scoreboard API - Execution Flow Diagram

## System Architecture Flow

```mermaid
graph TB
    subgraph "Client Layer"
        A[User Action] --> B[Frontend App]
        B --> C[API Request]
        B --> D[WebSocket Connection]
    end
    
    subgraph "API Gateway"
        E[Load Balancer] --> F[Rate Limiter]
        F --> G[Authentication Middleware]
    end
    
    subgraph "Core Services"
        H[Scoreboard Service]
        I[Authentication Service]
        J[WebSocket Service]
        K[Audit Logging Service]
    end
    
    subgraph "Data Layer"
        L[(PostgreSQL)]
        M[(Redis Cache)]
        N[Redis Pub/Sub]
    end
    
    subgraph "External Systems"
        O[Monitoring]
        P[Analytics]
    end
    
    C --> E
    D --> J
    G --> H
    G --> I
    H --> L
    H --> M
    H --> K
    J --> N
    H --> N
    K --> O
    H --> P
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style H fill:#f3e5f5
    style L fill:#fff3e0
    style M fill:#fff3e0
```

## Score Update Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API Gateway
    participant Auth as Auth Service
    participant Score as Scoreboard Service
    participant DB as Database
    participant Cache as Redis Cache
    participant WS as WebSocket Service
    participant Clients as Connected Clients
    
    U->>F: Completes Action
    F->>API: POST /api/v1/scores/update
    API->>API: Rate Limiting Check
    API->>Auth: Validate JWT Token
    Auth-->>API: Token Valid
    API->>Score: Process Score Update
    
    Score->>Score: Validate Input Data
    Score->>DB: Begin Transaction
    Score->>DB: Get Current Score
    Score->>DB: Update User Score
    Score->>DB: Update Leaderboard Rank
    Score->>DB: Log Score Update
    Score->>DB: Commit Transaction
    
    Score->>Cache: Update Cache
    Score->>WS: Broadcast Update
    WS->>Clients: Send Score Update
    
    Score-->>API: Success Response
    API-->>F: Score Updated
    F->>U: Show Updated Score
```

## Security Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B{Rate Limit Check}
    B -->|Exceeded| C[Return 429 Error]
    B -->|OK| D{JWT Token Valid?}
    D -->|Invalid| E[Return 401 Error]
    D -->|Valid| F{User Authorized?}
    F -->|No| G[Return 403 Error]
    F -->|Yes| H{Input Validation}
    H -->|Invalid| I[Return 400 Error]
    H -->|Valid| J{Duplicate Action?}
    J -->|Yes| K[Return 409 Error]
    J -->|No| L{Score Increment Valid?}
    L -->|Invalid| M[Return 400 Error]
    L -->|Valid| N[Process Score Update]
    N --> O[Log Audit Trail]
    O --> P[Return Success]
    
    style C fill:#ffebee
    style E fill:#ffebee
    style G fill:#ffebee
    style I fill:#ffebee
    style K fill:#ffebee
    style M fill:#ffebee
    style P fill:#e8f5e8
```

## Real-time Update Flow

```mermaid
graph LR
    subgraph "Score Update Process"
        A[Score Updated] --> B[Database Transaction]
        B --> C[Cache Update]
        C --> D[Publish to Redis Pub/Sub]
    end
    
    subgraph "WebSocket Broadcasting"
        D --> E[WebSocket Service]
        E --> F[Filter Subscribers]
        F --> G[Send to Leaderboard Subscribers]
        F --> H[Send to User Subscribers]
        F --> I[Send to Rank Change Subscribers]
    end
    
    subgraph "Client Updates"
        G --> J[Update Leaderboard UI]
        H --> K[Update User Score UI]
        I --> L[Show Rank Change Notification]
    end
    
    style A fill:#e3f2fd
    style D fill:#f3e5f5
    style J fill:#e8f5e8
    style K fill:#e8f5e8
    style L fill:#e8f5e8
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Request Received] --> B{Validation Errors?}
    B -->|Yes| C[Return 400 with Details]
    B -->|No| D{Auth Errors?}
    D -->|Yes| E[Return 401/403]
    D -->|No| F{Rate Limit Exceeded?}
    F -->|Yes| G[Return 429 with Retry-After]
    F -->|No| H{Business Logic Errors?}
    H -->|Yes| I[Return 409/422]
    H -->|No| J{System Errors?}
    J -->|Yes| K[Return 500 with Error ID]
    J -->|No| L[Return Success Response]
    
    C --> M[Log Error]
    E --> M
    G --> M
    I --> M
    K --> M
    M --> N[Send to Monitoring]
    
    style C fill:#ffebee
    style E fill:#ffebee
    style G fill:#ffebee
    style I fill:#ffebee
    style K fill:#ffebee
    style L fill:#e8f5e8
```

## Database Schema Relationships

```mermaid
erDiagram
    USERS {
        uuid user_id PK
        string username
        string email
        timestamp created_at
        timestamp updated_at
    }
    
    USER_SCORES {
        uuid user_id PK,FK
        bigint current_score
        int rank
        timestamp last_updated
        timestamp created_at
    }
    
    SCORE_UPDATES {
        uuid log_id PK
        uuid user_id FK
        string action_id
        int score_increment
        bigint previous_score
        bigint new_score
        timestamp timestamp
        string ip_address
        json action_metadata
    }
    
    ACTIONS {
        string action_id PK
        string action_type
        int point_value
        json validation_rules
        boolean is_active
    }
    
    USERS ||--|| USER_SCORES : has
    USERS ||--o{ SCORE_UPDATES : generates
    ACTIONS ||--o{ SCORE_UPDATES : triggers
```

## Performance Monitoring Flow

```mermaid
graph TB
    subgraph "Metrics Collection"
        A[API Response Time] --> E[Metrics Aggregator]
        B[Database Query Time] --> E
        C[WebSocket Connection Count] --> E
        D[Rate Limit Hits] --> E
    end
    
    subgraph "Alerting"
        E --> F{Threshold Exceeded?}
        F -->|Yes| G[Send Alert]
        F -->|No| H[Continue Monitoring]
    end
    
    subgraph "Dashboards"
        E --> I[Real-time Dashboard]
        E --> J[Historical Analytics]
        E --> K[Performance Reports]
    end
    
    style G fill:#ffebee
    style I fill:#e8f5e8
    style J fill:#e8f5e8
    style K fill:#e8f5e8
```
