# LER/LSS Data Structuring + RAG Refinements Plan

**Last Updated:** November 27, 2025
**Status:** Phase 0 Complete ✅, Phase 1 Complete ✅ (Refactored), Phases 2-4 Pending
**Reference:** See [CLAUDE.md](../CLAUDE.md) for technical architecture patterns, Convex function types, testing patterns, and workflow system usage.

## Current State Analysis

**What's Built:**

- RAG infrastructure exists in `convex/rag.ts` with filters: `contentType`, `subject`, `gradeLevel`, `standardCode`, `cognitiveDepth`, `userId`
- `convex/populateStandards.ts` has structure for adding standards to RAG but relies on broken PDF scraper (PDF parsing not implemented - returns placeholder)
- `convex/ragService.ts` provides search APIs using namespace `"louisiana_standards"`
- `convex/alignmentSteps.ts` uses RAG search for alignment workflows - **workflow tested and working with test data from `populateStandards.ts`**
- Knowledge folder contains markdown files: `la-ela.md`, `la-math.md`, `la-social-studies.md`, `la-ler-rubric.md`, etc. - **these are the actual source of truth but not being used**
- LER referenced in schema (`lerDomains` field) and frameworks but not in RAG
- `populateStandardsFromData` exists for manual data entry (testing)
- ✅ **Test reorganization complete:** All test files moved to `convex/tests/` subdirectory (November 26, 2025)
- ✅ **RAG test suite created:** `convex/tests/ragService.test.ts` with unit tests for RAG search validation
- ✅ **Manual validation script created:** `convex/ragValidation.ts` for testing against real deployments

**Critical Issues Found:**

