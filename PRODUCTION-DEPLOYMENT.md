# Production Deployment Reference

**Last Updated:** December 6, 2025 (Updated for backend Convex function ingestion)

## Production Environment

| Setting | Value |
|---------|-------|
| Convex Deployment | `outgoing-partridge-914` |
| Convex URL | `https://outgoing-partridge-914.convex.cloud` |
| Convex Site URL | `https://outgoing-partridge-914.convex.site` |
| Production Domain | `https://www.pelicanai.org` |
| Hosting | Vercel |

## Required Environment Variables

### Vercel (build-time)

```
VITE_CONVEX_URL=https://outgoing-partridge-914.convex.cloud
VITE_CONVEX_SITE_URL=https://outgoing-partridge-914.convex.site
SITE_URL=https://www.pelicanai.org
```

### Convex Production (set via `npx convex env set --prod`)

```
SITE_URL=https://www.pelicanai.org
OPENAI_API_KEY=<your-key>
RESEND_API_KEY=<your-key>
BETTER_AUTH_SECRET=<your-secret>
RESEND_WEBHOOK_SECRET=<your-secret>
RESEND_TEST_MODE=false
```

## RAG Ingestion to Production

RAG ingestion is performed by backend Convex functions (actions). The ingestion script is a local helper that calls these backend functions.

### Backend Functions

The backend Convex actions that perform ingestion are:
- **`convex/ingestStandards.ts`** - Contains `batchIngestStandards` action
- **`convex/ingestRubric.ts`** - Contains `batchIngestRubric` action

These are the functions that actually perform the RAG ingestion in production.

### Local Helper Script

The script **`scripts/ingest-rag.ts`** is a local helper that:
- Reads JSON files from `knowledge/` directory
- Transforms data to match function signatures
- Calls the backend Convex actions via `ConvexHttpClient`
- Handles retry logic and error reporting

**Important:** The script runs locally on your machine and calls the backend functions. It does not run in production.

### Prerequisites

1. Ensure you're authenticated to Convex production:
   ```bash
   npx convex deploy --prod
   ```

2. Verify production environment variables are set (especially `OPENAI_API_KEY`):
   ```bash
   npx convex env list --prod
   ```

3. Ensure JSON files exist in `knowledge/` directory on your local machine

### Ingestion Method

Run the local script with production Convex URL:

```bash
# Set production Convex URL
export CONVEX_URL=https://outgoing-partridge-914.convex.cloud

# Run local script (calls backend functions in production)
pnpm ingest-rag
```

**How it works:**
1. Script reads JSON files from `knowledge/` directory (local)
2. Script transforms data to match backend function signatures
3. Script calls backend Convex actions (`batchIngestStandards` and `batchIngestRubric`) via HTTP
4. Backend functions execute in production and perform RAG ingestion

**Expected results:**
- 455 ELA standards
- 359 Math standards
- 208 Science standards
- 836 Social Studies standards
- 71 Rubric chunks
- **Total: 1,929 documents**

## Deployment Workflow

1. Push to `main` branch
2. Vercel auto-deploys (~2-3 min)
3. Convex functions deploy automatically
4. Run RAG ingestion after deployment
5. Test production site

## Troubleshooting

**RAG ingestion fails:** 
- Verify `OPENAI_API_KEY` is set in Convex production: `npx convex env get OPENAI_API_KEY --prod`
- Check Convex logs: `npx convex logs --prod`
- Ensure JSON files exist in `knowledge/` directory

**Auth issues:** 
- Verify `SITE_URL` matches domain in Convex production
- Check `trustedOrigins` in `convex/auth.ts`
- Verify `BETTER_AUTH_SECRET` is set in production
