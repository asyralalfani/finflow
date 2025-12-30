# 💰 Finance Manager

A modern, full-stack finance management application built with Next.js, Prisma, and PostgreSQL.

## ✨ Features

- 👤 User authentication (Register/Login)
- 💰 Income & Expense tracking
- 🏦 Multiple bank accounts
- 📊 Transaction management
- 🎨 7 beautiful themes
- 📱 Responsive design
- 🔒 Secure with JWT authentication

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Auth:** JWT with bcrypt

## 🚀 Quick Start (Development)

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Installation

1. Clone repository:
\`\`\`bash
git clone https://github.com/asyralalfani/finflow.git
cd finflow
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Setup environment:
\`\`\`bash
cp .env.example .env
# Edit .env with your settings
\`\`\`

4. Start database:
\`\`\`bash
cd ..
docker-compose up -d
\`\`\`

5. Run migrations:
\`\`\`bash
cd app
npx prisma generate
npx prisma db push
\`\`\`

6. Start development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open http://localhost:3000

## 📦 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete production setup guide.

## 📝 License

MIT