- ✅ **Two RAG instances**: ~~`rag.ts` (6 filters) and `populateStandards.ts` (5 filters) both initialize RAG with different filter configurations - **MUST consolidate first**~~ - **RESOLVED**: RAG consolidation complete, single instance in use
- **Limited data in RAG**: Test data from `populateStandards.ts` working, but full standards population still needed (scraper doesn't work, JSON conversion needed)
- ✅ **Unused files removed:** `convex/standardsScraper.ts` deleted, `populateSampleStandards` and `populateStandardsFromScraper` removed (November 26, 2025)
- **Knowledge files unused**: Markdown files contain the actual standards but no parser exists
- **File access**: Convex actions can use `fetch()` but best approach is to accept content as string parameter

**What's Missing:**

- ✅ Consolidated RAG initialization (single source of truth) - **COMPLETE**
- ✅ JSON schemas for data validation - **COMPLETE** (Phase 1)
- ✅ Markdown-to-JSON converter script - **COMPLETE** (Phase 1, moved to `scripts/convert-markdown-to-json.ts`)
- ✅ JSON parser for reliable data extraction - **COMPLETE** (Phase 1)
- ⏳ LER data structure and RAG integration - **PENDING** (Phase 2)
- ⏳ LER-specific RAG filters - **PENDING** (Phase 2)
- ⏳ Actual data population - **PENDING** (Run conversion script, then populate RAG)

## Technical Constraints & Considerations

### 1. RAG Filter Semantics and Limits

**a. Filter semantics: OR-only + composite-AND workaround**

The RAG component's filters are **OR-ed** together per search; there's no built-in "AND across multiple filters" in vector search. The recommended pattern is to encode "AND" by using a single filter with a compound value. [[Filtered search](https://www.convex.dev/components/rag#filtered-search)]

**Implications for LSS/LER:**

- Queries like `subject = ELA AND gradeLevel = 3 AND standardCode starts-with "RL.3"` **cannot** be expressed as three independent filters.
- You'll need carefully designed composite filters (e.g. `subjectGradeStandardKey`) wherever you expect "AND" behavior.
- This gets more complex as you add more filters (`contentType`, `subject`, `gradeLevel`, `standardCode`, `cognitiveDepth`, `userId`, `lerDomain`, `lerIndicator`, `performanceLevel`).

**b. Index / filter count limits**

RAG's vector search sits on Convex vector indexes, which have hard limits:

- Per vector index: up to **16 filter fields**. [[Vector search limits](https://docs.convex.dev/search/vector-search#limits); [Vector limits](https://docs.convex.dev/production/state/limits#vector-search)]
- Per search: up to **64 filter expressions**. [[Vector search limits](https://docs.convex.dev/search/vector-search#limits)]

**Our plan for 9 distinct filters is within the 16-filter limit, but we're close to the "lots of metadata" edge.** Later additions (e.g. more subject variants, versions, tags) might force a redesign of which things are filters vs. fields you post-filter in actions.

**Best practice:** Because filters are used at the index level, you want only those that you actually use in most searches; the rest can live as normal fields and be post-filtered on the results.

### 2. Large-Ingest Workflows and Durability

**a. Where to run the ingest code**

RAG operations (`rag.add`, `rag.addAsync`, `rag.search`) are actions (they call LLM embedding APIs, `fetch`, etc.), not deterministic queries/mutations.

**Long-running / multi-file ingestion should be wrapped in Workflows or Workpool, not plain actions**, if you want durability, backoff, and restart-safety. [[Workflow overview](https://www.convex.dev/components/workflow); [Using Workflow for long-lived durable workflows](https://docs.convex.dev/agents/workflows#using-the-workflow-component-for-long-lived-durable-workflows); [Workpool retries](https://www.convex.dev/components/workpool#durable-reliable-workflows)]

If you just call big actions directly you'll lose:

- Automatic durable retries with exponential backoff.
- Ability to throttle concurrent ingestion so it doesn't starve other actions. [[Agents workflows – load balancing](https://docs.convex.dev/agents/workflows#building-reliable-workflows)]

**b. Batching & pagination**

RAG provides an async pattern specifically for large files:

- `rag.addAsync` with a `chunkerAction` that uses file storage and chunks server-side. [[Add entries asynchronously](https://www.convex.dev/components/rag#add-entries-asynchronously-using-file-storage)]

If your JSON → RAG path pushes thousands of standards/indicators in one action/mutation without batching, you risk:

- Hitting Convex read/write limits.
- Timeouts in actions.

**Implementation requirement:** Use RAG's own `addAsync`/chunkerAction mechanism or Workpool/Workflow steps; those are the primitives Convex expects you to use for scalable ingest. [[RAG async ingest](https://www.convex.dev/components/rag#add-entries-asynchronously-using-file-storage); [Agents workflows – load balancing](https://docs.convex.dev/agents/workflows#building-reliable-workflows)]

### 3. LLM / Embedding Cost, Rate Limiting, and Retries

**a. Ingest can easily blow through provider limits**

The Rate Limiter component is exactly meant for this—per-user and global token/request limits, plus reservation to avoid starvation. [[Rate limiter intro](https://www.convex.dev/components/rate-limiter); [Agents rate limiting strategy](https://docs.convex.dev/agents/rate-limiting#rate-limiting-strategy); [Reserving capacity](https://www.convex.dev/components/rate-limiter#reserving-capacity)]

**Where this could go wrong:**

- If ingest actions call your embedding model in big loops without `rateLimiter.limit(..., { reserve: true })`, you can:
  - Hit upstream rate limits mid-run.
  - Start failing with "try later" errors with no backpressure on your own queue.
- If ingest retries are implemented ad-hoc instead of through Workpool/Workflow, you may get stampeding retries when the provider is flaky. Workpool/Workflow already implement backoff + jitter with exactly-once `onComplete`. [[Retries with Workpool/Workflow](https://stack.convex.dev/durable-workflows-and-strong-guarantees#retries); [Workpool retry management](https://www.convex.dev/components/workpool#durable-reliable-workflows); [Workflow retry behavior](https://www.convex.dev/components/workflow#specifying-retry-behavior)]

**Implementation requirement:** Each embedding step should:
- Reserve tokens/requests with the Rate Limiter.
- Be run via Workpool/Workflow with retries configured.
- Otherwise large batch ingest will be the first thing to fall over when the model/API slows down.

**b. Overlap with Action Cache**

RAG itself already embeds text and stores vectors; the Action Cache example is mainly for caching *per-query* embeddings so you don't re-call the embedding API for the same search string. [[Action cache intro](https://www.convex.dev/components/action-cache); [Embedding cache example](https://www.convex.dev/components/action-cache#example)]

**Important:** If you use Action Cache to cache embeddings for **ingest content**, *and* also let RAG generate embeddings for that same text, you'll pay for extra complexity without benefit. The "caching embeddings" example is for custom vector-search code, not for the RAG component, which already owns the text→embedding→index pipeline. [[RAG basic setup & add](https://www.convex.dev/components/rag#basic-setup)]

**Best practice:**
- Use Action Cache primarily to cache **search query** embeddings if you do any manual `ctx.vectorSearch` outside RAG.
- Avoid double-embedding ingest text via both Action Cache and RAG.

**c. Model selection and cost optimization**

**TODO: Explore recent AI model family releases for OpenAI and Gemini.** There are newer models that may be cheaper while also adding better functionality (e.g., improved embedding quality, lower latency, better rate limits). Before finalizing the implementation, review:

- Latest OpenAI embedding models (e.g., `text-embedding-3-small`, `text-embedding-3-large`, or newer releases)
- Latest Gemini embedding models and their pricing/performance characteristics
- Cost per token/request for bulk ingestion scenarios
- Embedding quality benchmarks for educational content
- Rate limit improvements in newer models
- Any new model features that could improve RAG retrieval accuracy

This evaluation should happen during Phase 1 implementation to ensure we're using the most cost-effective and performant models for our use case.

### 4. Vector Search Limits and Recall Expectations

Convex vector search has important global limits:

- At most **256 results per search** (default 10). [[Vector search query limits](https://docs.convex.dev/api/interfaces/server.VectorSearchQuery#limit); [[Vector search limits](https://docs.convex.dev/search/vector-search#limits); [Vector limits](https://docs.convex.dev/production/state/limits#vector-search)]
- One query vector per search.
- Millions of vectors are supported, but recall then depends heavily on your chunking and query design, not brute-force scanning. [[Vector limits](https://docs.convex.dev/search/vector-search#limits); [[Magic of embeddings](https://stack.convex.dev/the-magic-of-embeddings#where-should-i-store-it)]

**Implications for our design:**

- LSS + LER in the same RAG (or multiple namespaces) is fine, but "search everything and then heavily filter" is constrained by the 256-result cap.
- Plans like "high precision with >80% target" will depend strongly on:
  - Chunking (RAG's default chunker vs. your LSS/LER-specific chunking). [[RAG defaultChunker](https://www.convex.dev/components/rag#utility-functions)]
  - Filter design (to narrow search region efficiently).
  - Query text construction (how you phrase standards/indicators when you search).

These are primarily modeling concerns, but the fixed max result set can surprise you if you expect unbounded re-ranking at workflow level.

### 5. Workflow Design vs. Simple Scheduling

Workflows **must be deterministic** and step logic must call into queries/mutations/actions via the `step` API, not arbitrary `fetch` or `crypto`. [[Workflow usage](https://www.convex.dev/components/workflow#usage)]

**Long RAG ingests via Workflow should:**
- Use `step.runAction` to call small, idempotent ingest chunks.
- Use `retry` options at step level or WorkflowManager level to tune transient failure behavior. [[Workflow retry behavior](https://www.convex.dev/components/workflow#specifying-retry-behavior)]

If you put too much non-deterministic logic directly in the workflow handler instead of in actions, the Workflow component will restrict or break that pattern.

### 6. RAG–Agent Integration Expectations

The docs outline two main RAG approaches for agents:

- Prompt-based (always search, inject context).
- Tool-based (LLM decides when to call a `searchContext` tool). [[Agents RAG approaches](https://docs.convex.dev/agents/rag#rag-approaches)]

**Our plan for rich filters (subject/grade/LER etc.) is compatible with both, but:**

- In tool-based RAG, the LLM will often **not** pass all your nice structured filters unless you design the tool schema and system prompts carefully.
- If you expect "search only LER indicators for grade 3 ELA" you'll need tools that *take those arguments explicitly*, not just a plain `query: string`.

Otherwise you'll end up doing far more unfiltered / weakly-filtered searches than your design suggests, which affects both cost and precision.

### 7. Maintenance Overhead of JSON + Schemas

Convex doesn't know about your JSON schemas; they live alongside the code and must be enforced by your own parsing actions.

If JSON schemas drift from how you're actually using filters in RAG, you'll get subtle issues (e.g., new domain values not indexed, or missing filterValues, etc.) with no protection at the database layer.

**The main challenge is *discipline*:** every schema change must be accompanied by:

- RAG filter design review (do we really need a new filter field?).
- Parser & ingest updates.
- Possibly migration or re-ingest workflows.

## Implementation Plan

### Phase 0: RAG Consolidation (CRITICAL - Do First) ✅ COMPLETE

**Status:** Completed - `populateStandards.ts` now imports `rag` from `rag.ts`. Single RAG instance confirmed working with alignment scorecard workflow.

**Goal:** Fix structural issue of duplicate RAG instances before adding new functionality

**Tasks:**

1. **Consolidate RAG Initialization** ✅

- ✅ Update `convex/populateStandards.ts` to import `rag` from `rag.ts` instead of creating new instance
- ✅ Remove duplicate RAG initialization (lines 15-26 in `populateStandards.ts`)
- ✅ Remove duplicate imports: `RAG` from `@convex-dev/rag` and `openai` (no longer needed)
- ✅ Ensure `addStandardToRAG` function uses imported `rag` instance
- ✅ Verify all 6 filters from `rag.ts` are available (including `userId`)

2. **Verify RAG Filter Consistency** ✅

- ✅ Check that `rag.ts` filterNames match what's actually used in queries
- ✅ Document filter usage patterns
- ✅ Ensure no filter mismatches exist between initialization and usage
- **Review filter design:** Consider which filters are truly needed for index-level filtering vs. post-filtering in actions (see Technical Constraints section)

3. **Test Consolidation** ✅

- ✅ Verify existing RAG queries still work after consolidation
- ✅ Test that `populateStandardsFromData` still functions correctly
- ✅ Ensure no breaking changes to alignment workflows (alignment scorecard workflow tested and working)
- Follow testing patterns from [CLAUDE.md](../CLAUDE.md#testing-architecture) using `convex-test` and `edge-runtime` environment

**Files to Modify:**

- `convex/populateStandards.ts` (remove RAG initialization, import from rag.ts)
- `convex/rag.ts` (verify as single source of truth)

**Deliverables:**

- Single RAG instance used throughout codebase
- No filter configuration mismatches
- Existing functionality preserved

### Phase 1: LSS JSON Structure & Conversion (Week 1)

**Goal:** Create structured JSON format from markdown files for reliable parsing and RAG ingestion

**Tasks:**

1. **Create JSON Schema Definitions** (`knowledge/schemas/`)

- Define `lss-standard.schema.json` for LSS standards structure
- Use JSON Schema for validation and documentation

2. **Create Markdown-to-JSON Converter** (`convex/markdownToJson.ts`)

- Parse markdown content (accepted as string parameter)
- Extract standards with pattern matching:
 - ELA: `RL.2.1`, `RI.3.4`, `W.5.1a` format (strand.grade.standard)
 - Math: `2.NBT.A.1`, `K.CC.A.1` format (grade.domain.cluster.standard)
 - Social Studies: Similar patterns
- Parse grade level from headers (e.g., "# Kindergarten", "# Grade 1")
- Extract standard text and any sub-standards (letter suffixes)
- Handle large files (process incrementally)
- Return structured JSON array matching schema
- Validate output against JSON schema

3. **Create JSON Parser** (`convex/lssJsonParser.ts`)

- Parse JSON content (accepted as string parameter)
- Validate against `lss-standard.schema.json`
- Return structured `StandardData[]` matching existing interface
- More reliable than markdown parsing (validated structure)

4. **Update `populateStandards.ts`**

- Add action `populateStandardsFromJson` (preferred method):
 - Follow [CLAUDE.md](../CLAUDE.md#architecture-patterns) action pattern
 - Accepts `jsonContent: v.string()` and `subject: v.union(...)` parameters
 - Uses `lssJsonParser` to extract standards
 - Calls existing `addStandardToRAG` function (using consolidated RAG)
 - **Processes standards in batches using Workflow/Workpool patterns** (see Technical Constraints)
 - **Integrates Rate Limiter for embedding calls** (see Technical Constraints)
 - Returns success count and errors
- Add action `populateStandardsFromMarkdown` (fallback/one-time conversion):
 - Accepts `markdownContent: v.string()` and `subject: v.union(...)` parameters
 - Uses `markdownToJson` converter, then `lssJsonParser`
 - Can output JSON for saving to knowledge/ folder
- Keep existing `populateStandardsFromData` for manual/testing use

5. **Create Workflow for Bulk Ingestion** (`convex/populateStandardsWorkflow.ts`)

- **NEW:** Create workflow that orchestrates bulk ingestion
- Use `step.runAction` to call small, idempotent ingest chunks
- Integrate Rate Limiter with `reserve: true` for each embedding step
- Use `retry` options for transient failures
- Process standards in batches (e.g., 50-100 at a time)
- Consider using `rag.addAsync` with chunkerAction for very large files
- Follow [CLAUDE.md](../CLAUDE.md#workflow-system) workflow patterns

6. **Generate Initial JSON Files** (One-time setup)

- Convert `la-ela.md` → `la-ela.json`
- Convert `la-math.md` → `la-math.json`
- Convert `la-social-studies.md` → `la-social-studies.json`
- Store in `knowledge/` folder alongside markdown files
- Markdown remains source of truth, JSON is for programmatic use

7. **Test Parsers**

- Unit tests following [CLAUDE.md](../CLAUDE.md#testing-architecture) patterns:
 - Use `convex-test` for in-memory Convex simulation
 - Use `edge-runtime` environment for backend tests
 - Test files: `convex/markdownToJson.test.ts`, `convex/lssJsonParser.test.ts`
- Test with actual knowledge file samples
- Verify filter values (subject, gradeLevel, standardCode) are correct
- Test with large files to ensure no memory issues

**Files to Create/Modify:**

- `knowledge/schemas/lss-standard.schema.json` (new)
- `convex/markdownToJson.ts` (new - LSS conversion function)
- `convex/lssJsonParser.ts` (new)
- `convex/populateStandards.ts` (modify - add JSON/markdown actions, use consolidated RAG)
- `convex/populateStandardsWorkflow.ts` (new - workflow for bulk ingestion)
- `knowledge/la-ela.json` (generated)
- `knowledge/la-math.json` (generated)
- `knowledge/la-social-studies.json` (generated)
- `convex/markdownToJson.test.ts` (new)
- `convex/lssJsonParser.test.ts` (new)

**Deliverables:**

- JSON schemas for LSS data validation
- Markdown-to-JSON converter for LSS
- JSON parser for reliable LSS data extraction
- Workflow-based bulk ingestion with Rate Limiter integration
- Ability to populate RAG with LSS data from JSON files
- Tests validate parsing and schema compliance

### Phase 2: LER JSON Structure & Conversion (Week 1-2)

**Goal:** Parse LER rubric and structure for RAG embedding using JSON format

**Tasks:**

1. **Extend RAG Filters** (`convex/rag.ts`)

- Add filters: `lerDomain`, `lerIndicator`, `performanceLevel`
- Update filterNames array (total: 9 filters)
- **Verify Convex RAG supports 9 filters** (test during implementation - within 16-filter limit but close to edge)
- **Review filter design:** Consider composite filters for AND operations (see Technical Constraints section)
- Update filterNames to include all 9 filters

2. **Create LER Data Model** (`convex/lerTypes.ts`)

- Define `LERIndicator` interface with domain, indicatorCode, indicatorName, and performance levels
- Use TypeScript strict types (no `any` - see [CLAUDE.md](../CLAUDE.md#code-conventions))

3. **Create LER JSON Schema** (`knowledge/schemas/ler-indicator.schema.json`)

- Define schema matching LERIndicator interface
- Include validation for domain enum, indicator codes, performance levels
- Use for validation during parsing

4. **Extend Markdown-to-JSON Converter** (`convex/markdownToJson.ts`)

- Add LER parsing function
- Extract structure from `knowledge/la-ler-rubric.md`:
 - 4 Domains (INSTRUCTION, PLANNING, ENVIRONMENT, PROFESSIONALISM)
 - Indicators within each domain (e.g., "Standards and Objectives (SO)")
 - Performance levels (1, 3, 5) with descriptor text
- Handle complex table structure in markdown
- Return JSON array matching LER schema
- Validate output against JSON schema

5. **Create LER JSON Parser** (`convex/lerJsonParser.ts`)

- Parse JSON content (accepted as string parameter)
- Validate against `ler-indicator.schema.json`
- Return `LERIndicator[]`
- More reliable than markdown parsing (validated structure)

6. **Create LER RAG Populator** (`convex/populateLER.ts`)

- Import consolidated `rag` from `rag.ts`
- Follow [CLAUDE.md](../CLAUDE.md#architecture-patterns) action patterns
- Similar structure to `populateStandards.ts`
- Action `populateLERFromJson` (preferred method):
 - Accepts `jsonContent: v.string()` parameter
 - Uses `lerJsonParser` to extract indicators
 - **Processes indicators in batches using Workflow/Workpool patterns** (see Technical Constraints)
 - **Integrates Rate Limiter for embedding calls** (see Technical Constraints)
- Action `populateLERFromMarkdown` (fallback/one-time conversion):
 - Accepts `markdownContent: v.string()` parameter
 - Uses `markdownToJson` converter, then `lerJsonParser`
 - Can output JSON for saving
- Chunking strategy: One chunk per indicator+performance level (3 chunks per indicator)
- Embedding text format includes domain, indicator, and performance level
- Use namespace: `"louisiana_educator_rubric"`
- Filter values: `contentType: "louisiana_educator_rubric"`, `lerDomain`, `lerIndicator`, `performanceLevel`

7. **Create Workflow for LER Bulk Ingestion** (`convex/populateLERWorkflow.ts`)

- **NEW:** Create workflow that orchestrates LER bulk ingestion
- Use `step.runAction` to call small, idempotent ingest chunks
- Integrate Rate Limiter with `reserve: true` for each embedding step
- Use `retry` options for transient failures
- Process indicators in batches
- Follow [CLAUDE.md](../CLAUDE.md#workflow-system) workflow patterns

8. **Generate Initial JSON File** (One-time setup)

- Convert `la-ler-rubric.md` → `la-ler-rubric.json`
- Store in `knowledge/` folder alongside markdown file
- Markdown remains source of truth, JSON is for programmatic use

**Files to Create/Modify:**

- `convex/lerTypes.ts` (new)
- `knowledge/schemas/ler-indicator.schema.json` (new)
- `convex/markdownToJson.ts` (modify - add LER parsing function)
- `convex/lerJsonParser.ts` (new)
- `convex/populateLER.ts` (new)
- `convex/populateLERWorkflow.ts` (new - workflow for bulk ingestion)
- `convex/rag.ts` (modify - add LER filters)
- `knowledge/la-ler-rubric.json` (generated)
- `convex/lerJsonParser.test.ts` (new)

**Deliverables:**

- LER data types defined
- JSON schema for LER validation
- LER markdown-to-JSON converter
- LER JSON parser extracts indicators from JSON
- Workflow-based bulk ingestion with Rate Limiter integration
- LER data successfully embedded in RAG with correct filters

### Phase 3: RAG Service Extensions (Week 2)

**Goal:** Add LER search capabilities and optimize queries

**Tasks:**

1. **Extend `ragService.ts`**

- Follow [CLAUDE.md](../CLAUDE.md#architecture-patterns) action patterns
- Add `searchLERIndicators` action:
 - Search by domain, indicator, or performance level
 - Return LER indicators matching query
 - Use filters: `contentType: "louisiana_educator_rubric"`, optional `lerDomain`, `lerIndicator`, `performanceLevel`
 - **Note:** Remember filters are OR-ed; use composite filters or post-filtering for AND operations
- Add `searchStandardsByLER` action:
 - Find standards relevant to a specific LER indicator
 - Cross-domain search (LER + LSS)
 - Uses semantic search across both namespaces
 - **Note:** Limited to 256 results max; design queries to narrow search region efficiently
- Update existing `getStandards` to handle both LSS and LER queries (if needed)
- **For Agent integration:** Design tool schemas that explicitly take filter arguments (subject, grade, domain, etc.) rather than just `query: string` to ensure structured filters are used

2. **Update Alignment Workflows** (`convex/alignmentSteps.ts`)

- Verify existing workflow works with populated RAG data
- Follow [CLAUDE.md](../CLAUDE.md#workflow-system) workflow patterns
- Optionally retrieve relevant LER indicators when analyzing content
- Test end-to-end alignment workflow with real data
- **Ensure workflow steps use deterministic patterns** (call actions via `step.runAction`, not arbitrary fetch/crypto)

3. **Query Optimization**

- Review vector score thresholds (currently 0.6)
- Test different thresholds for LSS vs LER
- Consider query expansion for better semantic matching
- Monitor query performance with real data
- **Design queries with 256-result limit in mind:** Use filters to narrow search region, not post-filtering large result sets

**Files to Modify:**

- `convex/ragService.ts` (add LER search functions)
- `convex/alignmentSteps.ts` (optional LER integration, verify workflow works)

**Deliverables:**

- LER search functions available
- Alignment workflows functional with real data
- Optimized query performance
- Agent integration with explicit filter arguments in tool schemas

### Phase 4: Testing & Validation (Week 2-3)

**Goal:** Ensure accuracy and validate structure

**Tasks:**

1. **Create Test Data**

- Sample standards from each subject/grade (extract from knowledge files)
- Sample LER indicators from each domain
- Known good query → expected results pairs

2. **Integration Tests**

- Follow [CLAUDE.md](../CLAUDE.md#testing-architecture) testing patterns:
 - Use `convex-test` for in-memory Convex simulation
 - Use `edge-runtime` environment
 - Test files follow `convex/**/*.test.ts` pattern
- Test markdown-to-JSON conversion accuracy
- Test JSON parsing and schema validation
- Test RAG population (verify chunks created correctly)
- Test search retrieval (precision/recall)
- Test filter combinations (including composite filters for AND operations)
- Test alignment workflow end-to-end
- **Test workflow durability:** Verify retries and backoff work correctly
- **Test Rate Limiter integration:** Verify embedding calls respect rate limits

3. **Manual Validation**

- Populate RAG with real data from JSON files using workflows
- Test alignment workflows end-to-end
- Verify LER indicators appear in relevant searches
- Verify standards appear in alignment analysis
- Test with actual user scenarios
- **Monitor embedding costs and rate limit usage**

**Manual Validation Scripts Created:** ✅
- `convex/ragValidation.ts` - Validation functions for manual testing:
  - `validateSearchAccuracy`: Test known query → expected results
  - `validateEmbeddingQuality`: Check semantic relevance of results
  - `validateFilterBehavior`: Test filter combinations work correctly
  - `validateRubricIntegration`: Test LER rubric data retrieval (when available)
- Run via: `npx convex run ragValidation:validateSearchAccuracy`
- Output results to console for manual review

**Files Created:** ✅ (November 26, 2025)

- `convex/tests/ragService.test.ts` ✅ - RAG service unit and integration tests
  - Unit tests for `getStandards` validation (subject enum, filter combinations, vector score threshold, limit parameter, rate limiting)
  - Integration tests (skipped, require real deployment) for RAG search accuracy and embedding quality
- `convex/tests/alignmentScorecard.test.ts` ✅ - Enhanced with RAG accuracy tests
  - Added unit tests for validation and edge cases
  - Added RAG accuracy tests (skipped, require real deployment)
- `convex/ragValidation.ts` ✅ - Manual validation functions
- Test files organized in `convex/tests/` subdirectory (all test files moved from `convex/` root)

**Deliverables:** ✅ (November 26, 2025)

- ✅ **RAG test suite created** (`convex/tests/ragService.test.ts`) with unit tests for input validation
- ✅ **Enhanced alignment scorecard tests** with RAG accuracy validation (filter behavior, vector score threshold, semantic relevance)
- ✅ **Manual validation scripts** available for testing against real deployment
- ⏳ Integration tests marked as skipped (require real Convex deployment with RAG component)
- ⏳ Search accuracy validation pending (requires real deployment with populated RAG data)
- ⏳ Workflow durability and Rate Limiter integration validation pending (requires workflow implementation)

## Technical Decisions

1. **RAG Initialization Consolidation (CRITICAL):**

- **Problem**: Two RAG instances exist (`rag.ts` with 6 filters, `populateStandards.ts` with 5 filters)
- **Solution**: Consolidate to single RAG instance exported from `rag.ts`, import in `populateStandards.ts`
- **Action**: Update `populateStandards.ts` to import `rag` from `rag.ts`, remove duplicate initialization

2. **JSON Format for Knowledge Base:**

- **Decision**: Maintain both markdown (source of truth) and JSON (programmatic use)
- **Rationale**: 
 - Markdown is human-readable and editable
 - JSON provides structured, validated data for reliable parsing
 - Reduces parsing errors and complexity
 - Enables schema validation
 - Faster processing during RAG ingestion
- **Implementation**: 
 - Create JSON schemas for validation
 - Convert markdown → JSON (one-time or on-demand)
 - Store JSON files in `knowledge/` folder
 - RAG ingestion uses JSON (preferred), markdown (fallback)
- **Benefits**: Easier parsing, better validation, consistent structure, improved maintainability

3. **File Access Strategy:**

- **Finding**: Convex actions can use `fetch()` but best practice is to accept content as parameter
- **Solution**: Actions accept `jsonContent: v.string()` (preferred) or `markdownContent: v.string()` (fallback)
- **Rationale**: Flexible, works in Convex actions, no external dependencies, allows manual copy-paste or future HTTP fetch
- **Implementation**: 
 - `populateStandardsFromJson` and `populateLERFromJson` accept JSON string parameters
 - `populateStandardsFromMarkdown` and `populateLERFromMarkdown` accept markdown string parameters (for conversion)

4. **Chunking Strategy:**

- LSS: One chunk per standard (existing approach)
- LER: One chunk per indicator+performance level (3 chunks per indicator for better granularity)
- **Consideration**: Chunking affects recall; test with real queries to optimize chunk size

5. **Namespace Strategy:**

- Keep separate: `"louisiana_standards"` and `"louisiana_educator_rubric"`
- Allows independent querying and filtering
- Enables cross-namespace searches when needed
- **Note**: Cross-namespace searches still limited to 256 results total

6. **Filter Management:**

- After consolidation, update single RAG instance in `rag.ts` with LER filters
- All files will use same RAG instance with consistent filters (9 total)
- **Verify 9 filters are supported** (test during implementation - within 16-filter limit)
- **Design consideration**: Filters are OR-ed; use composite filters or post-filtering for AND operations
- **Best practice**: Only use filters for fields used in most searches; post-filter others in actions

7. **Workflow-Based Ingestion:**

- **Decision**: Use Workflow/Workpool for bulk ingestion instead of monolithic actions
- **Rationale**: 
 - Automatic durable retries with exponential backoff
 - Ability to throttle concurrent ingestion
 - Restart-safety for long-running processes
 - Integration with Rate Limiter for embedding calls
- **Implementation**: 
 - Create workflow files: `populateStandardsWorkflow.ts`, `populateLERWorkflow.ts`
 - Use `step.runAction` for small, idempotent chunks
 - Integrate Rate Limiter with `reserve: true`
 - Use `retry` options for transient failures
 - Consider `rag.addAsync` with chunkerAction for very large files

8. **Rate Limiter Integration:**

- **Decision**: Integrate Rate Limiter into all embedding calls during ingestion
- **Rationale**: 
 - Prevents hitting upstream rate limits mid-run
 - Provides backpressure on queue
 - Avoids "try later" errors without retry logic
- **Implementation**: 
 - Use `rateLimiter.limit(..., { reserve: true })` for each embedding step
 - Wire into workflow steps that call embedding actions
 - Monitor rate limit usage and adjust limits as needed

9. **Action Cache Strategy:**

- **Decision**: Do NOT use Action Cache for ingest content embeddings
- **Rationale**: 
 - RAG already owns the text→embedding→index pipeline
 - Double-embedding would add complexity without benefit
- **Implementation**: 
 - Use Action Cache only for caching search query embeddings if doing manual `ctx.vectorSearch` outside RAG
 - Let RAG handle all ingest embeddings

10. **Code Patterns:**

- Follow [CLAUDE.md](../CLAUDE.md#architecture-patterns) for Convex function types (query, mutation, action)
- Use TypeScript strict types (no `any` - see [CLAUDE.md](../CLAUDE.md#code-conventions))
- Follow [CLAUDE.md](../CLAUDE.md#testing-architecture) for test structure and patterns
- Use [CLAUDE.md](../CLAUDE.md#workflow-system) patterns for workflow integration

## Success Criteria

- ✅ Single RAG instance used throughout codebase (Phase 0) - **COMPLETE**
- JSON schemas created and validated (Phase 1-2)
- All LSS markdown files converted to JSON and standards in RAG (Phase 1)
- All LER indicators converted to JSON and in RAG with correct structure (Phase 2)
- Search queries return relevant results with >80% precision
- Alignment workflows functional with real data (unblocked)
- Tests pass and validate data structure and schema compliance
- No breaking changes to existing functionality
- All code follows patterns documented in [CLAUDE.md](../CLAUDE.md)
- **Workflow-based ingestion with Rate Limiter integration working correctly**
- **Filter design optimized (composite filters for AND, post-filtering for less-used fields)**

## Risks & Considerations

1. **RAG Initialization Duplication (HIGH PRIORITY):** Two RAG instances must be consolidated first - this is a structural issue that could cause filter mismatches

2. **Filter Design Complexity (HIGH PRIORITY):** 
- Filters are OR-ed together; cannot express `subject = ELA AND gradeLevel = 3` as separate filters
- Need composite filters or post-filtering for AND operations
- 9 filters is within 16-filter limit but close to edge; future additions may require redesign

3. **JSON Schema Maintenance:** JSON schemas must be kept in sync with data structure changes - add validation tests. Every schema change requires:
- RAG filter design review
- Parser & ingest updates
- Possibly migration or re-ingest workflows

4. **Markdown-to-JSON Conversion:** One-time conversion needed, but markdown remains source of truth - ensure conversion is reversible/updatable

5. **File Access:** Using string parameter approach - flexible but requires manual content provision initially. JSON files can be stored in knowledge/ folder for easier access

6. **Markdown Parsing Complexity:** Standards files have varied formatting - JSON conversion handles this once, then JSON parsing is simpler. ELA uses `RL.2.1` format, Math uses `2.NBT.A.1` format

7. **RAG Filter Limits:** Adding 3 new filters (total 9) - verify Convex RAG supports this during implementation (within 16-filter limit but close to edge)

8. **Data Volume:** Large markdown files (la-ela.md is 3565 lines, la-math.md is 2057 lines) - JSON conversion processes once, then JSON parsing is faster. Process incrementally, add to RAG in batches using Workflow patterns

9. **Backward Compatibility:** Existing RAG queries in `alignmentSteps.ts` and `ragService.ts` should continue working after data population

10. **Current Workflow Broken:** Alignment scorecard workflow exists but can't work without data - this is blocking feature functionality

11. **JSON File Size:** JSON files may be large - ensure efficient parsing and batching during RAG ingestion using Workflow/Workpool patterns

12. **Workflow Durability:** Must use Workflow/Workpool for bulk ingestion to get retries, backoff, and restart-safety. Avoid monolithic actions that can timeout or fail without recovery

13. **Rate Limiting:** Bulk ingestion can easily hit provider rate limits. Must integrate Rate Limiter with `reserve: true` for each embedding step, otherwise will fail mid-run

14. **Vector Search Limits:** 256 results max per search. Cannot rely on "search everything then filter" - must design queries to narrow search region efficiently using filters and good chunking

15. **Agent Integration:** Tool-based RAG agents may not pass structured filters unless tool schemas explicitly take filter arguments. Design tool schemas carefully to ensure filters are used

16. **Action Cache Confusion:** Do not use Action Cache for ingest content embeddings (RAG already handles this). Only use for caching search query embeddings if doing manual vector search

17. **Workflow Determinism:** Workflows must be deterministic. Use `step.runAction` for RAG operations, not arbitrary fetch/crypto. Keep non-deterministic logic in actions, not workflow handlers

## Critical Path to Production

### Step 1: Populate LSS Standards (Phase 1) - **HIGHEST PRIORITY**

**Why First:** Alignment Scorecard is the core feature and requires LSS standards to function.

**Tasks:**
1. ✅ Create JSON schema for LSS standards
2. ✅ Build markdown-to-JSON converter script
3. ✅ Build JSON parser
4. ✅ Create populate actions with workflow support
5. ⏳ Convert markdown files to JSON (run `pnpm convert:standards`)
6. ⏳ Populate RAG with LSS standards using workflow

**Estimated Time:** 1-2 weeks  
**Blocking:** Alignment Scorecard functionality

### Step 2: Populate LER Rubric (Phase 2) - **HIGH PRIORITY**

**Why Second:** Alignment Scorecard needs to cite rubric descriptors. Without LER in RAG, feedback cannot reference rubric indicators.

**Tasks:**
1. Extend RAG filters (add `lerDomain`, `lerIndicator`, `performanceLevel`)
2. Create LER data model and JSON schema
3. Extend markdown-to-JSON converter for LER
4. Build LER JSON parser
5. Create LER populator with workflow support
6. Convert LER markdown to JSON (one-time)
7. Populate RAG with LER indicators using workflow

**Estimated Time:** 1-2 weeks  
**Blocking:** Rubric-integrated feedback in Alignment Scorecard

### Step 3: Integrate LER into App Interactions (Phase 3) - **HIGH PRIORITY**

**Why Third:** This "fuses" LER rubric into app interactions. Without this, LER data exists but isn't used.

**Tasks:**
1. Add LER search functions to `ragService.ts`
2. Update `alignmentSteps.ts` to retrieve LER indicators
3. Update agent prompts to reference rubric descriptors
4. Update scorecard generation to cite performance levels
5. Test end-to-end with real data

**Estimated Time:** 1 week  
**Blocking:** Authentic rubric-integrated feedback

### Step 4: Validate & Optimize (Phase 4) - **ONGOING**

**Why Fourth:** Ensure accuracy and performance with real data.

**Tasks:**
1. Run integration tests with populated RAG
2. Validate search accuracy (precision/recall)
3. Optimize query thresholds
4. Monitor costs and rate limits
5. Test with real user scenarios

**Estimated Time:** Ongoing  
**Blocking:** Production confidence

## Current App Interaction Gap

### What's Happening Now

**Alignment Scorecard Workflow:**
1. `retrieveStandards` searches RAG for LSS standards ✅ (but returns test data only)
2. `analyzeWithAgent` analyzes content against standards ✅ (but no LER context)
3. `generateScorecard` creates scorecard ✅ (but cannot cite rubric descriptors)

**Missing:**
- ❌ No LER indicator retrieval
- ❌ No rubric descriptor context in agent prompts
- ❌ No performance level citations in feedback
- ❌ No validation against rubric expectations

### What Should Happen (After Phases 1-3)

**Alignment Scorecard Workflow:**
1. `retrieveStandards` searches RAG for LSS standards ✅ (with real data)
2. **NEW:** `retrieveLERIndicators` searches RAG for relevant LER indicators ✅
3. `analyzeWithAgent` analyzes content against standards + rubric indicators ✅
4. `generateScorecard` creates scorecard with rubric citations ✅

**Example Feedback:**
```
Your content aligns with Louisiana Standard RL.3.1 (Proficient Level 3).

Rubric Alignment:
- Standards and Objectives (SO): Proficient - "Learning objectives and state content standards are communicated."
- Presenting Instructional Content (PIC): Proficient - "Presentation of content consistently includes visuals that establish the purpose of the lesson."

To reach Exemplary (Level 5):
- Students should be able to articulate what they are learning and why
- Learning objectives should be displayed and referenced throughout the lesson with explanations
```

## Next Steps After Completion

- Consider parsing `la-ler-eval.md` for additional LER context
- Add cross-references between LER indicators and LSS standards
- Optimize embedding text format based on retrieval accuracy
- Add caching for frequently accessed queries (using Action Cache for query embeddings if needed)
- Monitor RAG performance and costs with real usage
- Automate JSON regeneration when markdown files change (future enhancement)
- **Review filter design:** If more filters needed, consider which should be index-level vs. post-filtered
- **Optimize chunking:** Test different chunk sizes based on real query performance
- **Monitor rate limits:** Adjust Rate Limiter limits based on actual usage patterns
- **Explore recent AI model releases:** Review latest OpenAI and Gemini model families for cost optimization and improved functionality (see Technical Constraints section 3.c)

## References

- **Technical Architecture:** [CLAUDE.md](../CLAUDE.md) - Convex patterns, function types, testing, workflows
- **Project Vision:** [PROJECT.md](../PROJECT.md) - Strategic context and Louisiana Educator Rubric integration
- **RAG Component:** `@convex-dev/rag` - Convex RAG component documentation
- **Workflow System:** `@convex-dev/workflow` - Multi-step process management
- **Rate Limiter:** `@convex-dev/rate-limiter` - Rate limiting for API calls
- **Vector Search Limits:** [Vector search limits](https://docs.convex.dev/search/vector-search#limits)
- **Filtered Search:** [Filtered search](https://www.convex.dev/components/rag#filtered-search)
- **RAG Async Ingest:** [Add entries asynchronously](https://www.convex.dev/components/rag#add-entries-asynchronously-using-file-storage)
- **Workflow Usage:** [Workflow usage](https://www.convex.dev/components/workflow#usage)
- **Agents RAG Approaches:** [Agents RAG approaches](https://docs.convex.dev/agents/rag#rag-approaches)
