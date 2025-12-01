# RAG Ingestion Plan

**Status:** 🚧 **PLANNING PHASE**  
**Date:** December 1, 2025  
**Priority:** High - Required for Conversational Prompt Coach to function with Louisiana-specific context

## Overview

The RAG system is initialized and ready, but the Louisiana Student Standards and Louisiana Educator Rubric data from the `knowledge/` folder JSON files have not yet been ingested into the RAG system. This document outlines the plan to populate RAG with all knowledge base data.

## Current State

### ✅ What's Ready
- RAG system initialized in `convex/rag.ts` with 6 filters:
  - `contentType`: "louisiana_standard", "framework", "user_content"
  - `subject`: "ela", "math", "science", "social_studies"
  - `gradeLevel`: "K", "1", "2", ..., "12"
  - `standardCode`: Parsed standard identifier
  - `cognitiveDepth`: "recall", "application", "synthesis"
  - `userId`: For user-specific content
- Workflow infrastructure for bulk ingestion (`convex/populateStandardsWorkflow.ts`)
- Rate limiting configured for bulk operations
- Parser structure exists (`convex/lssJsonParser.ts`)

### ❌ What's Missing
- **Data ingestion:** No standards or rubric data in RAG yet
- **JSON structure mismatch:** Existing parser expects different field names than actual JSON files
- **Rubric parser:** No parser exists for Louisiana Educator Rubric JSON structure
- **Ingestion commands:** No easy way to trigger bulk ingestion

## JSON File Structure Analysis

### 1. ELA Standards (`la-ela-standards.json`)
```json
{
  "standards": [
    {
      "code": "RL.K.1",
      "gradeLevel": "K",
      "subject": "ela",
      "strand": "Reading Literature",
      "strandCode": "RL",
      "category": "Key Ideas and Details",
      "standardNumber": 1,
      "text": "With prompting and support, ask and answer questions...",
      "subStandards": [],
      "cognitiveDepth": "recall"
    }
  ]
}
```

**Key Fields:**
- `code` → maps to `standardCode`
- `text` → maps to `standardText`
- `strand` and `strandCode` → ELA-specific metadata
- `subStandards[]` → may contain lettered sub-standards

### 2. Math Standards (`la-math-standards.json`)
```json
{
  "standards": [
    {
      "code": "K.CC.A.1",
      "gradeLevel": "K",
      "subject": "math",
      "domain": "Counting and Cardinality",
      "domainCode": "CC",
      "cluster": "Know number names and the count sequence",
      "clusterCode": "A",
      "standardNumber": 1,
      "text": "Count to 100 by ones and by tens.",
      "subStandards": [
        {
          "letter": "a",
          "text": "..."
        }
      ],
      "cognitiveDepth": "recall"
    }
  ]
}
```

**Key Fields:**
- `code` → maps to `standardCode`
- `text` → maps to `standardText`
- `domain`, `domainCode`, `cluster`, `clusterCode` → Math-specific metadata
- `subStandards[]` → lettered sub-standards with `letter` and `text`

### 3. Science Standards (`la-science-standards.json`)
```json
{
  "standards": [
    {
      "code": "K-PS2-1",
      "gradeLevel": "K",
      "subject": "science",
      "discipline": "Physical Science",
      "disciplineCode": "PS",
      "topic": "Motion and Stability: Forces and Interactions",
      "topicNumber": 2,
      "standardNumber": 1,
      "performanceExpectation": "Plan and conduct an investigation...",
      "clarificationStatement": "...",
      "scienceAndEngineeringPractices": [...],
      "disciplinaryCoreIdeas": [...],
      "crosscuttingConcepts": [...],
      "louisianaSpecificAdditions": [...],
      "cognitiveDepth": "analysis"
    }
  ]
}
```

**Key Fields:**
- `code` → maps to `standardCode`
- `performanceExpectation` → primary text (maps to `standardText`)
- `clarificationStatement` → additional context
- Complex nested structures: `disciplinaryCoreIdeas[]`, `crosscuttingConcepts[]`
- `louisianaSpecificAdditions[]` → Louisiana-specific content

### 4. Social Studies Standards (`la-social-studies-standards.json`)
```json
{
  "standards": [
    {
      "standardCode": "K.1",
      "gradeLevel": "K",
      "subject": "social_studies",
      "description": "Order events in a chronological sequence...",
      "subIndicator": null,
      "contentThemes": ["history"],
      "cognitiveLevel": "Skill",
      "historicalEra": null,
      "geographicRegion": null
    },
    {
      "standardCode": "K.1.a",
      "parentStandard": "K.1",
      "gradeLevel": "K",
      "subject": "social_studies",
      "description": "Daily classroom activities",
      "subIndicator": "a",
      "contentThemes": ["history"],
      "cognitiveLevel": "Recall"
    }
  ]
}
```

