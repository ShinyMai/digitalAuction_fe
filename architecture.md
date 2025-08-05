# Digital Auction Frontend - Data Flow Architecture

## 🔄 Main Data Flow Overview

```mermaid
graph TB
    subgraph "👤 User Interface Layer"
        USER[User Interactions<br/>Click, Submit, Navigate]
        UI[React Components<br/>Pages & UI Elements]
    end

    subgraph "🧠 Application Logic Layer"
        ROUTER[React Router<br/>Navigation Control]
        STORE[Redux Store<br/>Global State Management]
        AUTH[Authentication State<br/>User Info & Permissions]
    end

    subgraph "🔗 Service Layer"
        SERVICES[API Services<br/>Business Logic]
        HTTP[HTTP Client<br/>Axios Interceptors]
    end

    subgraph "🌐 External Systems"
        API[Backend REST API<br/>Database Operations]
        REALTIME[SignalR Hub<br/>Real-time Events]
        EKYC[eKYC Service<br/>Identity Verification]
        PAYMENT[Payment Gateway<br/>Transaction Processing]
    end

    %% Main Data Flow
    USER -->|1. User Action| UI
    UI -->|2. Navigate| ROUTER
    UI -->|3. Dispatch Action| STORE
    STORE -->|4. Update State| AUTH
    STORE -->|5. Call Service| SERVICES
    SERVICES -->|6. HTTP Request| HTTP
    HTTP -->|7. API Call| API
    API -->|8. Response Data| HTTP
    HTTP -->|9. Process Response| SERVICES
    SERVICES -->|10. Update Store| STORE
    STORE -->|11. State Changes| UI
    UI -->|12. UI Update| USER

    %% Additional Flows
    AUTH -->|Role-based Access| ROUTER
    REALTIME -.->|Real-time Events| UI
    REALTIME -.->|Auction Updates| STORE
    UI -->|Identity Verification| EKYC
    UI -->|Payment Request| PAYMENT
    EKYC -->|Verification Result| STORE
    PAYMENT -->|Payment Status| STORE

    style USER fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style STORE fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style API fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style REALTIME fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

## 📊 Detailed Data Flow by Feature

```mermaid
graph LR
    subgraph "🔐 Authentication Flow"
        A1[Login Form] -->|Credentials| A2[Auth Service]
        A2 -->|POST /login| A3[Backend API]
        A3 -->|JWT Token + User Info| A2
        A2 -->|Store User Data| A4[Redux Auth State]
        A4 -->|Route Protection| A5[Protected Pages]
    end

    subgraph "🔨 Auction Bidding Flow"
        B1[Bid Component] -->|Bid Amount| B2[Auction Service]
        B2 -->|POST /bid| B3[Backend API]
        B3 -->|Bid Confirmation| B2
        B2 -->|Update Bid History| B4[Redux Store]
        B5[SignalR] -.->|Real-time Bid Updates| B1
        B4 -->|State Change| B1
    end

    subgraph "💳 Payment Flow"
        C1[Payment Form] -->|Payment Data| C2[Payment Service]
        C2 -->|Process Payment| C3[Sepay Gateway]
        C3 -->|Payment Result| C2
        C2 -->|Update Transaction| C4[Backend API]
        C4 -->|Confirmation| C2
        C2 -->|Update UI| C1
    end

    subgraph "🆔 eKYC Verification Flow"
        D1[eKYC Component] -->|Document Data| D2[VNPT eKYC SDK]
        D2 -->|Verification Request| D3[VNPT Server]
        D3 -->|Verification Result| D2
        D2 -->|Result Data| D4[User Service]
        D4 -->|Update Profile| D5[Backend API]
        D5 -->|Success| D1
    end

    style A1 fill:#ffebee,stroke:#c62828
    style B1 fill:#e8f5e8,stroke:#2e7d32
    style C1 fill:#fff3e0,stroke:#ef6c00
    style D1 fill:#e3f2fd,stroke:#1565c0
