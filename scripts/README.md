# Scripts

Utility scripts for Pelican AI development and maintenance.

## RAG Ingestion Script

### Overview

The `ingest-rag.ts` script ingests Louisiana Student Standards and Louisiana Educator Rubric data from JSON files in the `knowledge/` directory into the Convex RAG system.

### Prerequisites

1. Ensure Convex is running: `pnpm convex dev`
2. Ensure `CONVEX_URL` environment variable is set (automatically set by `convex dev`)

### Usage

#### Basic Commands

```bash
# Preview what will be ingested (dry-run mode)
pnpm ingest-rag:dry-run

# Ingest all standards and rubric
pnpm ingest-rag

# Ingest only standards (no rubric)
pnpm ingest-rag --standards-only

# Ingest only rubric (no standards)
pnpm ingest-rag --rubric-only

# Ingest specific subjects only
pnpm ingest-rag --subjects=ela,math

# Combine options
pnpm ingest-rag --dry-run --subjects=ela --standards-only
```

#### Command Line Options

- `--dry-run` - Preview ingestion without actually adding data to RAG
- `--standards-only` - Only ingest Louisiana Student Standards (skip rubric)
- `--rubric-only` - Only ingest Louisiana Educator Rubric (skip standards)
- `--subjects=<list>` - Comma-separated list of subjects to ingest
  - Available subjects: `ela`, `math`, `science`, `social_studies`
  - Example: `--subjects=ela,math`

### What Gets Ingested

#### Louisiana Student Standards

**Files:**
- `knowledge/la-ela-standards.json` - English Language Arts standards
- `knowledge/la-math-standards.json` - Mathematics standards
- `knowledge/la-science-standards.json` - Science standards
- `knowledge/la-social-studies-standards.json` - Social Studies standards

**Data Structure:**
Each standard is ingested with:
- Standard code (e.g., `RL.3.1`)
- Grade level (e.g., `3`)
- Subject (e.g., `ela`)
- Standard text
- Cognitive depth (e.g., `recall`, `application`, `analysis`)
- Subject-specific metadata (strand, domain, cluster, etc.)

**RAG Filters:**
- `contentType`: "louisiana_standard"
- `subject`: "ela", "math", "science", or "social_studies"
- `gradeLevel`: "K", "1", "2", ..., "12"
- `standardCode`: Full standard identifier
- `cognitiveDepth`: "recall", "application", "analysis", or "synthesis"

#### Louisiana Educator Rubric

**File:**
- `knowledge/la-rubric-evaluation-handbook.json`

**Data Structure:**
- LEADS system overview
- Rubric metadata and overview
- 4 domains (Instruction, Planning, Environment, Professionalism)
- ~12 indicators per domain
- 3 performance levels per indicator (Level 1, 3, 5)

Each performance level is ingested as a separate chunk with:
- Domain and indicator context
- Performance level descriptors
- Teaching approach descriptions

**RAG Filters:**
- `contentType`: "rubric_indicator"
- `subject`: "all" (applies to all subjects)
- `gradeLevel`: "all" (applies to all grades)
- `standardCode`: `{DOMAIN}_{INDICATOR}_{LEVEL}` (e.g., `INSTRUCTION_SO_L5`)
- `cognitiveDepth`: "application"

### Expected Output

#### Dry-Run Mode

```
Pelican AI - RAG Ingestion Script

🔍 DRY RUN MODE - No data will be ingested

📚 Ingesting both standards and rubric
📖 Selected subjects: ela, math, science, social_studies

Processing Standards
============================================================

ELA Standards
File: la-ela-standards.json
  📊 Found 356 standards

  Sample standard:
    Code: RL.K.1
    Grade: K
    Text: With prompting and support, ask and answer questions...

[... more files ...]

✅ Ingestion preview complete!

Run without --dry-run to actually ingest the data.
```

#### Full Ingestion

```
Pelican AI - RAG Ingestion Script

📚 Ingesting both standards and rubric
📖 Selected subjects: ela, math, science, social_studies

Processing Standards
============================================================

ELA Standards
File: la-ela-standards.json
  📊 Found 356 standards
  ⏳ Ingesting...
  ✅ Success: 356/356

[... more subjects ...]

Processing Louisiana Educator Rubric
============================================================

  📊 Found 23 indicators (69 performance levels)
  ⏳ Ingesting...
  ✅ Success: 71/71

✅ Ingestion complete!
```

### Batch Processing

The script processes standards in batches of 50 to handle rate limiting. This is configurable in the Convex actions if needed.

### Error Handling

- If an individual standard fails to ingest, the script continues with the next one
- Up to 10 errors are reported at the end of each file
- The script returns overall success/error counts for debugging

### Troubleshooting

**Error: CONVEX_URL environment variable not set**
- Make sure `pnpm convex dev` is running in another terminal
- The dev server automatically sets this environment variable

**Error: File not found**
- Ensure all JSON files exist in the `knowledge/` directory
- Check that file names match exactly (case-sensitive)

**Error: Invalid file format**
- Verify JSON files have the expected structure:
  - Standards files: `{ "standards": [...] }`
  - Rubric file: `{ "rubric": { "domains": [...] } }`

**Ingestion seems slow**
- This is normal! Processing thousands of standards takes time
- Batch processing helps, but expect 5-10 minutes for full ingestion
- Use `--subjects=ela` to test with smaller datasets first

### Adding New Subjects

To add a new subject in the future:

1. Add the JSON file to `knowledge/` directory
2. Update the `FILES` constant in `ingest-rag.ts`:
   ```typescript
   new_subject: {
     path: "la-new-subject-standards.json",
     subject: "new_subject" as const,
     name: "New Subject Standards",
   }
   ```
3. Add transformation logic in the `transformStandard()` function
4. Update the `subject` validator in `convex/ingestStandards.ts`

### Related Files

- `convex/ingestStandards.ts` - Convex action for standards ingestion
- `convex/ingestRubric.ts` - Convex action for rubric ingestion
- `convex/rag.ts` - RAG initialization with filters
- `docs/RAG_INGESTION_PLAN.md` - Detailed ingestion plan and architecture
