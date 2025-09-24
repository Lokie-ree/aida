/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as documents from "../documents.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as router from "../router.js";
import type * as scrapingActions from "../scrapingActions.js";
import type * as spaces from "../spaces.js";
import type * as vapi from "../vapi.js";
import type * as webscraping from "../webscraping.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  documents: typeof documents;
  feedback: typeof feedback;
  http: typeof http;
  router: typeof router;
  scrapingActions: typeof scrapingActions;
  spaces: typeof spaces;
  vapi: typeof vapi;
  webscraping: typeof webscraping;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
