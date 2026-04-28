df# Link Thread Project

A modern, interactive web application for creating and engaging with link-based threads. Users can share links, generate rich previews, and participate in discussions through a streamlined commenting system.

## ✨ Features

- **Link-Based Threads**: Create discussion threads centered around specific URLs.
- **Rich Link Previews**: Automatically generate visual previews (cards) for shared links using a dedicated parsing utility.
- **Interactive Commenting**: Engage with threads through a structured commenting system.
- **User Authentication**: Secure access and personalized experiences powered by NextAuth.js.
- **User Profiles**: Dedicated profile pages to manage user-specific interactions and comments.
- **Responsive Design**: A seamless experience across all devices, built with Tailwind CSS.

## 🤖 Agent Instructions

This section is specifically designed to guide AI agents in maintaining and extending this codebase.

### 🛠️ Primary Development Workflows

- **Adding a new API Endpoint**:
  1. Identify the appropriate category in `app/api/`.
  2. Create a new route directory and a `route.ts` file.
  3. Use `prisma` to update the schema if new data models are required.
  4. **Crucial**: After updating `prisma/schema.prisma`, run `npm run db:push` to sync the database.

- **Creating a new UI Component**:
  1. Place the new component in the `components/` directory.
  *   Use **Tailwind CSS** for all styling.
  *   Ensure the component is exported as a default or named export as per project convention.

- **Modifying Database Schema**:
  1. Edit `prisma/schema.prisma`.
  2. Run `npm run db:push` to apply changes.
  3. Regenerate the client using `npx prisma generate`.

### ✅ Verification & Validation

Before considering a task complete, an agent should:
1. **Lint the code**: Run `npm run lint` to check for syntax and style errors.
2. **Check Build**: Run `npm run build` to ensure there are no TypeScript or Next.js build-time errors.
3. **Verify Database**: Ensure `prisma/schema.prisma` is in sync with the actual database state using `npm run db:push`.

### 🔍 Codebase Map for Agents

| Purpose | Directory | Key Files |
| :--- | :--- | :--- |
| **API Routes** | `app/api/` | `route.ts` |
| **Page Logic** | `app/` | `page.tsx`, `layout.tsx` |
| **UI Components** | `components/` | `ThreadUI.tsx`, `PreviewCard.tsx` |
| **Database Schema** | `prisma/` | `schema.prisma` |
| **Utility Logic** | `lib/` | `url-parser.ts`, `prisma.ts` |
| **Type Definitions**| `types/` | `*.ts` |

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: PostgreSQL (Recommended)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn
- A running PostgreSQL instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd link-thread-empty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your configuration:
   ```env
   DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/linkthread?schema=public"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   Generate Prisma client and sync your database schema:
   ```bash
   npx prisma generate
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```text
├── app/                # Next.js App Router (Pages & API Routes)
│   ├── api/            # Backend API endpoints (Auth, Comments, Preview, User)
│   ├── profile/        # User profile pages
│                └── layout.tsx      # Global layout
├── components/         # Reusable React components (ThreadUI, PreviewCard, etc.)
├── lib/                # Core utilities (Prisma client, URL parser)
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── types/              # TypeScript type definitions
└── ...
```

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