```

## 🔄 Complete Application Data Flow

```mermaid
sequenceDiagram
    participant 👤 as User
    participant 🖥️ as React Component
    participant 🧠 as Redux Store
    participant 🔗 as API Service
    participant 🌐 as Backend API
    participant 📡 as SignalR Hub
    participant 💾 as Local Storage

    Note over 👤,💾: Initial App Load
    👤->>🖥️: Open Application
    🖥️->>💾: Check Stored Token
    💾-->>🖥️: Return JWT Token
    🖥️->>🧠: Load Auth State
    🧠-->>🖥️: User Info & Permissions
    🖥️-->>👤: Render Appropriate UI

    Note over 👤,💾: User Authentication
    👤->>🖥️: Enter Login Credentials
    🖥️->>🔗: Call Auth Service
    🔗->>🌐: POST /auth/login
    🌐-->>🔗: JWT Token + User Data
    🔗->>🧠: Update Auth State
    🔗->>💾: Store Token
    🧠-->>🖥️: State Change
    🖥️-->>👤: Redirect to Dashboard

    Note over 👤,💾: Standard API Operation
    👤->>🖥️: Perform Action (Submit Form)
    🖥️->>🧠: Dispatch Action
    🧠->>🔗: Call Appropriate Service
    🔗->>🌐: HTTP Request with Auth
    🌐-->>🔗: Response Data
    🔗->>🧠: Update Store State
    🧠-->>🖥️: Notify Components
    🖥️-->>👤: Update UI

    Note over 👤,💾: Real-time Updates
    📡->>🖥️: Auction Event (New Bid)
    🖥️->>🧠: Update Real-time State
    🧠-->>🖥️: Trigger Re-render
    🖥️-->>👤: Show Live Updates

    Note over 👤,💾: Error Handling
    🌐-->>🔗: Error Response
    🔗->>🧠: Dispatch Error Action
    🧠-->>🖥️: Error State
    🖥️-->>👤: Show Error Message
```

## 🎯 State Management Flow

```mermaid
graph TD
    subgraph "🖥️ UI Components"
        COMP[React Components<br/>Forms, Lists, Modals]
        EVENTS[User Events<br/>Click, Submit, Input]
    end

    subgraph "🧠 Redux Store"
        ACTIONS[Redux Actions<br/>Login, Logout, Bid, etc.]
        REDUCERS[Reducers<br/>Auth, User, Auction]
        STATE[Global State<br/>Current User, Permissions, Data]
    end

    subgraph "🔗 Side Effects"
        THUNKS[Redux Thunks<br/>Async Operations]
        SERVICES[API Services<br/>HTTP Calls]
    end

    subgraph "💾 Persistence"
        LOCALSTORAGE[Local Storage<br/>JWT Token, User Prefs]
        SESSIONSTORAGE[Session Storage<br/>Temporary Data]
    end

    subgraph "🌐 External APIs"
        BACKEND[Backend REST API]
        REALTIME[SignalR Events]
        THIRDPARTY[eKYC, Payment APIs]
    end

    %% Main Flow
    EVENTS -->|1. Trigger| ACTIONS
    ACTIONS -->|2. Dispatch| REDUCERS
    REDUCERS -->|3. Update| STATE
    STATE -->|4. Subscribe| COMP

    %% Async Operations
    ACTIONS -->|5. Async Action| THUNKS
    THUNKS -->|6. API Call| SERVICES
    SERVICES -->|7. HTTP Request| BACKEND
    BACKEND -->|8. Response| SERVICES
    SERVICES -->|9. Success/Error| THUNKS
    THUNKS -->|10. Dispatch Result| ACTIONS

    %% Additional Flows
    REALTIME -.->|Real-time Data| ACTIONS
    THUNKS -->|Identity Check| THIRDPARTY
    THIRDPARTY -->|Verification Result| THUNKS
    STATE -->|Save Token| LOCALSTORAGE
    STATE -->|Save Session| SESSIONSTORAGE
    LOCALSTORAGE -->|Load on Init| STATE

    style COMP fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style STATE fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style BACKEND fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style REALTIME fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

## 🎯 Role-Based Access & Data Control

```mermaid
graph TB
    subgraph "👥 User Roles"
        GUEST[🔓 Guest<br/>View Only]
        CUSTOMER[👤 Customer<br/>Bid & Profile]
        STAFF[👨‍💼 Staff<br/>User Support]
        ADMIN[👨‍💻 Admin<br/>System Control]
        MANAGER[📊 Manager<br/>Analytics]
        AUCTIONEER[🔨 Auctioneer<br/>Auction Control]
    end

    subgraph "🔐 Route Protection"
        AUTHCHECK{Authentication<br/>Check}
        ROLECHECK{Role<br/>Validation}
        ROUTEGUARD[Route Guard<br/>Access Control]
    end

    subgraph "📄 Data Access Levels"
        PUBLIC[🌍 Public Data<br/>Auction Listings<br/>News & Info]
        USER[👤 User Data<br/>Profile, Bids<br/>Personal Info]
        STAFF_DATA[👨‍💼 Staff Data<br/>User Support<br/>Basic Reports]
        ADMIN_DATA[👨‍💻 Admin Data<br/>User Management<br/>System Config]
        MANAGER_DATA[📊 Manager Data<br/>Analytics<br/>Business Reports]
        AUCTION_DATA[🔨 Auction Data<br/>Control Panel<br/>Real-time Management]
    end

    %% User Role Flow
    GUEST --> AUTHCHECK
    CUSTOMER --> AUTHCHECK
    STAFF --> AUTHCHECK
    ADMIN --> AUTHCHECK
    MANAGER --> AUTHCHECK
    AUCTIONEER --> AUTHCHECK

    %% Authentication & Authorization Flow
    AUTHCHECK -->|Authenticated| ROLECHECK
    AUTHCHECK -->|Not Authenticated| PUBLIC
    ROLECHECK -->|Valid Role| ROUTEGUARD

    %% Data Access Control
    ROUTEGUARD -->|Guest/Customer| PUBLIC
    ROUTEGUARD -->|Customer| USER
    ROUTEGUARD -->|Staff| STAFF_DATA
    ROUTEGUARD -->|Admin| ADMIN_DATA
    ROUTEGUARD -->|Manager| MANAGER_DATA
    ROUTEGUARD -->|Auctioneer| AUCTION_DATA

    style GUEST fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style CUSTOMER fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style STAFF fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    style ADMIN fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style MANAGER fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style AUCTIONEER fill:#e0f2f1,stroke:#004d40,stroke-width:2px
```

