# AdsPolisher Backend API 🚀

This is the production-ready, high-performance Express + TypeScript backend for **AdsPolisher**. It utilizes **Prisma ORM** with the **Neon Serverless Driver** for optimized database operations and **Better-Auth** for secure authentication. 

The entire application is architected to run seamlessly on **Vercel Serverless Functions**, providing 100% free hosting, high scalability, and eliminating cold starts without requiring manual pinging services.

---

## 🏗️ Project Architecture & Structure

The repository maintains a clean separation between the standalone local development entry point and the stateless serverless production handler:

```text
adspolisher-api/
├── prisma/
│   ├── schema.prisma      # Database schema definitions
│   └── migrations/        # SQL migration logs
├── src/
│   ├── config/
│   │   └── db.ts          # Database client wrapper (Singleton Pattern)
│   ├── routes/
│   │   └── index.route.ts # Core API routing orchestration
│   ├── app.ts             # Express core instance (Serverless Entry Point)
│   └── server.ts          # Local development server hook (App listener)
├── package.json           # Scripts, dependencies, and build bindings
└── vercel.json            # Vercel deployment and routing orchestration
```

---

## 🛠️ Configuration Files

### 1. Vercel Configuration (`vercel.json`)
Located at the root of the project, this file instructs Vercel to intercept all incoming API traffic and route it dynamically through the Express application via the `@vercel/node` compiler:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.ts"
    }
  ]
}
```

### 2. Package Automation Scripts (`package.json`)
Ensure your `package.json` contains the `vercel-build` hook. This ensures Vercel automatically compiles your TypeScript bindings and generates the updated Prisma Client binaries on every remote build:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "bun run --hot src/server.ts",
  "vercel-build": "prisma generate"
}
```

---

## 🚀 Deployment Guide

### Step 1: Push Changes to GitHub
Commit your updated code along with the `vercel.json` and updated database client structures, then push it to your repository:
```bash
git add .
git commit -m "chore: setup vercel serverless orchestration"
git push origin main
```

### Step 2: Import Project on Vercel
1. Go to your [Vercel Dashboard](https://vercel.com) and click **Add New** -> **Project**.
2. Import your standalone backend repository (`adspolisher-api`).
3. Leave the **Framework Preset** as **Other** (Vercel automatically detects and follows your `vercel.json`).

### Step 3: Configure Environment Variables
Before clicking deploy, expand the **Environment Variables** section and register these required production keys:

* **`DATABASE_URL`**: Your production Neon PostgreSQL connection URI.
* **`WEB_ORIGIN`**: Your production frontend domain addresses allowed by CORS (e.g., `https://adspolisher.com, https://adspolisher.com`).
* **`BETTER_AUTH_SECRET`**: Randomly generated secret string used by your authentication layer.

Click **Deploy**. Your API will be live on a default Vercel domain (e.g., `https://vercel.app`).

---

## 🔁 Continuous Integration & Custom Subdomain

### 1. Automated Redeployments on Commits
Continuous Deployment (CD) is fully automated out of the box. Every time a new commit is pushed to your connected branch via `git push origin main`, Vercel intercepts the webhook, builds the codebase seamlessly in the background, and flips the router onto the new instance with **Zero Downtime**.

### 2. Linking Custom Subdomain (`://adspolisher.com`)
1. In your Vercel Backend Project dashboard, navigate to **Settings** -> **Domains**.
2. Add your custom API subdomain: `://adspolisher.com`.
3. Log into your Domain Registrar dashboard (e.g., Hostinger, GoDaddy, Namecheap) and add the following target record to your DNS zone file:

| Record Type | Host / Name | Value / Points To |
| :--- | :--- | :--- |
| **CNAME** | `api` | `://vercel-dns.com` |

Once DNS propagation completes (usually within 10-15 minutes), your live client application can communicate securely across the domain boundary using `https://://adspolisher.com/api/v1`.
