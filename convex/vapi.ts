import { httpAction, internalAction, action } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const webhook = httpAction(async (ctx, request) => {
  const body = await request.json();
  console.log("Vapi webhook received:", body);

  try {
    // Handle different message types from Vapi
    switch (body.message?.type) {
      case "function-call":
        return await handleFunctionCall(ctx, body);
      
      case "transcript":
        // Handle transcript if needed for logging
        console.log("Transcript:", body.message.transcript);
        break;
      
      case "hang":
        console.log("Call ended");
        break;
      
      default:
        console.log("Unhandled message type:", body.message?.type);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Vapi webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function handleFunctionCall(ctx: any, body: any) {
  const { functionCall } = body.message;
  
  if (functionCall.name === "sendMessage") {
    try {
      // Extract the user's message from the function call
      const userMessage = functionCall.parameters?.message || body.message.transcript;
      
      if (!userMessage) {
        return new Response(JSON.stringify({
          result: "I didn't catch that. Could you please repeat your question?"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Use the internal action to process the voice message
      // For now, we'll process without user context since webhooks don't have auth
      // In a production system, you'd want to pass user context through the webhook
      const aiResponse = await ctx.runAction(internal.vapi.processVoiceMessage, {
        message: userMessage,
        userId: undefined, // TODO: Extract from webhook if available
        spaceId: undefined // TODO: Extract from webhook if available
      });

      return new Response(JSON.stringify({
        result: aiResponse
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing message:", error);
      return new Response(JSON.stringify({
        result: "I'm sorry, I encountered an error processing your request. Please try again."
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Default response for unknown function calls
  return new Response(JSON.stringify({
    result: "I'm not sure how to help with that. Could you rephrase your question?"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Internal action to process voice messages with RAG integration
export const processVoiceMessage = internalAction({
  args: { 
    message: v.string(),
    userId: v.optional(v.string()), // Changed to string for Better Auth compatibility
    spaceId: v.optional(v.id("spaces"))
  },
  handler: async (ctx, args): Promise<string> => {
    try {
      // Check if this is a district policy query
      const isPolicyQuery = /district|policy|procedure|guideline|requirement|standard|curriculum|assessment|evaluation|rubric|syllabus|attendance|discipline|safety|emergency|grading|homework|field trip|professional development|communication|technology|accommodation|IEP|504|bullying|harassment|FERPA|privacy|SIS|testing|intervention|support|behavior|management|equity|diversity|cultural|bias|inclusive/i.test(args.message);
      
      let prompt = `You are A.I.D.A., the Intelligent Experience Platform for Education. You are the voice of this district's digital ecosystem, providing instant access to official policies, procedures, and information. You speak with authority and clarity, always citing official sources when available.

Keep your response concise and conversational for voice interaction (under 200 words).

User question: ${args.message}`;

      // If it's a policy query and we have user context, try to use RAG
      if (isPolicyQuery && args.userId) {
        try {
          // Use RAG to search for relevant district policies
          const ragResult = await ctx.runAction(api.rag.semanticSearch, {
            query: args.message,
            spaceId: args.spaceId,
            limit: 5
          });

          if (ragResult.results.length > 0) {
            prompt += `\n\nRelevant district information found:\n${ragResult.text}`;
            prompt += `\n\nPlease provide specific guidance based on the district policies and procedures found above. Reference specific policies when applicable.`;
          } else {
            prompt += `\n\nNote: No specific district policies were found for this query. Provide general best practices guidance.`;
          }
        } catch (ragError) {
          console.log("RAG search failed, falling back to general response:", ragError);
          prompt += `\n\nPlease provide helpful, specific guidance based on instructional design best practices.`;
        }
      } else {
        prompt += `\n\nPlease provide helpful, specific guidance based on instructional design best practices.`;
      }

      // Generate AI response
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";

      return aiResponse;
    } catch (error) {
      console.error("Error in voice message processing:", error);
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  },
});

// Action for authenticated voice queries with RAG integration
export const processAuthenticatedVoiceQuery = action({
  args: {
    message: v.string(),
    spaceId: v.optional(v.id("spaces")),
  },
  handler: async (ctx, args): Promise<{
    response: string;
    sources: string[];
    isPolicyQuery: boolean;
  }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    try {
      // Check if this is a district policy query
      const isPolicyQuery = /district|policy|procedure|guideline|requirement|standard|curriculum|assessment|evaluation|rubric|syllabus|attendance|discipline|safety|emergency|grading|homework|field trip|professional development|communication|technology|accommodation|IEP|504|bullying|harassment|FERPA|privacy|SIS|testing|intervention|support|behavior|management|equity|diversity|cultural|bias|inclusive/i.test(args.message);
      
      let response = "";
      let sources: string[] = [];

      if (isPolicyQuery) {
        try {
          // Use RAG to search for relevant district policies
          const ragResult = await ctx.runAction(api.rag.semanticSearch, {
            query: args.message,
            spaceId: args.spaceId,
            limit: 5
          });

          if (ragResult.results.length > 0) {
            // Generate response with RAG context
            const ragResponse = await ctx.runAction(api.rag.generateResponseWithRAG, {
              message: args.message,
              spaceId: args.spaceId
            });

            response = ragResponse.response;
            sources = ragResult.results.map((result: any) => 
              result.metadata?.fileName || result.metadata?.title || "Unknown source"
            );
          } else {
            // No RAG results, provide general guidance
            response = await ctx.runAction(internal.vapi.processVoiceMessage, {
              message: args.message,
              userId,
              spaceId: args.spaceId
            });
            sources = [];
          }
        } catch (ragError) {
          console.log("RAG search failed, falling back to general response:", ragError);
          response = await ctx.runAction(internal.vapi.processVoiceMessage, {
            message: args.message,
            userId,
            spaceId: args.spaceId
          });
          sources = [];
        }
      } else {
        // Not a policy query, use general processing
        response = await ctx.runAction(internal.vapi.processVoiceMessage, {
          message: args.message,
          userId,
          spaceId: args.spaceId
        });
        sources = [];
      }

      // Log the voice query for audit purposes
      await ctx.runMutation(api.security.createAuditLog, {
        action: "voice_query",
        resource: isPolicyQuery ? "district_policy" : "general_query",
        details: `Voice query: ${args.message.substring(0, 100)}${args.message.length > 100 ? "..." : ""}`,
        spaceId: args.spaceId,
      });

      return {
        response,
        sources,
        isPolicyQuery
      };
    } catch (error) {
      console.error("Error in authenticated voice query processing:", error);
      return {
        response: "I'm sorry, I encountered an error processing your request. Please try again.",
        sources: [],
        isPolicyQuery: false
      };
    }
  },
});
