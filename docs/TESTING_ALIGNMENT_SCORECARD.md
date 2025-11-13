# Testing the Alignment Scorecard POC

This guide explains how to test the Alignment Scorecard workflow implementation.

## Prerequisites

1. **Populate RAG with Louisiana Standards** (one-time setup)
2. **Start a workflow** with sample content
3. **Monitor workflow status** reactively
4. **Verify results** in the database

## Step 1: Populate Standards (One-Time Setup)

Before testing, you need to populate the RAG with Louisiana Standards. You have two options:

### Option A: Use Test Data (Quick Start)

Create a test action to add sample standards:

```typescript
// In convex/testHelpers.ts or similar
export const addTestStandards = action({
  args: {},
  handler: async (ctx) => {
    const testStandards = [
      {
        standardCode: "LA.ELA.10.1",
        gradeLevel: "10",
        subject: "ela",
        standardText: "Cite strong and thorough textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.",
        cognitiveDepth: "application" as const,
      },
      {
        standardCode: "LA.ELA.10.2",
        gradeLevel: "10",
        subject: "ela",
        standardText: "Determine a theme or central idea of a text and analyze in detail its development over the course of the text.",
        cognitiveDepth: "synthesis" as const,
      },
    ];
    
    return await ctx.runAction(internal.populateStandards.populateStandardsFromData, {
      standards: testStandards,
    });
  },
});
```

### Option B: Scrape Real Standards (Full Setup)

```typescript
// Run this action to scrape and populate real Louisiana Standards
await ctx.runAction(api.populateStandards.populateStandardsFromScraper, {});
```

**Note:** The scraper currently has placeholder PDF parsing. You'll need to implement actual PDF parsing or use pre-processed data.

## Step 2: Test the Workflow

### From the Frontend (React)

```typescript
import { useAction, useQuery } from "convex/react";
import { api } from "./convex/_generated/api";

function AlignmentScorecardTest() {
  const analyzeContent = useAction(api.rag.analyzeContentAlignment);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  
  // Reactively subscribe to workflow status
  const workflowStatus = useQuery(
    api.rag.getAlignmentStatus,
    workflowId ? { workflowId } : "skip"
  );

  const handleTest = async () => {
    const sampleContent = `
      Quiz: Reading Comprehension
      
      1. What is the main idea of the passage?
      a) Option A
      b) Option B
      c) Option C
      
      2. Based on the text, what can you infer about the character?
      a) Option A
      b) Option B
    `;

    const result = await analyzeContent({
      content: sampleContent,
      gradeLevel: "10",
      subject: "ela",
    });
    
    setWorkflowId(result.workflowId);
  };

  return (
    <div>
      <button onClick={handleTest}>Test Alignment Scorecard</button>
      
      {workflowStatus && (
        <div>
          <h3>Workflow Status</h3>
          <pre>{JSON.stringify(workflowStatus, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### From Convex Dashboard

1. Go to your Convex dashboard
2. Navigate to "Functions"
3. Find `rag:analyzeContentAlignment`
4. Click "Run" and provide:
   ```json
   {
     "content": "Sample quiz content here...",
     "gradeLevel": "10",
     "subject": "ela"
   }
   ```
5. Copy the returned `workflowId`
6. Query `rag:getAlignmentStatus` with the `workflowId` to monitor progress

### From a Test Action

```typescript
// convex/testAlignment.ts
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