## 📋 Data Flow Summary

| Flow Type                    | Source                                    | Destination           | Method           | Purpose                             |
| ---------------------------- | ----------------------------------------- | --------------------- | ---------------- | ----------------------------------- |
| **🔐 Authentication**        | Login Form → Auth Service → Backend       | Redux Store           | POST /auth/login | User authentication & token storage |
| **🔨 Auction Bidding**       | Bid Component → Auction Service → Backend | Redux Store + SignalR | POST /bid        | Place bid & real-time updates       |
| **💳 Payment**               | Payment Form → Payment Service → Gateway  | Backend API           | POST /payment    | Process transactions                |
| **🆔 Identity Verification** | eKYC Component → VNPT SDK → VNPT Server   | User Service          | POST /verify     | Document verification               |
| **📡 Real-time Updates**     | SignalR Hub → Components                  | Redux Store           | WebSocket        | Live auction data                   |
| **🔔 Notifications**         | Backend Events → SignalR → Components     | UI State              | WebSocket        | User notifications                  |
| **🛡️ Route Protection**      | Route Guard → Redux Store                 | Components            | State Check      | Access control                      |

## 📦 Package Diagram - Frontend Module Structure

```mermaid
graph TB
    subgraph "🎯 Application Core"
        APP[App.tsx]
        MAIN[main.tsx]
    end

    subgraph "📄 Pages"
        PAGES[Page Components<br/>Anonymous, User, Admin<br/>Staff, Manager, Auctioneer]
    end

    subgraph "🧩 Components"
        COMPONENTS[Shared Components<br/>Common, Forms, Modals<br/>Notifications, etc.]
    end

    subgraph "🎨 Layouts"
        LAYOUTS[Layout Templates<br/>Anonymous Layout<br/>Company Layout]
    end

    subgraph "🔧 Services"
        SERVICES[API Services<br/>Auth, User, Auction<br/>News, Notifications]
    end

    subgraph "💾 State"
        STATE[State Management<br/>Redux Store<br/>Auth State]
    end

    subgraph "🛣️ Routing"
        ROUTING[Route Management<br/>App Routes<br/>Role-based Routes]
    end

    subgraph "🛠️ Utils"
        UTILS[Utilities<br/>Hooks, Types<br/>Helpers, Styles]
    end

    subgraph "🌐 External"
        EXTERNAL[External Libraries<br/>eKYC SDK, SignalR<br/>Socket.IO, Payment]
    end

    %% Dependencies
    MAIN --> APP
    APP --> STATE
    APP --> ROUTING

    ROUTING --> PAGES
    PAGES --> LAYOUTS
    PAGES --> COMPONENTS
    PAGES --> SERVICES

    COMPONENTS --> UTILS
    SERVICES --> STATE
    SERVICES --> UTILS

    COMPONENTS --> EXTERNAL
    SERVICES --> EXTERNAL

    style APP fill:#ff6b6b,stroke:#333,stroke-width:3px
    style STATE fill:#4ecdc4,stroke:#333,stroke-width:2px
    style SERVICES fill:#96ceb4,stroke:#333,stroke-width:2px
    style EXTERNAL fill:#ffaaa5,stroke:#333,stroke-width:2px
```

## 🔗 Architecture Layers

```mermaid
graph LR
    PRESENTATION[📱 Presentation Layer<br/>Pages, Components, Layouts]
    BUSINESS[🧠 Business Layer<br/>State, Routing, Hooks]
    SERVICE[🔧 Service Layer<br/>API Services, Utils]
    EXTERNAL[🌐 External Layer<br/>Backend, SDKs, Libraries]

    PRESENTATION --> BUSINESS
    BUSINESS --> SERVICE
    SERVICE --> EXTERNAL

    style PRESENTATION fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style BUSINESS fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style SERVICE fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style EXTERNAL fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```
