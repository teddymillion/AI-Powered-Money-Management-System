# ስሙኒ ዋሌት — AI-Powered Money Management

<div align="center">

<img src="public/favicon.png" alt="ስሙኒ ዋሌት" width="80" height="80" style="border-radius:16px" />

### The smartest personal finance platform built for Ethiopia

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## Overview

**ስሙኒ ዋሌት** (Simuni Wallet) is a full-stack, AI-powered personal finance management system designed specifically for Ethiopian users. It combines real-time transaction tracking, intelligent AI insights powered by **Llama 3.3**, budget goal management, and live notifications — all denominated in **Ethiopian Birr (ETB)**.

---

## Screenshots

> Landing Page
![Landing Page](public/simuni%20wallet.png)

---

## Features

### Core
- **AI Financial Insights** — Llama 3.3 (via Groq) analyses spending patterns and delivers personalised recommendations
- **Transaction Management** — Add, filter, and categorise income & expenses with full history
- **Budget Goals** — Set savings targets, track progress with visual indicators
- **Advanced Analytics** — Interactive charts across weekly, monthly, and yearly timeframes
- **AI Chat Assistant** — Ask anything about your finances and get instant context-aware answers

### Real-Time
- **Live Notifications via SSE** — Server-Sent Events push notifications instantly when transactions are added, no polling required
- **Unread badge** — Animated red pulse badge on new real-time events

### Auth & Security
- **JWT Authentication** — Stateless, secure token-based auth
- **OTP Email Verification** — Two-step login with time-limited OTP codes
- **Password Reset Flow** — Secure token-based password recovery via email
- **AES-256 Encrypted Storage** — All sensitive data encrypted at rest
- **Avatar Upload** — Profile photo upload with Multer (2MB limit, images only)

### UX
- **Dark / Light Mode** — Persistent theme toggle
- **ETB Native** — All amounts in Ethiopian Birr with local context
- **Fully Responsive** — Mobile-first design across all screen sizes
- **Amharic UI** — Key branding and copy in Amharic

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework, SSR/CSR |
| TypeScript 5.7 | Type safety |
| Tailwind CSS 4 | Styling |
| Radix UI | Accessible component primitives |
| Recharts | Analytics charts |
| Lucide React | Icons |
| Framer Motion | Animations |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Groq SDK (Llama 3.3) | AI insights & chat |
| JWT + bcryptjs | Auth & password hashing |
| Nodemailer | OTP & reset emails |
| Multer | Avatar file uploads |
| SSE (Server-Sent Events) | Real-time notifications |

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── dashboard/          # Main dashboard
│   ├── transactions/       # Transaction history
│   ├── analytics/          # Charts & analytics
│   ├── budget/             # Budget goals
│   ├── assistant/          # AI chat
│   ├── profile/            # User profile
│   ├── login/              # Auth (login/register)
│   ├── reset-password/     # Password reset
│   ├── about/              # About page
│   └── terms/              # Terms of service
│
├── components/
│   ├── dashboard/          # Dashboard widgets
│   ├── layout/             # Header, sidebar, layout
│   ├── notifications/      # Real-time notification panel
│   ├── transaction/        # Add/view transaction modals
│   └── ui/                 # Radix-based UI primitives
│
├── lib/
│   ├── api.ts              # Typed API client
│   ├── auth-context.tsx    # Auth state (React context)
│   ├── categories.ts       # Transaction categories
│   └── finance.ts          # Finance utility functions
│
├── public/
│   ├── favicon.png         # App icon
│   ├── teddy.jpg           # Developer photo
│   └── simuni wallet.png   # Brand image
│
└── server/
    └── src/
        ├── models/         # Mongoose models (User, Transaction, Goal)
        ├── routes/         # Express route handlers
        │   ├── auth.js     # Register, login, OTP, reset
        │   ├── transactions.js
        │   ├── profile.js  # Profile, avatar, notifications + SSE
        │   ├── goals.js
        │   ├── summary.js
        │   ├── ai.js       # AI insights
        │   └── chat.js     # AI chat
        ├── middleware/
        │   └── auth.js     # JWT requireAuth middleware
        └── index.js        # Express app entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Gmail account for Nodemailer OTP emails

### 1. Clone the repository

```bash
git clone https://github.com/teddymillion/AI-Powered-Money-Management-System.git
cd AI-Powered-Money-Management-System
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure frontend environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Configure backend environment

```bash
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/simuni-wallet
JWT_SECRET=your_super_secret_jwt_key
CLIENT_ORIGIN=http://localhost:3000

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Nodemailer (Gmail)
MAIL_USER=your_gmail@gmail.com
MAIL_PASS=your_gmail_app_password
```

### 6. Run the development servers

In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Real-Time Notifications

Notifications are delivered instantly via **Server-Sent Events (SSE)**:

1. User connects to `GET /profile/notifications/stream?token=<jwt>`
2. Server holds the connection open and streams events as they happen
3. When a transaction is added, the server pushes a notification to the connected client immediately
4. The bell icon shows an animated red pulse badge for new real-time events
5. A 25-second heartbeat keeps the connection alive through proxies

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login/request-otp` | Login step 1 — request OTP |
| POST | `/auth/login/verify-otp` | Login step 2 — verify OTP |
| POST | `/auth/forgot-password` | Request password reset email |
| POST | `/auth/reset-password` | Reset password with token |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | List transactions (filterable) |
| POST | `/transactions` | Add transaction + push notification |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get current user profile |
| PATCH | `/profile` | Update name/email |
| POST | `/profile/avatar` | Upload avatar image |
| POST | `/profile/change-password` | Change password |
| GET | `/profile/notifications` | Get all notifications |
| GET | `/profile/notifications/stream` | SSE real-time stream |
| PATCH | `/profile/notifications/:id/read` | Mark one as read |
| PATCH | `/profile/notifications/read-all` | Mark all as read |
| DELETE | `/profile/account` | Delete account |

### AI
| Method | Endpoint | Description |
|---|---|---|
| GET | `/ai-insights` | Get AI spending analysis |
| POST | `/ai-chat` | Chat with AI assistant |
| GET | `/summary` | Financial summary |

### Goals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/goals` | List budget goals |
| POST | `/goals` | Create goal |
| PATCH | `/goals/:id` | Update goal |
| DELETE | `/goals/:id` | Delete goal |

---

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel — zero config with Next.js
```

### Backend (Railway / Render)
```bash
cd server
npm start
```

Set all environment variables in your hosting dashboard.

---

## Developer

<div align="center">

**Tewodros Million (BoB)**
Software Engineer · Future Founder

[![GitHub](https://img.shields.io/badge/GitHub-teddymillion-black?style=flat-square&logo=github)](https://github.com/teddymillion)
[![Telegram](https://img.shields.io/badge/Telegram-@Lataxv72-2AABEE?style=flat-square&logo=telegram)](https://t.me/Lataxv72)
[![Gmail](https://img.shields.io/badge/Gmail-tedrosmilion19-EA4335?style=flat-square&logo=gmail)](mailto:tedrosmilion19@gmail.com)
[![Phone](https://img.shields.io/badge/Phone-+251947134309-25D366?style=flat-square&logo=whatsapp)](tel:+251947134309)

*Built with Teddy in Ethiopia*

</div>

---

## License

MIT © 2025 Tewodros Million. All rights reserved.
