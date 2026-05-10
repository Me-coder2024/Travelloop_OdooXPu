# 🌍 Traveloop — Personalized Travel Planning

A full-stack travel planning application built with Next.js 14, Express, PostgreSQL, and Prisma.

## Team

| Name | Role | Screens |
|------|------|---------|
| **Krish Kumar Gupta** | Backend & Database | DB Schema, API, Seed Data |
| **Aksh Narwani** | Frontend Core | Screens 1-6, 8 |
| **Dixit Malviya** | Frontend Advanced | Screens 7, 9-14 |

## Tech Stack

### Frontend
- Next.js 14 (App Router) · Tailwind CSS v4 · Radix UI · Framer Motion
- React Hook Form + Zod · Recharts · Lucide Icons · Inter font

### Backend
- Node.js / Express · PostgreSQL (local) · Prisma ORM
- JWT (httpOnly cookies) · bcrypt (r=12) · express-validator
- Helmet.js · rate-limiter-flexible

### Dev Quality
- ESLint + Prettier · Husky pre-commit · dotenv · Postman collection

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm

### 1. Clone & Install

```bash
git clone https://github.com/Me-coder2024/Travelloop_OdooXPu.git
cd Travelloop_OdooXPu
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| krish_admin | Password1 | ADMIN |
| aksh_traveler | Password1 | USER |
| dixit_explorer | Password1 | USER |

## Project Structure

```
├── frontend/          ← Next.js 14 App
│   ├── src/app/       ← Pages (14 screens)
│   ├── src/components/← UI + feature components
│   ├── src/hooks/     ← Custom hooks
│   └── src/lib/       ← API client, validators
├── backend/           ← Express API
│   ├── src/controllers/
│   ├── src/services/  ← Business logic
│   ├── src/middlewares/
│   ├── src/routes/
│   └── src/utils/
├── prisma/
│   ├── schema.prisma  ← Full DB schema
│   ├── migrations/    ← Auto-generated
│   └── seed.ts        ← Demo data
└── .env.example
```

## API Documentation

Import the Postman collection from `postman/Traveloop.postman_collection.json` for full API documentation with 40+ endpoints.

## License

MIT