export const testAlignmentScorecard = action({
  args: {},
  handler: async (ctx) => {
    // Sample content to analyze
    const sampleContent = `
      Lesson Plan: Analyzing Theme in Literature
      
      Objective: Students will identify and analyze themes in selected texts.
      
      Activities:
      1. Read chapter 5 of "To Kill a Mockingbird"
      2. Answer comprehension questions
      3. Write a paragraph about the theme
    `;

    // Start the workflow
    const { workflowId } = await ctx.runAction(
      api.rag.analyzeContentAlignment,
      {
        content: sampleContent,
        gradeLevel: "10",
        subject: "ela",
      }
    );

    console.log("Workflow started:", workflowId);

    // Poll for completion (in production, use reactive queries)
    let status;
    let attempts = 0;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      status = await ctx.runQuery(api.rag.getAlignmentStatus, { workflowId });
      attempts++;
      console.log(`Attempt ${attempts}:`, status?.status);
    } while (status?.status === "inProgress" && attempts < 30);

    return {
      workflowId,
      finalStatus: status,
    };
  },
});
```

## Step 3: Verify Results

### Check the Database

Query the `alignmentAnalyses` table:

```typescript
// In Convex Dashboard or a query function
export const getRecentAnalyses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("alignmentAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});
```

### Expected Results Structure

```json
{
  "_id": "...",
  "userId": "...",
  "content": "Sample quiz content...",
  "gradeLevel": "10",
  "subject": "ela",
  "alignmentScore": 75,
  "scorecard": {
    "overallScore": 75,
    "breakdown": [
      {
        "standardCode": "LA.ELA.10.1",
        "score": 80,
        "status": "aligned",
        "notes": "Content addresses this standard well"
      }
    ],
    "gaps": [
      "Missing application-level questions for standard LA.ELA.10.2"
    ],
    "recommendations": [
      "Add synthesis-level questions to meet cognitive depth requirements"
    ]
  },
  "analyzedAt": 1234567890
}
```

## Step 4: Debugging

### Check Workflow Logs

1. Go to Convex Dashboard → Functions
2. Find your workflow execution
3. Check the logs for each step:
   - "Retrieve Louisiana Standards"
   - "Analyze Content Alignment"
   - "Generate Alignment Scorecard"
   - "Save Analysis Results"

### Common Issues

1. **No standards found**: 
   - Ensure RAG is populated with standards
   - Check namespace is "louisiana_standards"
   - Verify filters match (gradeLevel, subject)

2. **Agent errors**:
   - Check OpenAI API key is set
   - Verify model name is correct ("gpt-4o")
   - Check rate limits

3. **Workflow stuck**:
   - Check workflow status in dashboard
   - Look for error messages in logs
   - Verify all steps are completing

### Test Individual Steps

You can test each step independently:

```typescript
// Test RAG search
const standards = await ctx.runAction(
  internal.alignmentSteps.retrieveStandards,
  {
    gradeLevel: "10",
    subject: "ela",
  }
);

// Test Agent analysis (without full workflow)
const analysis = await ctx.runAction(
  internal.alignmentSteps.analyzeWithAgent,
  {
    content: "Sample content",
    standards: standards,
  }
);
```

## Step 5: Integration Testing

Create a comprehensive test that exercises the full flow:

```typescript
// convex/integrationTests.ts
export const fullIntegrationTest = action({
  args: {},
  handler: async (ctx) => {
    // 1. Ensure standards are populated
    const populateResult = await ctx.runAction(
      api.populateStandards.populateStandardsFromScraper,
      {}
    );
    console.log("Standards populated:", populateResult);

    // 2. Test with multiple content types
    const testCases = [
      {
        name: "Quiz",
        content: "Multiple choice quiz about theme analysis...",
        gradeLevel: "10",
        subject: "ela" as const,
      },
      {
        name: "Lesson Plan",
        content: "Lesson plan for teaching character development...",
        gradeLevel: "9",
        subject: "ela" as const,
      },
    ];

    const results = [];
    for (const testCase of testCases) {
      const { workflowId } = await ctx.runAction(
        api.rag.analyzeContentAlignment,
        testCase
      );

      // Wait for completion
      let status;
      do {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        status = await ctx.runQuery(api.rag.getAlignmentStatus, { workflowId });
      } while (status?.status === "inProgress");

      results.push({
        testCase: testCase.name,
        workflowId,
        status,
      });
    }

    return results;
  },
});
```

## Next Steps

Once basic testing passes:

1. **Add more test cases** with various content types
2. **Test error handling** (invalid inputs, missing standards, etc.)
3. **Performance testing** (large content, many standards)
4. **User acceptance testing** with real educators

## Monitoring in Production

- Set up alerts for workflow failures
- Track alignment scores over time
- Monitor Agent usage and costs
- Collect feedback on scorecard quality

