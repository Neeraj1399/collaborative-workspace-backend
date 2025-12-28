# collaborative-workspace-backend

# 🚀 Collaborative Workspace Backend

A professional, high-performance Node.js backend built for real-time collaboration. This project demonstrates advanced concepts like asynchronous job queuing, Role-Based Access Control (RBAC), and real-time event streaming.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **ORM**: Prisma with PostgreSQL
- **Task Queue**: BullMQ & Redis (Asynchronous Processing)
- **Real-time**: Socket.io (Persistent Handshakes & Events)
- **Security**: JWT (Dual Token Strategy), Helmet, Bcrypt, & Rate Limiting

---

## 🚦 Getting Started

### 1. Prerequisites

Ensure you have the following installed:

- PostgreSQL (Database)
- Redis (Required for the Job Queue)
- Node.js

### 2. Environment Setup

Create a `.env` file in the root directory and configure your credentials:

```text
PORT=3000
DATABASE_URL="postgresql://admin:password123@localhost:5432/workspace_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"
NODE_ENV="development"


Installation & Database Migration

# Install dependencies
npm install

# Setup Database schema
npx prisma generate
npx prisma db push

# Start the server (Development mode)
npm run dev


🐳 Docker Deployment
For a consistent environment, you can run the entire stack using Docker:

docker-compose up --build


🔒 API Documentation & RBACThe API follows strict Role-Based Access Control.EndpointMethodRole RequiredDescription/api/v1/auth/registerPOSTPublicCreate an account/api/v1/auth/loginPOSTPublicObtain JWT tokens/api/v1/projectsPOSTAuthenticatedCreate a new project/api/v1/projects/:idPATCHOWNER / COLLABEdit project details/api/v1/projects/:idDELETEOWNERRemove project/api/v1/projects/:id/runPOSTOWNER / COLLABExecute code (Async Job)



🧠 System Design Choices (Interview Notes)
Mass Assignment Protection: Used destructuring in Services to ensure only specific fields (like name) can be updated, preventing unauthorized data modification.

Async Processing: Implemented BullMQ to handle "Code Run" jobs. This ensures the main API remains responsive while heavy tasks are processed in the background.

Global Error Handling: Implemented a custom AppError class and middleware to distinguish between Operational Errors (trusted) and Programming Errors.

Real-time Feedback: Integrated Socket.io to notify users the moment a background job changes status, avoiding the need for client-side polling.
```