**Key Fields:**
- `standardCode` → already correct
- `description` → maps to `standardText`
- `cognitiveLevel` → maps to `cognitiveDepth` (but values differ: "Skill", "Recall" vs "recall", "application")
- `parentStandard` → indicates sub-standards
- `contentThemes[]`, `historicalEra`, `geographicRegion` → Social Studies-specific metadata

### 5. Louisiana Educator Rubric (`la-rubric-evaluation-handbook.json`)
```json
{
  "metadata": {...},
  "leadsSystem": {...},
  "rubric": {
    "name": "Louisiana Educator Rubric (LER)",
    "domains": [
      {
        "domain": "INSTRUCTION",
        "domainName": "Instruction",
        "indicators": [
          {
            "indicatorCode": "SO",
            "indicatorName": "Standards and Objectives",
            "performanceLevels": [
              {
                "level": 5,
                "levelName": "Exemplary",
                "descriptors": [...]
              },
              {
                "level": 3,
                "levelName": "Proficient",
                "descriptors": [...]
              },
              {
                "level": 1,
                "levelName": "Unsatisfactory",
                "descriptors": [...]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Key Structure:**
- 4 domains: INSTRUCTION, PLANNING, ENVIRONMENT, PROFESSIONALISM
- Each domain has multiple indicators (e.g., "SO", "MS", "PIC")
- Each indicator has 3 performance levels (5, 3, 1) with descriptors
- Rich text content in descriptors that needs to be chunked appropriately

## Implementation Plan

### Phase 1: Update Standards Parser

**File:** `convex/lssJsonParser.ts`

**Tasks:**
1. ✅ Update parser to handle actual JSON structure (wrapped in `{ "standards": [...] }`)
2. ✅ Map field names correctly:
   - ELA/Math: `code` → `standardCode`, `text` → `standardText`
   - Science: `performanceExpectation` → `standardText`
   - Social Studies: `description` → `standardText`, `cognitiveLevel` → `cognitiveDepth` (with mapping)
3. ✅ Handle `subStandards` arrays (flatten or include in text chunk)
4. ✅ Handle Science-specific nested structures (disciplinaryCoreIdeas, crosscuttingConcepts)
5. ✅ Handle Social Studies parent-child relationships

**Output:** Parser that converts all 4 subject JSON files to `StandardData[]` format

### Phase 2: Create Rubric Parser

**File:** `convex/lerJsonParser.ts` (new file)

**Tasks:**
1. Parse rubric JSON structure
2. Extract domains, indicators, performance levels
3. Create text chunks for each indicator at each performance level
4. Include domain and indicator context in each chunk
5. Map to RAG metadata format:
   - `contentType`: "louisiana_rubric"
   - `domain`: "INSTRUCTION", "PLANNING", "ENVIRONMENT", "PROFESSIONALISM"
   - `indicatorCode`: "SO", "MS", etc.
   - `performanceLevel`: 5, 3, 1

**Output:** Parser that converts rubric JSON to chunks ready for RAG ingestion

### Phase 3: Update RAG Ingestion Functions

**File:** `convex/populateStandards.ts`

**Tasks:**
1. ✅ Update `addStandardToRAG()` to handle all subject-specific metadata
2. ✅ Create `addRubricIndicatorToRAG()` for rubric chunks
3. ✅ Update text chunk formatting to include all relevant context
4. ✅ Ensure proper filter metadata is set for all content types

### Phase 4: Create Ingestion Actions

**Files:** 
- `convex/populateStandards.ts` (update)
- `convex/populateRubric.ts` (new file)

**Tasks:**
1. Create public actions to trigger ingestion:
   - `populateELAStandards()` - Read `knowledge/la-ela-standards.json` and ingest
   - `populateMathStandards()` - Read `knowledge/la-math-standards.json` and ingest
   - `populateScienceStandards()` - Read `knowledge/la-science-standards.json` and ingest
   - `populateSocialStudiesStandards()` - Read `knowledge/la-social-studies-standards.json` and ingest
   - `populateRubric()` - Read `knowledge/la-rubric-evaluation-handbook.json` and ingest
2. Each action should:
   - Read JSON file from `knowledge/` folder (using Node.js `fs` in action)
   - Parse using appropriate parser
   - Start workflow for bulk ingestion
   - Return workflow ID for status tracking

**Note:** Convex actions can't directly read files from the repo. Options:
- **Option A:** Read files at build time, embed as constants (not scalable for large files)
- **Option B:** Use Convex file storage to upload JSON files, then read from storage
- **Option C:** Pass JSON content as string argument (manual copy-paste or script)
- **Option D:** Create a one-time script that reads files and calls Convex functions

**Recommended:** Option D - Create a Node.js script that reads JSON files and calls Convex ingestion functions.

### Phase 5: Create Ingestion Script

**File:** `scripts/populate-rag.ts` (new file)

**Tasks:**
1. Read all 5 JSON files from `knowledge/` folder
2. For each file:
   - Parse JSON
   - Call appropriate Convex action to start ingestion workflow
   - Log workflow ID
3. Provide progress tracking
4. Handle errors gracefully

**Usage:**
```bash
pnpm tsx scripts/populate-rag.ts
```

### Phase 6: Add RAG Filter for Rubric

**File:** `convex/rag.ts`

**Tasks:**
1. Add new filter: `indicatorCode` (for rubric indicators: "SO", "MS", "PIC", etc.)
2. Update RAG initialization to include new filter
3. Update all RAG search functions to support rubric filtering

**Note:** May need to add `domain` filter as well for rubric domains.

## Data Volume Estimates

### Standards
- **ELA:** ~7,231 lines (estimated 1,500-2,000 standards)
- **Math:** ~5,277 lines (estimated 1,000-1,500 standards)
- **Science:** ~7,091 lines (estimated 1,200-1,800 standards)
- **Social Studies:** ~10,065 lines (estimated 2,000-3,000 standards)
- **Total:** ~6,000-8,000 standards

### Rubric
- **4 domains** × **~12 indicators per domain** × **3 performance levels** = **~144 chunks**
- Plus LEADS system overview and metadata = **~150-200 chunks**

### Total RAG Documents
- **Standards:** ~6,000-8,000 documents
- **Rubric:** ~150-200 documents
- **Total:** ~6,150-8,200 documents

### Ingestion Time Estimate
- With batch size of 50 and rate limiting: ~2-3 hours for all standards
- Rubric: ~10-15 minutes
- **Total:** ~2.5-3.5 hours

## Testing Plan

### Unit Tests
1. Test parser for each subject JSON structure
2. Test rubric parser
3. Test field mapping and transformation
4. Test sub-standards handling

### Integration Tests
1. Test RAG ingestion for each subject
2. Test rubric ingestion
3. Test RAG search after ingestion
4. Verify filter metadata is correct

### Manual Testing
1. Ingest small sample (10-20 standards per subject)
2. Verify RAG search returns correct results
3. Verify filters work correctly
4. Ingest full dataset
5. Test Prompt Coach with RAG context

## Rollout Strategy

### Step 1: Parser Updates (1-2 hours)
- Update `lssJsonParser.ts` to handle all 4 subject structures
- Create `lerJsonParser.ts` for rubric
- Test parsers with sample data

### Step 2: Ingestion Functions (2-3 hours)
- Update `populateStandards.ts` with subject-specific handling
- Create `populateRubric.ts`
- Create ingestion script

### Step 3: Test Ingestion (1 hour)
- Ingest small samples for each subject
- Verify RAG search works
- Fix any issues

### Step 4: Full Ingestion (3-4 hours)
- Run full ingestion for all subjects
- Run rubric ingestion
- Monitor for errors

### Step 5: Verification (1 hour)
- Test Prompt Coach with RAG context
- Verify Louisiana-specific prompts are generated
- Test Alignment Scorecard (if using RAG)

## Success Criteria

- ✅ All 4 subject standards ingested into RAG
- ✅ Louisiana Educator Rubric ingested into RAG
- ✅ RAG search returns relevant standards for queries
- ✅ Prompt Coach generates Louisiana-aligned prompts using RAG context
- ✅ Filter metadata correctly set for all documents
- ✅ No data loss or corruption during ingestion

## Next Steps

1. **Immediate:** Update `lssJsonParser.ts` to handle actual JSON structures
2. **Next:** Create `lerJsonParser.ts` for rubric parsing
3. **Then:** Create ingestion script and test with small samples
4. **Finally:** Run full ingestion and verify

## Related Files

- `convex/rag.ts` - RAG initialization
- `convex/lssJsonParser.ts` - Standards parser (needs update)
- `convex/populateStandards.ts` - Ingestion functions (needs update)
- `convex/populateStandardsWorkflow.ts` - Workflow orchestration
- `convex/ragService.ts` - RAG search service
- `convex/promptCoach.ts` - Uses RAG for context (currently not getting context)
- `knowledge/*.json` - Source data files

## Notes

- **File Reading Limitation:** Convex actions can't read local files. Use a Node.js script to read files and call Convex functions.
- **Rate Limiting:** Bulk ingestion uses special rate limit key to avoid starving user requests.
- **Workflow Retry:** Workflows handle retries automatically, so ingestion is durable.
- **Chunking Strategy:** Standards are chunked individually. Rubric indicators are chunked per performance level.
- **Metadata Preservation:** All subject-specific metadata (strand, domain, cluster, etc.) is preserved in RAG metadata for filtering.

