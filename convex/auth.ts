/**
 * ✅ ACTIVE - Used in production
 * Authentication: loggedInUser, createAuth, authComponent
 */
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { api } from "./_generated/api";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
// Better Auth component client
// Note: Triggers are not used because Better Auth components are isolated
// and cannot access application tables (betaSignups, userProfiles, betaProgram).
// User initialization happens in DashboardRoute after successful authentication.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [
      siteUrl,
      "http://localhost:5173", // Frontend dev server
      "http://localhost:5174", // Alternative port
    ],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The cross domain plugin is required for client side frameworks
      crossDomain({ siteUrl }),
      // The Convex plugin is required for Convex compatibility
      convex(),
      // Magic Link plugin for passwordless authentication via Resend
      magicLink({
        sendMagicLink: async ({ email, url, token }, request) => {
          // Send magic link email via Resend component
          await requireActionCtx(ctx).runAction(api.email.sendMagicLinkEmail, {
            email,
            url,
          });
        },
        expiresIn: 300, // 5 minutes for regular sign-in requests
        disableSignUp: false, // Allow account creation on first magic link click
      }),
    ],
  });
};

// Get the current logged-in user
export const loggedInUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});