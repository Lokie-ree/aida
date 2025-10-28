Certainly\! Here’s a summary of best practices for configuring your environments when deploying a Vite app with Convex and Better Auth on Vercel, based strictly on the official documentation:

---

## **1\. Convex Deployments**

* **Development Deployment:**

  * Created automatically when you run `npx convex dev` for the first time.  
  * Each team member gets their own dev deployment.  
  * Environment variables for dev are set in the Convex dashboard under the dev deployment.  
  * The dev deployment URL is written to `.env.local` or `.env` for your frontend to use [Project Configuration](https://docs.convex.dev/production/project-configuration).  
* **Production Deployment:**

  * Deploy to production with `npx convex deploy`.  
  * Set production environment variables in the Convex dashboard under the production deployment.  
  * The production deployment URL should be set in your frontend’s production environment variables [Project Configuration](https://docs.convex.dev/production/project-configuration).  
* **Preview Deployments (Recommended for PRs):**

  * Set up by generating a Preview Deploy Key in the Convex dashboard and configuring it in Vercel for the Preview environment.  
  * Each preview deployment gets its own isolated Convex backend, allowing you to safely test changes before merging [Preview Deployments](https://docs.convex.dev/production/hosting/vercel#preview-deployments).

---

## **2\. Vercel Environment Variables**

* **Production Environment:**

  * Set `CONVEX_DEPLOY_KEY` to your Convex production deploy key.  
  * Set frontend variables (e.g., `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`, `SITE_URL`) to point to your production Convex deployment and site URL.  
* **Preview Environment:**

  * Set `CONVEX_DEPLOY_KEY` to your Convex preview deploy key (generated in the Convex dashboard).  
  * Set frontend variables as above, but Vercel will inject the correct preview URLs for each deployment.  
* **Development Environment:**

  * For local development, use `.env.local` with your dev deployment URLs and any other dev-specific variables.

---

## **3\. Frontend (Vite) Environment Variables**

* Use the `VITE_` prefix for any variable that needs to be accessed in the client code (e.g., `VITE_CONVEX_URL`).

Example for `.env.local` (development):  
 VITE\_CONVEX\_URL=https://your-dev-deployment.convex.cloud  
VITE\_CONVEX\_SITE\_URL=https://your-dev-deployment.convex.site  
SITE\_URL=http://localhost:3000

* 

Example for production (set in Vercel dashboard):  
 VITE\_CONVEX\_URL=https://your-prod-deployment.convex.cloud  
VITE\_CONVEX\_SITE\_URL=https://your-prod-deployment.convex.site  
SITE\_URL=https://your-production-url.com

*   
* These variables are used in your Vite app to initialize the Convex client and Better Auth [Better Auth Vite Guide](https://convex-better-auth.netlify.app/framework-guides/react#installation).

---

## **4\. Backend (Convex) Environment Variables**

* Set secrets and config (e.g., `BETTER_AUTH_SECRET`, `SITE_URL`) in the Convex dashboard for each deployment (dev, prod, preview).  
* Access these in Convex functions via `process.env.VARIABLE_NAME` [Production Environment Variables](https://docs.convex.dev/production/environment-variables).

---

## **5\. Build & Deploy Commands**

In Vercel, override the build command to:  
 npx convex deploy \--cmd 'npm run build'

*  This ensures your frontend is built with the correct Convex deployment URL and your backend functions are deployed together [Using Convex with Vercel](https://docs.convex.dev/production/hosting/vercel).

---

## **6\. Authentication Providers**

* For Better Auth, set up the required environment variables (`BETTER_AUTH_SECRET`, `SITE_URL`) in each Convex deployment.  
* If using other providers (Clerk, Auth0, WorkOS), set their environment variables per deployment in the Convex dashboard and in your frontend as needed [Clerk](https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances) | [Auth0](https://docs.convex.dev/auth/auth0#configuring-dev-and-prod-tenants) | [WorkOS](https://docs.convex.dev/auth/authkit/#configuring-dev-and-prod-instances).

---

**In summary:**

* Use separate Convex deployments and environment variables for development, production, and (optionally) preview environments.  
* Set frontend environment variables in Vercel (with `VITE_` prefix) and backend variables in the Convex dashboard.  
* Use preview deployments for safe, isolated testing of changes before merging to production.

This approach ensures safety, flexibility, and a smooth workflow for both solo and team development.

