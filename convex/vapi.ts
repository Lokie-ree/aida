import { httpAction, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
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
      const aiResponse = await ctx.runAction(internal.vapi.processVoiceMessage, {
        message: userMessage
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

// Internal action to process voice messages without authentication
export const processVoiceMessage = internalAction({
  args: { message: v.string() },
  handler: async (ctx, args): Promise<string> => {
    try {
      // For voice interactions, we'll provide a simpler response without document context
      // since we don't have user authentication in webhooks
      const prompt = `You are A.I.D.A. (AI Instructional Design Assistant), an expert instructional coach with years of experience in curriculum design and pedagogy. You provide constructive, actionable feedback to enhance teaching and learning.

Keep your response concise and conversational for voice interaction (under 200 words).

User question: ${args.message}

Please provide helpful, specific guidance based on instructional design best practices.`;

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
