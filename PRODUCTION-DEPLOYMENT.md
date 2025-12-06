# Production Deployment Reference

**Last Updated:** December 6, 2025

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

## RAG Ingestion Fix Required

The ingestion code needs `userId` filter added to `convex/ingestRubric.ts` in **3 locations**.

Add this line to each `filterValues` array:
```typescript
{ name: "userId", value: "system" }
```

**Locations:**
1. Line ~75 (LEADS System)
2. Line ~102 (Rubric Overview)
3. Line ~130 (Rubric Indicators)

## RAG Ingestion to Production

```bash
# Create temporary production env file
cat > .env.prod.temp << 'EOF'
VITE_CONVEX_URL=https://outgoing-partridge-914.convex.cloud
EOF

# Swap env files
cp .env.local .env.local.backup
cp .env.prod.temp .env.local

# Run ingestion
pnpm ingest-rag

# Restore dev environment
cp .env.local.backup .env.local
rm .env.prod.temp .env.local.backup
```

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

**White page:** Check Vercel env vars, trigger new build (not redeploy)

**RAG ingestion fails:** Verify OPENAI_API_KEY in Convex production

**Auth issues:** Verify SITE_URL matches domain, check trustedOrigins in `convex/auth.ts`
